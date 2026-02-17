import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { WorkerController, WorkerGetResponse, WorkerUpdateRequest } from '../../../endpoints/worker-controller/worker-controller';
import { MyPagedList } from '../../../endpoints/reviews-endpoints/reviews-endpoints';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent implements OnInit {

  localeId: number = 0;
  searchSubject: Subject<string> = new Subject<string>();
  workersForm!: FormGroup;   // sada je FormGroup, ne FormArray
  page = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  totalPages: number = 1;
  editRow: { [key: number]: boolean } = {};

  deleteWorkerId: number = 0;
  showDeleteModal: boolean = false;

  request = {
    q: '',
    pageNumber: 1,
    pageSize: 5
  };

  constructor(
    private fb: FormBuilder,
    private workerService: WorkerController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.localeId = +params['id'] || 0;
    });

    // inicijalizuj formu
    this.workersForm = this.fb.group({
      workers: this.fb.array([])
    });

    this.initSearchListener();
    this.loadWorkers();
  }

  get workersArray(): FormArray {
    return this.workersForm.get('workers') as FormArray;
  }

  get workersControls() {
    return this.workersArray.controls as FormGroup[];
  }

  loadWorkers(search: string = '') {
    this.request.q = search;
    this.request.pageNumber = this.page;
    this.request.pageSize = this.pageSize;

    this.workerService.getAllWorkers(this.request).subscribe({
      next: (res: MyPagedList<WorkerGetResponse>) => {
        this.totalCount = res.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);

        // resetuj FormArray
        this.workersArray.clear();

        res.dataItems.forEach(worker => {
          this.workersArray.push(
            this.fb.group({
              id: [worker.id],
              username: [worker.username, Validators.required],
              email: [worker.email, [Validators.required, Validators.email]],
              phoneNumber: [worker.phoneNumber, Validators.required],
              firstName: [worker.firstName],
              lastName: [worker.lastName],
              hireDate: [worker.hireDate]
            })
          );
        });
      },
      error: (err) => {
        console.error('Greška pri dohvaćanju radnika', err);
      }
    });
  }

  initSearchListener() {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      this.loadWorkers(term);
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.page = 1;
    this.searchSubject.next(value);
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadWorkers();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadWorkers();
    }
  }

  openDeleteModal(id: number) {
    this.deleteWorkerId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteWorkerId = 0;
  }

  confirmDelete() {
    if (this.deleteWorkerId !== 0) {
      this.workerService.deleteWorker(this.deleteWorkerId).subscribe({
        next: () => {
          this.loadWorkers();
          this.closeDeleteModal();
        }
      });
    }
  }

  toLocaleOverview() {
    this.router.navigateByUrl('/owner/overview/' + this.localeId);
  }

  toReservations() {
    this.router.navigateByUrl('/owner/reservations/' + this.localeId);
  }

  updateWorker(index: number): void {
    const group = this.workersControls[index];
    if (group.invalid) {
      group.markAllAsTouched();
      return;
    }

    const worker: WorkerUpdateRequest = group.value;

    this.workerService.updateWorker(worker.id, worker).subscribe({
      next: () => {
        this.editRow[index] = false;
        this.loadWorkers();
      },
      error: (err) => console.error('Error saving:', err)
    });
  }

  editWorker(id:number){
    this.router.navigate(['/owner/worker/edit', id]);
  }

  toSettings(){
    this.router.navigateByUrl("/public/update-locale/"+ this.localeId)
  }

}
