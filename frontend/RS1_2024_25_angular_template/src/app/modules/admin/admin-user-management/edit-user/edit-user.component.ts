import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, GetUserByIdResponse, UpdateUserRequest, GetUserByIdRequest } from '../../../../endpoints/user-endpoints/get-user-endpoint';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit {
  user: GetUserByIdResponse = {
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

  constructor(
    private userService: UserService,
    protected router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();

    const state = navigation?.extras.state as { user?: GetUserByIdResponse } | undefined;

    if (state?.user) {
      this.user = state.user;
    } else {
      this.activatedRoute.params.subscribe((params) => {
        const userId = +params['id']; // Convert string to number
        if (userId) {
          this.fetchUser(userId);
        } else {
        }
      });
    }
  }


  fetchUser(userId: number): void {
    const request: GetUserByIdRequest = { id: userId };
    this.userService.getUserById(request).subscribe(
      (user) => {
        this.user = user;
      },
      (error) => {
        console.error('Error fetching user:', error);
        alert('Could not fetch user details.');
      }
    );
  }

  updateUser(): void {
    const updateRequest: UpdateUserRequest = {
      id: this.user.id,
      userName: this.user.username,
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
    };

    this.userService.updateUser(updateRequest).subscribe(
      (response) => {
        alert('User updated successfully.');
        this.router.navigate(['/admin/user']);
      },
      (error) => {
        console.error('Error updating user:', error);
        this.router.navigate(['/admin/user']);
      }
    );
  }
}
