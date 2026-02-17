import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CdkDragMove, CdkDragEnd } from '@angular/cdk/drag-drop';


import {TableService, TableGetRequest, TableGetResponse,SaveTableLayoutRequest } from '../../../endpoints/tables-endpoint/tables-endpoints';
import {ZoneService, Zone, ZoneDTO, ZoneLayoutDTO} from '../../../endpoints/ZonesController/ZonesController';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'table-layout',
  templateUrl: 'table-layout.component.html',
  styleUrls: ['table-layout.component.css'],
})
export class TableLayoutComponent implements OnInit {
  tables: TableGetResponse[] = [];
  tempTable:TableGetResponse[] = [];
  isLoading: boolean = true;
  @ViewChild('box') boxRef!: ElementRef;

  localeID:number=0;
  zones: ZoneDTO[] = [];
  tempZones: ZoneDTO[] = [];
  isZoneModalVisible = false;
  isEditingZone = false;

  isTableModalVisible = false;
  isEditingTable = false;
  confirmModal:boolean = false;

  isOwner:boolean | undefined = false;

  newZone: ZoneDTO = {
    id: 0,
    name: '',
    xCoordinate: 10,
    yCoordinate: 10,
    width: 100,
    height: 100,
  };

  newTable:TableGetResponse={
    id:0,
    xCoordinate:10,
    yCoordinate:10,
    name:'',
    numberOfGuests:2
}

  ZoneIndex:number = 0;
  TableIndex:number=0;

  constructor(private tableService: TableService,private zoneService:ZoneService,private route:ActivatedRoute,private router:Router, public  authService: MyAuthService) {}


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.localeID = +params['id'];

    });
    this.tableService.checkIfOwnerOrWorker(this.localeID)
    this.loadTables();
    this.loadZones();
    this.isOwner=this.authService.getMyAuthInfo()?.isOwner;
  }

  // Load tables from the API
  loadTables(): void {



    const request: TableGetRequest = {
      localeId:this.localeID
    };

    this.tableService.handleAsync(request).subscribe(
      (response:TableGetResponse[]) => {

        this.tables = response;
        this.isLoading = false;
        for(let i of response){
          const t={
            id:i.id,
            name:i.name,
            xCoordinate:i.xCoordinate,
            yCoordinate:i.yCoordinate,
            numberOfGuests:i.numberOfGuests
          };
          this.tempTable.push(t);
        }
      },
      (error) => {
        console.error('Error loading tables:', error);
        this.isLoading = false;
      }

    );


  }

  loadZones(): void {
    this.zoneService.getZone(this.localeID).subscribe({
      next: (z: ZoneDTO[]) => {
        this.zones = z; // adapt for array if needed later
        for(let i of z) {
          const t = {
            id: i.id,
            name: i.name,
            xCoordinate: i.xCoordinate,
            yCoordinate: i.yCoordinate,
            height: i.height,
            width: i.width,
            checkDelete:false
          };
          this.tempZones.push(t);
        }
      }
    });
  }

  addNewTable(): void {

    this.isTableModalVisible= true;
    this.isEditingTable= false;

  }



  saveTable():void{
      const newTable = {
        id:0,
        name: this.newTable.name,
        xCoordinate: 10, // Default X position
        yCoordinate: 10, // Default Y position
        numberOfGuests:this.newTable.numberOfGuests
      };
      const tt={
        id:0,
        name: this.newTable.name,
        xCoordinate: 10, // Default X position
        yCoordinate: 10, // Default Y position
        numberOfGuests:this.newTable.numberOfGuests
      };


    if(!this.isEditingTable){
      this.tables.push(newTable);
      this.tempTable.push(tt);

    }
    else{

      this.tables[this.TableIndex].numberOfGuests=this.newTable.numberOfGuests;
      this.tables[this.TableIndex].name=this.newTable.name;
    }
    this.isTableModalVisible = false;




  }


  addNewZone(): void {
    this.isEditingZone = false;

    this.newZone = {
      id: 0,
      name: '',
      xCoordinate: 10,
      yCoordinate: 10,
      width: 100,
      height: 100,
    };

    this.isZoneModalVisible = true;
  }




  onDrop(event: any, element: HTMLElement, index: number): void {

    const rect = element.getBoundingClientRect();

    const a = this.boxRef.nativeElement.getBoundingClientRect();

    const x = a.left;  // X coordinate (relative to viewport)
    const y = a.top;   // Y coordinate (relative to viewport)


    this.tempTable[index].xCoordinate=Math.round(rect.left-x);
    this.tempTable[index].yCoordinate=Math.round(rect.top-y);




  }

  onDropZone(event: any, element: HTMLElement, index: number): void {

    const rect = element.getBoundingClientRect();

    const a = this.boxRef.nativeElement.getBoundingClientRect();

    const x = a.left;  // X coordinate (relative to viewport)
    const y = a.top;   // Y coordinate (relative to viewport)


    this.tempZones[index].xCoordinate=Math.round(rect.left-x);
    this.tempZones[index].yCoordinate=Math.round(rect.top-y);




  }




  saveLayout(){

    var st:SaveTableLayoutRequest = {
      localeId:this.localeID,
      tables:this.tempTable,
    }

    this.tableService.saveTableLayout(st).subscribe({

    });


    var zDto:ZoneLayoutDTO={
      localeId:this.localeID,
      zones:this.tempZones,
    }

    this.zoneService.saveTableLayout(zDto).subscribe({
    });


    this.confirmModal=false;

  }

  editTable(i:number){
    this.TableIndex=i;

    this.isTableModalVisible=true;
    this.isEditingTable=true;
    this.newTable=this.tempTable[this.TableIndex];


  }


  editZone(i: number): void {
    this.isEditingZone = true;
    this.isZoneModalVisible = true;
    this.ZoneIndex=i;
    this.newZone=this.tempZones[this.ZoneIndex];
  }

  saveZone(): void {


    const nz = {
      id: 0,
      name: this.newZone.name,
      localeId: 1,
      xCoordinate: 10,
      yCoordinate: 10,
      width: this.newZone.width,
      height: this.newZone.height,
    };

    const tz={
      id: 0,
      name: this.newZone.name,
      localeId: 1,
      xCoordinate: 10,
      yCoordinate: 10,
      width: this.newZone.width,
      height: this.newZone.height,
    }



    if(!this.isEditingZone){
    this.zones.push(nz);
    this.tempZones.push(tz)
      }
    else{

      //this.newZone = { ...this.zones[this.index] };

      this.zones[this.ZoneIndex].height=this.newZone.height;
      this.zones[this.ZoneIndex].width=this.newZone.width;
      this.zones[this.ZoneIndex].name=this.newZone.name;
    }
    this.isZoneModalVisible = false;
  }


  deleteTable(){
    this.tables.splice(this.TableIndex,1);
    this.tempTable.splice(this.TableIndex,1)

    this.isTableModalVisible=false;
  }

  deleteZone(): void {

    this.zones.splice(this.ZoneIndex,1);
    this.tempZones.splice(this.ZoneIndex,1);


    this.isZoneModalVisible = false;
  }


  ConfirmModal(){
    this.confirmModal=true;
  }

  toLocaleReservations(){
    if (this.authService.getMyAuthInfo()?.isOwner){
    this.router.navigateByUrl("/owner/reservations/"+ this.localeID)}
    else{
      this.router.navigateByUrl("/worker/reservations")
    }
  }

  toWorkers(){
    this.router.navigateByUrl("/owner/workers/"+ this.localeID)
  }

  toOverview(){
    this.router.navigateByUrl("/owner/overview/" + this.localeID);
  }

  toSettings(){
    this.router.navigateByUrl("/public/update-locale/"+ this.localeID)
  }

}
