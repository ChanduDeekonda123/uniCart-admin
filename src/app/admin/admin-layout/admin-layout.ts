import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AvatarModule } from 'primeng/avatar';
import { PopoverModule } from 'primeng/popover';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
@Component({
  standalone: true,
  selector: 'app-seller-layout',
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.less'],
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    MenubarModule,
    BreadcrumbModule,
    PanelMenuModule,
    AvatarModule,
    PopoverModule,
    ToggleSwitchModule,
    ScrollPanelModule,
    TagModule,
    InputTextModule
  ]
})
export class AdminLayout {

  constructor(private router: Router) {}

  // Top Menu
  topMenu = [];

  // Breadcrumb
  // breadcrumbItems = [{ label: 'Admin' }, { label: 'Dashboard' }];

  // Notifications
  notifications = [
  { message: 'Product approved', type: 'APPROVED', color: 'success' },
  { message: 'Low stock warning', type: 'STOCK', color: 'warn' },
  { message: 'Order shipped', type: 'ORDER', color: 'info' },
  { message: 'New message', type: 'MESSAGE', color: 'secondary' },
];


  // Details for sidebar menu
  items: MenuItem[] = [];

ngOnInit() {
  this.items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => this.router.navigate(['/admin'])
    },
    {
      label: 'Verfiy Seller',
      icon: 'pi pi-users',
      command: () => this.router.navigate(['/admin/verify-sellers'])
    },
    {
      label: 'Products',
      icon: 'pi pi-tags',
      command: () => this.router.navigate(['/admin/products'])
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-bag',
      command: () => this.router.navigate(['/admin/orders'])
    },
    {
      label: 'Payments',
      icon: 'pi pi-wallet',
      command: () => this.router.navigate(['/admin/payments'])
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];
}
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
