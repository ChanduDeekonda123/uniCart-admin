import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonDirective } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PopoverModule } from 'primeng/popover';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
@Component({
  standalone: true,
  selector: 'app-seller-layout',
  templateUrl: './seller-layout.html',
  styleUrls: ['./seller-layout.less'],
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
    InputTextModule,
    ButtonDirective,
]
})
export class SellerLayout {

  constructor(private router: Router) {}

  // Top Menu
  topMenu = [];
  // Breadcrumb
  // breadcrumbItems = [{ label: 'Seller' }, { label: 'Dashboard' }];

  // Notifications
  notifications = [
  { message: 'Product approved', type: 'APPROVED', color: 'success' },
  { message: 'Low stock warning', type: 'STOCK', color: 'warn' },
  { message: 'Order shipped', type: 'ORDER', color: 'info' },
  { message: 'New message', type: 'MESSAGE', color: 'secondary' },
];
items: MenuItem[] = [];
ngOnInit() {
  this.items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => this.router.navigate(['/seller'])
    },
    {
      label: 'Add Business',
      icon: 'pi pi-user-plus',
      command: () => this.router.navigate(['/seller/seller-details/list'])
    },
    {
      label: 'Products',
      icon: 'pi pi-tags',
      items: [
        {
          label: 'Product List',
          icon: 'pi pi-list',
          command: () => this.router.navigate(['/seller/products/list'])
        },
        {
          label: 'Add Product',
          icon: 'pi pi-plus',
          command: () => this.router.navigate(['/seller/products/add'])
        },
        {
          label: 'Categories',
          icon: 'pi pi-sitemap',
          command: () => this.router.navigate(['/seller/products/category'])
        }
      ]
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-bag',
      items: [
        {
          label: 'Order List',
          icon: 'pi pi-file',
          command: () => this.router.navigate(['/seller/order-list'])
        },
        {
          label: 'Order details',
          icon: 'pi pi-file',
          command: () => this.router.navigate(['/seller/order-details'])
        }
      ]
    },
    {
      label: 'Analytics',
      icon: 'pi pi-chart-line',
      command: () => this.router.navigate(['/seller/analytics'])
    },
    {
      label: 'Payments',
      icon: 'pi pi-wallet',
      command: () => this.router.navigate(['/seller/payments'])
    },
    {
      label: 'Support',
      icon: 'pi pi-question-circle',
      command: () => this.router.navigate(['/seller/support'])
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];
}
  // toggleTheme() {
  //   console.log('Toggle Dark Mode');
  // }
  // breadcrumbItems = [{ label: 'Seller' }, { label: 'Dashboard' }];
  navigate(path: string) {
    this.router.navigate([path]);
  }
  addBusiness() {
    this.router.navigate(['seller/seller-details/create-seller/general'])
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
