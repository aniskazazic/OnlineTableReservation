import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';


interface MenuItem {
  title: string;
  path: string;
  icon: string; // We'll use Lucide icons via Angular or SVG directly
}

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})





export class AdminSidebarComponent {

  menuItems: MenuItem[] = [
    { title: 'Dashboard', path: '/admin', icon: 'lucide-home' },
    { title: 'Analytics', path: '/admin/analytics', icon: 'lucide-bar-chart-3' },
    { title: 'Users', path: '/admin/users', icon: 'lucide-users' },
    { title: 'Restaurants', path: '/admin/restaurants', icon: 'lucide-utensils-crossed' },
  ];

  constructor(public router: Router, private myAuthService:MyAuthService) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toDashBoard(){
    this.router.navigateByUrl('/admin/dashboard');
  }
  toAnalytics(){
    this.router.navigateByUrl('/admin/analytics');
  }
  toUser(){
    this.router.navigateByUrl('/admin/user');
  }
  toLocale(){
    this.router.navigateByUrl('/admin/locale');
  }
  toCiteies(){
    this.router.navigateByUrl('/admin/cities');
  }
  toCountries() {
    this.router.navigateByUrl('/admin/countries');
  }

  toCategory(){
    this.router.navigateByUrl('/admin/categories');
  }

  Logout(){
    this.myAuthService.logout();
    this.router.navigate(['/login']);
  }

}
