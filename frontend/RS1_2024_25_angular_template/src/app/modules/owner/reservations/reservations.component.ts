import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {Reservation, ReservationService} from '../../../endpoints/reservations-controllers/reservation-controller';
import {OwnerService, ReservationGetResponse} from '../../../endpoints/owner-controller/owner-controller';
import {MyPagedList} from '../../../endpoints/reviews-endpoints/reviews-endpoints';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit{

  localeId: number = 0;
  searchSubject:Subject<string> = new Subject<string>();
  reservations:ReservationGetResponse[]=[];
  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  totalPages: number = 1;
  selectedDate: string = '';
  cancelReservationId: number = 0;
  showCancelModal: boolean = false;


  request={
    q:'',
    pageNumber:1,
    pageSize:5,
    showDeleted:false,
    date:''
  }

  constructor(private ownerService:OwnerService, private authService: MyAuthService,
              private reservationService:ReservationService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {

    this.route.params.subscribe((params) => {
      this.localeId = +params['id'];
    })

    this.loadLocale();
    this.initSearchListener();

    this.selectedDate = new Date().toISOString().split('T')[0];
    this.request.date = this.selectedDate;

    this.loadReservations();
  }

  loadLocale() {
    const UserId = <number>this.authService.getMyAuthInfo()?.personID;
    this.ownerService.getMyLocale(this.localeId).subscribe({
      next: (locale:any) => {

      }
    })
  }


  loadReservations(search: string = '') {
    this.request.q = search;
    this.request.pageNumber = this.currentPage;
    this.request.pageSize = this.pageSize;
    this.request.date = this.selectedDate ? this.selectedDate : '';


    this.ownerService.getAllReservations(this.request).subscribe({
      next: (x: MyPagedList<ReservationGetResponse>) => {
        this.reservations = x.dataItems;
        this.totalCount = x.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      }
    });
  }



  initSearchListener(){
    this.searchSubject.pipe(debounceTime(300),distinctUntilChanged())
      .subscribe(( f) =>{
        this.loadReservations(f);
      })
  }


  applyFilter(event: Event) {
    const f = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 1;
    this.searchSubject.next(f);
  }


  nextPage() {
    this.currentPage++;
    this.loadReservations();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadReservations();
    }
  }

  onDateChange(event: Event) {

    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.request.date = this.selectedDate;
    this.currentPage = 1;
    this.loadReservations(this.request.q);
  }

  closeCancelModal(){
    this.showCancelModal = false;
    this.cancelReservationId = 0;
  }

  confirmCancel(){
      if (this.cancelReservationId !== null){
          this.reservationService.cancelReservation(this.cancelReservationId).subscribe({
            next: () => {
              this.loadReservations();
              this.showCancelModal = false;
              this.cancelReservationId = 0;
            }
          });
      }
  }

  openCancelModal(id:number){
    this.cancelReservationId = id;
    this.showCancelModal=true;
  }

  toLocaleOverview(){
    this.router.navigateByUrl("/owner/overview/" + this.localeId);
  }


  toWorkers(){
    this.router.navigateByUrl("/owner/workers/"+ this.localeId)
  }

  toSettings(){
    this.router.navigateByUrl("/public/update-locale/"+ this.localeId)
  }

}
