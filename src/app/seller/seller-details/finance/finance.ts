import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, effect } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { Notifications } from '../../../service/notification/notifications';
import { Seller } from '../../../service/seller/seller';
import { SpinnerLoader } from '../../../spinner-loader/spinner-loader';
@Component({
  selector: 'app-finance',
  standalone: true,
  templateUrl: './finance.html',
  styleUrls: ['./finance.less'],
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    SelectModule,
    SpinnerLoader,
    ToastModule
  ]
})
export class Finance implements OnInit {
  isLoading: any;
  @ViewChild('storeNameInput') storeNameInput!: ElementRef;
  financeForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private sellerService: Seller,
    private notificationService: Notifications,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      const value = this.sellerService.actionSignal();
      value === 'save-finance' && this.updateSellerDetails();
      value === 'clear-finance' && this.clearForm();
    })
  }
  ngOnInit(): void {
    this.financeForm = this.fb.group({
      accountGroup: [null, Validators.required],
      slAccount: [null, Validators.required],
      taxRates: [null, Validators.required],
      paymentTerm: [null, Validators.required],
      modeOfPayment: [null, Validators.required],
      // incoTerm: [null, Validators.required],
      isCreditHold: [false],
      creditHoldAmount: [null],
      isOverdueHold: [false],
      overdueDays: [null],
      paymentReminder: [false],
      creditLimit: [null, Validators.required]
    });
    const financeDetails = this.sellerService.getStepperData('sellerDetails');
    if (financeDetails?.financeDetails) {
      this.financeForm.patchValue(financeDetails.financeDetails);
    }
  }
  paymentModes = [
    { name: 'NEFT', value: 'NEFT' },
    { name: 'RTGS', value: 'RTGS' },
    { name: 'IMPS', value: 'IMPS' },
    { name: 'UPI', value: 'UPI' }
  ];
  taxRates = [
    { name: 'GST 5%', value: '5' },
    { name: 'GST 12%', value: '12' },
    { name: 'GST 18%', value: '18' },
    { name: 'GST 28%', value: '28' }
  ];
  ngAfterViewInit() {
  setTimeout(() => {
    this.storeNameInput.nativeElement.focus();
  }, 0);
}
focusNext(field:any){
  field?.focus();
}
openSelect(selectRef: any){
  const el = selectRef.el.nativeElement.querySelector('.p-select-label-container');
  el?.click();
}
  isInvalid(controlName: string) {
    const control = this.financeForm.get(controlName);
    return control?.invalid && (control.touched || control.dirty);
  }
  updateSellerDetails() {
    this.financeForm.markAllAsTouched();
    if (this.financeForm.invalid) {
      this.notificationService.showError('Please enter valid credentials.');
      return;
    }
    const reqPayLoad = {
      userId: localStorage.getItem('userId'),
      businessPartnerCode: this.sellerService.businessPartnerCode,
      financeDetails: this.financeForm.getRawValue()
    };
    this.isLoading = true;
    this.sellerService.updateSellerDetails(reqPayLoad).subscribe({
      next: (res: any) => {
        if (res?.status === 'success') {
          this.isLoading = false;
          this.notificationService.showSuccess(res?.message);
          this.sellerService.businessPartnerCode = res?.data?.businessPartnerCode;
          this.sellerService.setStepperData('sellerDetails', res?.data);
          this.sellerService.actionSignal.set('financeDetailsSaved');
          this.sellerService.actionSignal.set('');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notificationService.showError(err?.message);
      }
    })
  }
    clearForm() {
    this.financeForm.reset();
  }
}
