import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { MyAuthService } from '../../../../services/auth-services/my-auth.service';
import { UserService, GetUserByIdRequest } from '../../../../endpoints/user-endpoints/get-user-endpoint';

interface EditProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  form!: FormGroup;
  message: string | null = null;

  showPasswordModal = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordMessage: string | null = null;
  passwordError: string | null = null;


  constructor(
    private userService: UserService,
    private myAuthService: MyAuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUser();
  }

  private initForm(): void {
    this.form = this.fb.group<EditProfileForm>(
      {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
      }
    );
  }
  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword')?.value;
      const confirmNewPassword = control.get('confirmNewPassword')?.value;

      return newPassword && confirmNewPassword && newPassword !== confirmNewPassword
        ? { passwordsMismatch: true }
        : null;
    };
  }

  openPasswordModal(): void {
    this.showPasswordModal = true;
    this.passwordMessage = null;
    this.passwordError = null;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
  }


  changePassword(): void {
    this.passwordError = null;
    this.passwordMessage = null;

    if (!this.oldPassword || !this.newPassword || !this.confirmNewPassword) {
      this.passwordError = "Sva polja su obavezna.";
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordError = "Nove lozinke se ne podudaraju.";
      return;
    }

    const request = {
      id: Number(this.myAuthService.getMyAuthInfo()?.personID),
      currentPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.userService.changePassword(request).subscribe({
      next: (res) => {
        this.passwordMessage = res?.message || "Lozinka uspješno promijenjena.";
        setTimeout(() => this.closePasswordModal(), 1500);
      },
      error: (err) => {
        this.passwordError = err?.error?.message || "Greška pri promjeni lozinke.";
      }
    });}

  private loadUser(): void {
    const request: GetUserByIdRequest = {
      id: Number(this.myAuthService.getMyAuthInfo()?.personID)
    };

    this.userService.getUserById(request).subscribe({
      next: (user) => {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username
        });
      },
      error: () => {
        this.message = "Ne mogu učitati korisničke podatke.";
      }
    });
  }



  saveChanges(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message = "Molimo ispravite greške u formi.";
      return;
    }

    const { firstName, lastName, email, username} = this.form.value as EditProfileForm;

    const updateRequest = {
      id: Number(this.myAuthService.getMyAuthInfo()?.personID),
      userName: username,
      email,
      firstName,
      lastName,
    };



    console.log(updateRequest)

    this.userService.updateUserProfile(updateRequest).subscribe({
      next: (response) => {
        this.message = response?.message || "Podaci uspješno ažurirani.";
      },
      error: (err) => {
        this.message = err?.error?.message || "Došlo je do greške pri ažuriranju.";
      }
    });
  }





}
