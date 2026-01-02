import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DividerModule } from "primeng/divider";
import { ToastModule } from 'primeng/toast';
import { Notifications } from '../../../service/notification/notifications';
import { Seller } from '../../../service/seller/seller';
import { SpinnerLoader } from '../../../spinner-loader/spinner-loader';
import { AddressDetail } from '../address-detail/address-detail';
import { BankDetail } from '../bank-detail/bank-detail';
import { ContactDetail } from '../contact-detail/contact-detail';
import { actionsKeys, stepperUrls } from '../seller.config';
@Component({
  selector: 'app-confirmation',
  imports: [FormsModule, CommonModule, DividerModule,
    AddressDetail, ContactDetail, BankDetail,
    SpinnerLoader, ToastModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.less',
  providers: [MessageService]
})

export class Confirmation implements OnInit {
  isViewMode = false;
  sellerDetails: any = {};
  general: any = {};
  basic: any = {};
  finance: any = {};
  statutory: any = {};
  isLoading: any;
  addressDetails: any[] = [];
  contactDetails: any[] = [];
  bankDetails: any[] = [];
  businessPartnerCode!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sellerService: Seller,
    private notificationService: Notifications,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      const action = this.sellerService.actionSignal();
      if (action === 'send-approval') {
        this.sendForApproval();
      }
    });
  }
  ngOnInit(): void {
    this.businessPartnerCode = localStorage.getItem('businessPartnerCode') || '';
    if (this.businessPartnerCode) {
      this.getSellerDetails();
    }
    const mode = this.sellerService.getStepperData('viewMode');
    this.isViewMode = mode === actionsKeys['view'];
    
  }
  navigateTo(section: string) {
    if (this.isViewMode) return;
    const step = stepperUrls.indexOf(section);
    this.sellerService.setStepperData('activeIndex', step);
    this.router.navigate([`/seller/seller-details/create-seller/${section}`]);
  }

  getSellerDetails() {
    this.isLoading = true;
    const reqPayLoad = {
      businessPartnerCode: this.businessPartnerCode
    }
    this.sellerService.getSellerByCode(reqPayLoad).subscribe({
      next: (res: any) => {
        if (res?.status === 'success') {
          this.sellerService.setStepperData('sellerDetails', res?.data);
          this.sellerService.businessPartnerCode = res?.data?.businessPartnerCode;
          this.sellerDetails = res?.data
          this.addressDetails = this.sellerDetails?.addressDetails
          this.contactDetails = this.sellerDetails?.contactDetails
          this.bankDetails = this.sellerDetails?.bankDetails
          this.isLoading = false;
          // this.notificationService.showSuccess(res?.message);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notificationService.showError(err?.message)
      }
    });
  }
  sendForApproval() {
    const reqPayLoad = {
      businessPartnerCode: this.sellerService.businessPartnerCode
    };
    this.isLoading = true;
    this.sellerService.sendForApprovel(reqPayLoad).subscribe({
      next: (res: any) => {
        if (res?.status === 'success') {
          this.isLoading = false;
          this.notificationService.showSuccess(res?.message);
          // this.restConfirmation();
          this.router.navigate(['/seller/seller-details/list']);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notificationService.showError(err?.message);
      }
    })
  }
  // restConfirmation() {
  //   this.sellerDetails = []
  // }
}