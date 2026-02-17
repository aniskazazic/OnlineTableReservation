import {Component, OnInit} from '@angular/core';
import {AdminController,AnalyticsDto} from '../../../endpoints/AdminControllers/AdminController';

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.css'
})
export class AdminAnalyticsComponent implements OnInit{


  constructor(private adminController:AdminController) {
  }

  colors:string[]= [
    '#2196f3', // Blue
    '#ffc107', // Amber
    '#9c27b0', // Purple
    '#4caf50', // Green
    '#ff5722', // Deep Orange
    '#00bcd4', // Cyan
    '#e91e63', // Pink
    '#8bc34a', // Light Green
    '#ff9800', // Orange
    '#3f51b5', // Indigo
    '#795548', // Brown
    '#607d8b', // Blue Grey
    '#f44336'  // Red
  ]

  // 1. Active vs Deleted users
  userStatusData = {
    labels: ['Active', 'Deleted'],
    datasets: [{ data: [0,0], backgroundColor: ['#4caf50', '#f44336'] }]
  };

  // 2. Role distribution
  userRoleData = {
    labels: ['Owner', 'Worker', 'User'],
    datasets: [{ data: [10, 25, 65], backgroundColor: ['#2196f3', '#ffc107', '#9c27b0'] }]
  };

  // 3. Locale categories
  localeCategoryData = {
    labels: ['Coffee Place', 'Night Club', 'Restaurant'],
    datasets: [{ data: [30, 20, 50], backgroundColor: ['#795548', '#3f51b5', '#ff9800'] }]
  };

  // 4. Locales by country
  localeCountryData = {
    labels: ['Croatia', 'Germany', 'France'],
    datasets: [{ data: [40, 30, 30], backgroundColor: ['#03a9f4', '#8bc34a', '#e91e63'] }]
  };


  ngOnInit() {

    this.adminController.getAnalytics().subscribe((data) => {
      this.userStatusData = {
        labels: ['Active', 'Deleted'],
        datasets: [{ data: data.userStatsData, backgroundColor: this.colors.slice(0,data.userStatsData.length) }]
      };

      this.userRoleData = {
        labels: ['Owner', 'Worker', 'User'],
        datasets: [{ data: data.userRoleData, backgroundColor: this.colors.slice(0,data.userRoleData.length) }]
      };


      this.localeCategoryData = {
        labels: ['Coffee Place', 'Night Club', 'Restaurant'],
        datasets: [{ data: data.localeCategoryData, backgroundColor:this.colors.slice(0,data.localeCategoryData.length) }]
      };

      this. localeCountryData = {
        labels: data.countyNames,
        datasets: [{ data: data.localeCountyData, backgroundColor: this.colors.slice(0,data.localeCountyData.length)}]
      };

    })



  }

}
