import {Component, OnInit} from '@angular/core';
import {OwnerService} from '../../../endpoints/owner-controller/owner-controller';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend,
  ApexDataLabels
} from 'ng-apexcharts';
import {ActivatedRoute, Router} from '@angular/router';
import {TableService} from '../../../endpoints/tables-endpoint/tables-endpoints';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})



export class OverviewComponent implements  OnInit {

  locale:any;
  localeId: number = 0;
  todaysReservations: number = 0;
  todaysGuests: number = 0;
  activeTables: number = 0;
  totalTables:number=0;
  percentage:number = 0;
  tableDistribution: any[] = [];

  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'pie',
      width: 380
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 320
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    legend: {
      position: 'right',
      offsetY: 0
    },
    dataLabels: {
      enabled: true,
      formatter: function (val:number, opts) {
        return `${val.toFixed(0)}%`;
      }
    }
  };

  constructor(private ownerService: OwnerService,
              private tableService: TableService
              ,private authService:MyAuthService, private route: ActivatedRoute, private routrer: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.localeId = +params['id'];
    })


    this.tableService.checkIfOwner(this.localeId)

    this.loadLocale();


  }

  loadLocale() {
    this.ownerService.getMyLocale(this.localeId).subscribe({
      next: (x:any) => {
        this.locale=x;
        this.loadStatistics();

      }
    })
  }

  loadStatistics() {
    this.ownerService.getTodaysReservations(this.localeId).subscribe(res => {
      this.todaysReservations = res;
    });

    this.ownerService.getTodaysGuests(this.localeId).subscribe(res => {
      this.todaysGuests = res;
    });

    this.ownerService.getActiveTables(this.localeId).subscribe(active => {
      this.activeTables = active;

      this.ownerService.getTotalTables(this.localeId).subscribe(total => {
        this.totalTables = total;

        this.ownerService.getTableDistribution(this.localeId).subscribe(res => {
          this.tableDistribution = res;
          this.chartOptions.series = res.map((r: any) => +r.percentage.toFixed(2));
          this.chartOptions.labels = res.map((r: any) => `${r.seats}-seater`);
        });


        if (this.totalTables > 0) {
          this.percentage = +( (this.activeTables / this.totalTables) * 100 ).toFixed(2);
        } else {
          this.percentage = 0;
        }
      });
    });
  }
  toLocaleReservations(){
    this.routrer.navigateByUrl("/owner/reservations/"+ this.localeId)
  }

  toWorkers(){
    this.routrer.navigateByUrl("/owner/workers/"+ this.localeId)
  }


  toSettings(){
    this.routrer.navigateByUrl("/public/update-locale/"+ this.localeId)
  }

}


