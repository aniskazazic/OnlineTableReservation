import {Component, OnInit} from '@angular/core';
import {TableGetRequest, TableGetResponse, TableService} from '../../../endpoints/tables-endpoint/tables-endpoints';
import {
  CreateReservationDto,
  ReservationService,
  TimeSlotDto
} from '../../../endpoints/reservations-controllers/reservation-controller';
import {ZoneDTO, ZoneService} from '../../../endpoints/ZonesController/ZonesController';
import {ActivatedRoute, Route} from '@angular/router';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-reservation-component',
  templateUrl: './reservation-component.component.html',
  styleUrl: './reservation-component.component.css'
})
export class ReservationComponentComponent implements OnInit {
  tables: TableGetResponse[] = [];
  zones:ZoneDTO[]=[]

  modalOpen = false;
  selectedTable: TableGetResponse | null = null;
  selectedDate = this.todayDate();
  availableSlots: TimeSlotDto[] = [];
  selectedSlot: TimeSlotDto | null = null;
  confirmModalOpen = false;
  localeeId:number=0;
  minDate: string='';

  constructor(
    private tableService: TableService,
    private reservationService: ReservationService,
    private zoneService: ZoneService,
    private route: ActivatedRoute,
    private authService:MyAuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.localeeId = +params['id'];

    });
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // format: yyyy-MM-dd
    this.loadTables();
    this.loadZones();
}


  loadZones(): void {
    this.zoneService.getZone(this.localeeId).subscribe({
      next: (z: ZoneDTO[]) => {
        this.zones = z; // adapt for array if needed later

      }
    });
  }

  todayDate(): string {
    // returns YYYY-MM-DD
    return new Date().toISOString().split('T')[0];
  }

  loadTables(): void {
    const request: TableGetRequest = { localeId: this.localeeId }; // Replace with dynamic LocaleId if needed

    this.tableService.handleAsync(request).subscribe(
      (response:TableGetResponse[]) => {

        this.tables = response;


      },
      (error) => {
        console.error('Error loading tables:', error);

      }

    );


  }


  openModal(table: TableGetResponse) {
    this.selectedTable = table;
    this.selectedDate = this.todayDate();
    this.modalOpen = true;
    this.loadSlots();
  }

  closeModal() {
    this.modalOpen = false;
    this.availableSlots = [];
    this.selectedSlot = null;
  }

  onDateChange() {
    this.loadSlots();
  }

  loadSlots() {
    if (!this.selectedTable) return;
    this.reservationService
      .getAvailableSlots(this.selectedTable.id, this.selectedDate)
      .subscribe({
        next: slots => {
          this.availableSlots = slots;
          this.selectedSlot = slots.length ? slots[0] : null;
        },
        error: e => {
          console.error('Failed to load slots', e);
          this.availableSlots = [];
        }
      });
  }

  openReserveModal(){
    if (!this.selectedTable || !this.selectedSlot) return;

    this.confirmModalOpen = true;
  }

  reserve() {
    if (!this.selectedTable || !this.selectedSlot) return;


    const dto: CreateReservationDto = {
      userId: <number>this.authService.getMyAuthInfo()?.personID,
      tableId: this.selectedTable.id,
      reservationDate: this.selectedDate,
      startTime: this.selectedSlot.start+':00',
      endTime: this.selectedSlot.end+':00'
    };

    this.reservationService.createReservation(dto).subscribe({
      next: () => {
        this.toastr.success('Reservation successful!');
        this.closeModal();
        this.confirmModalOpen = false;
      },
      error: err => {
        console.error('Reservation failed:', err);
        this.toastr.error('Failed to reserve, please try again.');
        this.confirmModalOpen = false;
      }
    });
  }

  cancelConfirmation() {
    this.confirmModalOpen = false;
  }
}
