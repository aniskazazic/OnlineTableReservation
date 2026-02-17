import {Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {OwnerService, ReservationGetResponse} from '../../../endpoints/owner-controller/owner-controller';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import {ReservationService} from '../../../endpoints/reservations-controllers/reservation-controller';
import {ActivatedRoute, Router} from '@angular/router';
import {MyPagedList} from '../../../endpoints/reviews-endpoints/reviews-endpoints';
import {WorkerController} from '../../../endpoints/worker-controller/worker-controller';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {

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

  localeData: any;

  request={
    q:'',
    pageNumber:1,
    pageSize:5,
    showDeleted:false,
    date:''
  }

  constructor(private ownerService:OwnerService, private authService: MyAuthService,
              private reservationService:ReservationService, private route: ActivatedRoute, private router: Router,
              private workerService: WorkerController) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.localeId = +params['id'];
    })

    this.loadLocale();
    this.initSearchListener();

    this.selectedDate = new Date().toISOString().split('T')[0];
    this.request.date = this.selectedDate;

  }

  loadLocale() {
    this.workerService.getMyLocale().subscribe({
      next: (locale: any) => {
        this.localeData = locale;
        this.localeId = this.localeData.id; // ✅ preuzmi iz backend responsa
        console.log('Worker locale:', this.localeData);
        console.log("LocaleID", this.localeId);
        this.loadReservations();
      },
      error: (err) => {
        console.error('Error loading locale for worker', err);
      }
    });
  }



  loadReservations(search: string = '') {
    this.request.q = search;
    this.request.pageNumber = this.currentPage;
    this.request.pageSize = this.pageSize;
    this.request.date = this.selectedDate ? this.selectedDate : '';
    (this.request as any).localeId = this.localeId;

    this.ownerService.getAllReservations(this.request).subscribe({
      next: (x: MyPagedList<ReservationGetResponse>) => {
        this.reservations = x.dataItems;

        this.totalCount = x.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);

        console.log("Rezervacije: ", this.reservations)
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


}
