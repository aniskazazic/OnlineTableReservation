import { Component, OnInit } from '@angular/core';
import { AuthRequestEndpointService, RegisterRequest } from '../../../endpoints/auth-endpoints/auth-register-endpoint.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import zxcvbn from 'zxcvbn';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import {ToastrService} from 'ngx-toastr';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerRequest: RegisterRequest = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    isOwner: false,
    phoneNumber:'',
    birthDate: new Date(),
  };



  passwordStrengthScore: number = 0;
  passwordStrengthText: string = '';
  passwordStrengthClass: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  currentStep: number = 1;
  totalSteps: number = 3;
  validationErrors: string[] = [];
  currentLang: string;
  translations: any = {};


  constructor(
    private authRegisterService: AuthRequestEndpointService,
    private router: Router,
    private translate: TranslateService,
    private toaster:ToastrService
  ) {this.currentLang= localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  ngOnInit() {
    this.loadTranslations();
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  onOwnerToggle() {
    if (this.registerRequest.isOwner) {
      this.totalSteps = 4;
    } else {
      this.totalSteps = 3;
    }
  }

  loadTranslations() {
    this.translate.get('REGISTER').subscribe((translations) => {
      this.translations = translations;
    });
  }

  nextStep() {
    if (this.isStepValid()) {
      this.currentStep++;
      this.validationErrors = [];
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.isValid()) {
      this.authRegisterService.handleAsync(this.registerRequest).subscribe({
        next: (response:any) => {
          if (this.registerRequest.isOwner == true) {

            const newUserId = response.userId;
            localStorage.setItem('newlyRegisteredOwnerId', newUserId.toString());

            this.router.navigate(['/addlocale']);
          } else {
            this.toaster.success("Uspješno ste kreirali račun. Možete se prijaviti.");
            this.router.navigate(['/login']);
          }
        },
        error: (error: any) => {
          this.validationErrors.push(this.translations.VALIDATION_ERRORS.GENERAL_ERROR);
          console.error('Register error:', error);
        }
      });
    } else {
      console.log('Form is invalid. Errors:', this.validationErrors);
    }
  }


  checkPasswordStrength(): void {
    const result = zxcvbn(this.registerRequest.password);

    this.passwordStrengthScore = result.score;

    switch (result.score) {
      case 0:
      case 1:
        this.passwordStrengthText = this.translations?.PASSWORD_STRENGTH?.WEAK || 'Password strength: Weak';
        this.passwordStrengthClass = 'weak';
        break;
      case 2:
        this.passwordStrengthText = this.translations?.PASSWORD_STRENGTH?.FAIR || 'Password strength: Fair';
        this.passwordStrengthClass = 'fair';
        break;
      case 3:
        this.passwordStrengthText = this.translations?.PASSWORD_STRENGTH?.GOOD || 'Password strength: Good';
        this.passwordStrengthClass = 'good';
        break;
      case 4:
        this.passwordStrengthText = this.translations?.PASSWORD_STRENGTH?.STRONG || 'Password strength: Strong';
        this.passwordStrengthClass = 'strong';
        break;
    }
  }


  isValid(): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;


    this.validationErrors = [];

    if (this.registerRequest.firstName.trim() === '') {
      this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_FIRST_NAME);
    }
    if (this.registerRequest.lastName.trim() === '') {
      this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_LAST_NAME);
    }
    if (this.registerRequest.username.trim() === '') {
      this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_USERNAME);
    }
    if (!this.registerRequest.email.trim()) {
      this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_EMAIL);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerRequest.email)) {
      this.validationErrors.push(this.translations.VALIDATION_ERRORS.INVALID_EMAIL);
    }
    if (!passwordRegex.test(this.registerRequest.password)) {
      this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_PASSWORD);
    }
    if (this.registerRequest.password !== this.registerRequest.confirmPassword) {
      this.validationErrors.push(this.translations.VALIDATION_ERRORS.PASSWORD_MISMATCH);
    }

    if (this.registerRequest.isOwner) {
      if (!this.registerRequest.phoneNumber?.trim()) {
        this.validationErrors.push("Phone number is required for owner.");
      }
      if (!this.registerRequest.birthDate) {
        this.validationErrors.push("Birthdate is required for owner.");
      }
    }

    return this.validationErrors.length === 0;
  }


  isStepValid(): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    this.validationErrors = [];
    if (this.currentStep === 1) {
      if (this.registerRequest.firstName.trim() === '') {
        this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_FIRST_NAME);
      }
      if (this.registerRequest.lastName.trim() === '') {
        this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_LAST_NAME);
      }
    } else if (this.currentStep === 2) {
      if (this.registerRequest.username.trim() === '') {
        this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_USERNAME);
      }
      if (!this.registerRequest.email.trim()) {
        this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_EMAIL);
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerRequest.email)) {
        this.validationErrors.push(this.translations.VALIDATION_ERRORS.INVALID_EMAIL);
      }
    } else if (this.currentStep === 3) {
      if (!passwordRegex.test(this.registerRequest.password)) {
        this.validationErrors.push(this.translations.VALIDATION_ERRORS.REQUIRED_PASSWORD);
      }
      if (this.registerRequest.password !== this.registerRequest.confirmPassword) {
        this.validationErrors.push(this.translations.VALIDATION_ERRORS.PASSWORD_MISMATCH);
      }
    }
    else if (this.currentStep === 4 && this.registerRequest.isOwner) {
      if (!this.registerRequest.phoneNumber?.trim()) {
        this.validationErrors.push("Phone number is required for owner.");
      }
      if (!this.registerRequest.birthDate) {
        this.validationErrors.push("Birthdate is required for owner.");
      }
    }

    return this.validationErrors.length === 0;
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  changeLanguage(event: any): void {
    const selectedLang = event.target.value;
    this.translate.use(selectedLang);
    this.currentLang = selectedLang;
    localStorage.setItem('language', selectedLang); // Persist the selected language
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


}
