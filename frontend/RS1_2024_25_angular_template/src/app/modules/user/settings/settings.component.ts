import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
  DeleteUserRequest,
  GetUserByIdRequest,
  GetUserByIdResponse,
  UserService
} from '../../../endpoints/user-endpoints/get-user-endpoint';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  showDeleteModal = false;

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  user:GetUserByIdResponse = {
    id: 0,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isAdmin: false,
    isOwner: false,
    isWorker: false,
    isDeleted: false,
  };

  ngOnInit() {

    this.loadUser();
  }

  constructor(
    private router:Router,
    private userService:UserService,
    private myAuthService: MyAuthService,
  ) {}

   get isOwner(): boolean {
    return this.myAuthService.isOwner();
   }
  loadUser(){
    const request: GetUserByIdRequest = { id: <number>this.myAuthService.getMyAuthInfo()?.personID };
    this.userService.getUserById(request).subscribe((user) => {
        this.user = user;
      },
      (error) => {
        console.error('Error fetching user:', error);
        alert('Could not fetch user details.');
      }
    );
  }

  goToVerify(){
    this.router.navigate(['/public/owner-verify']);
  }

  confirmDelete() {
    const userId = <number>this.myAuthService.getMyAuthInfo()?.personID;

    const request: DeleteUserRequest = { id: userId };

    this.userService.disableUser(request).subscribe({
      next: () => {
        // Ovdje dodaj logiku za odjavu korisnika
        this.myAuthService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Greška prilikom brisanja korisnika:', err);
      }
    });
  }

  logout(){
    this.myAuthService.logout();
    this.router.navigate(['/login']);
  }

}
