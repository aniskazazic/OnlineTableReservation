import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {WorkerController, WorkerUpdateOrInsertRequest} from '../../../../endpoints/worker-controller/worker-controller';

@Component({
  selector: 'app-workers-edit',
  templateUrl: './workers-edit.component.html',
  styleUrls: ['./workers-edit.component.css']
})

export class WorkersEditComponent implements OnInit {

  form!: FormGroup;
  workerId:number=0;
  localeId:number = 0;
  passwordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private workerService: WorkerController,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['workerId']) {
        this.workerId = +params['workerId'];


        this.loadWorker(this.workerId);
      }

      if (params['localeId']) {
        this.localeId = +params['localeId'];
      }
    });

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', this.workerId === 0 ? [Validators.required, Validators.minLength(6)] : []],
      phoneNumber: ['', Validators.required],
      birthDate: ['', Validators.required],
      hireDate: [new Date().toISOString().substring(0, 10), Validators.required]
    });

  }

  loadWorker(id: number): void {
    this.workerService.getWorkerById(id).subscribe({
      next: (worker) => {

        this.form.patchValue({
          firstName: worker.firstName,
          lastName: worker.lastName,
          email: worker.email,
          username: worker.username,
          phoneNumber: worker.phoneNumber,
          birthDate: worker.birthDate ? new Date(worker.birthDate).toISOString().substring(0, 10) : '',
          hireDate: worker.hireDate ? new Date(worker.hireDate).toISOString().substring(0, 10) : ''
        });

        this.localeId = worker.localeId;

        // Lozinku ne postavljamo jer se ne vraća i ne smije se prikazivati
        this.form.get('password')?.setValidators([]); // lozinka nije obavezna za edit
        this.form.get('password')?.updateValueAndValidity();
      },
      error: (err) => {
        console.error('Greška pri učitavanju workera', err);
      }
    });
  }

  saveWorker(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const request: WorkerUpdateOrInsertRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      username: formValue.username,
      phoneNumber: formValue.phoneNumber,
      hireDate: formValue.hireDate,
      password: formValue.password, // samo kod inserta
      localeId: this.workerId === 0 ? this.localeId : undefined,
      birthDate: formValue.birthDate,
      id: this.workerId !== 0 ? this.workerId : undefined
    };

    console.log("Insert request:", request);

    this.workerService.updateOrInsertWorker(request).subscribe({
      next: () => this.router.navigate(['/owner/workers', this.localeId]),
      error: (err) => console.error('Error saving worker', err)
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

}


