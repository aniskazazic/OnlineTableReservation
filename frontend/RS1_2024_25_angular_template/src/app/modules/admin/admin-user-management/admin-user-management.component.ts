import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import{MyPagedRequest} from '../../../helper/my-paged-request';
import {  GetActiveUsersRequest,UserService, GetAllUsersResponse, UpdateUserRequest, DeleteUserRequest, UserReactivationRequest } from '../../../endpoints/user-endpoints/get-user-endpoint';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';

@Component({
  selector: 'app-admin-user-management',
  styleUrl:'./admin-user-management.component.css',
  templateUrl: './admin-user-management.component.html',
})
export class AdminUserManagementComponent implements OnInit {
  users: GetAllUsersResponse[] = [];
  editRow: { [key: number]: boolean } = {};
  page = 1;
  pageSize = 10;
  totalPages = 1;

  searchSubject:Subject<string> = new Subject<string>();
  s:string=' ';

  loadDeleted:boolean = false;



  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.initSearchListener()

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);
  }

  initSearchListener(){
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((x)=>{
      this.s=x;
      this.loadUsers();
    })
  }

  cb(){
    this.loadUsers();
  }



  loadUsers(): void {
    const request: GetActiveUsersRequest = {
      pageNumber: this.page,
      pageSize: this.pageSize,
      search:this.s,
      showDeleted:this.loadDeleted
    };


      this.userService.handleAsync(request).subscribe(response => {
        this.users = response.dataItems;
        this.totalPages = response.totalPages;
      });


  }

  saveUser(user: GetAllUsersResponse, index: number): void {
    const request: UpdateUserRequest = {
      id: user.id,
      userName: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    this.userService.updateUser(request).subscribe(() => {
      this.editRow[index] = false;
    });
  }

  deleteOrReactivate(user: GetAllUsersResponse): void {
    if (user.isDeleted) {
      const request: UserReactivationRequest = { id: user.id };
      this.userService.reactivateUser(request).subscribe(() => this.loadUsers());
    } else {
      const request: DeleteUserRequest = { id: user.id };
      this.userService.disableUser(request).subscribe(() => this.loadUsers());
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }
}
