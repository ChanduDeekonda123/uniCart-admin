import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { Notifications } from '../../../service/notification/notifications';
import { Seller } from '../../../service/seller/seller';
import { SpinnerLoader } from '../../../spinner-loader/spinner-loader';
@Component({
  selector: 'app-basic-detail',
  imports: [FormsModule, CommonModule, ReactiveFormsModule,
    InputTextModule, SelectModule, TextareaModule, IftaLabelModule, SpinnerLoader, ToastModule],
  templateUrl: './basic-detail.html',
  styleUrl: './basic-detail.less',
  providers: [MessageService]
})
export class BasicDetail implements OnInit {
  basicForm!: FormGroup;
  @ViewChild('storeNameInput') storeNameInput!: ElementRef;
  isLoading: any;
  business: any[] = [];
  businessCategory: any[] = [];
  primaryProductCategory: any[] = [];
  constructor(private fb: FormBuilder,
    private sellerService: Seller,
    private notificationService: Notifications,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,

  ) {
    effect(() => {
      const value = this.sellerService.actionSignal();
      value === 'save-basic' && this.updateSellerDetails();
      value === 'clear-basic' && this.clearForm();
    })
  }

  ngOnInit(): void {
    this.basicForm = this.fb.group({
      gstNumber: [null, [Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)]],
      storeName: [null, Validators.required],
      brandName: [null, Validators.required],
      salesRating: [null, [
        Validators.required,
        Validators.min(0),
        Validators.max(10)
      ]],
      paymentRating: [null, [
        Validators.required,
        Validators.min(0),
        Validators.max(10)
      ]],
      transitDays: [null, Validators.required],
      balance: [null, Validators.required],
      overDuebalance: [null, Validators.required],
      remarks: [null]
    });
    const basicDetails = this.sellerService.getStepperData('sellerDetais');
    if(basicDetails?.basicDetails){
      this.basicForm.patchValue(basicDetails?.basicDetails);
    }
  }
  ngAfterViewInit() {
  setTimeout(() => {
    this.storeNameInput.nativeElement.focus();
  }, 0);
}

focusNext(field:any){
  field?.focus();
}
  clearForm() {
    this.basicForm.reset();
    this.basicForm.markAsPristine();
    this.basicForm.markAsUntouched();
  }
  isInvalid(name: string) {
    const c = this.basicForm.get(name);
    return c?.invalid && (c.touched || c.dirty);
  }
  updateSellerDetails() {
  this.basicForm.markAllAsTouched();

  if (this.basicForm.invalid) {
    this.notificationService.showError('Please enter valid credentials');
    return;
  }
  const businessPartnerCode =
    this.sellerService.businessPartnerCode ||
    localStorage.getItem('businessPartnerCode');

  if (!businessPartnerCode) {
    this.notificationService.showError('Business Partner Code missing');
    return;
  }

  const reqPayLoad = {
    userId: localStorage.getItem('userId'),
    businessPartnerCode: businessPartnerCode,
    basicDetails: this.basicForm.getRawValue()
  };

  this.isLoading = true;

  this.sellerService.updateSellerDetails(reqPayLoad).subscribe({
    next: (res: any) => {
      if (res?.status === 'success') {
        this.isLoading = false;

        this.notificationService.showSuccess(res?.message);

        // keep code updated
        this.sellerService.businessPartnerCode = res?.data?.businessPartnerCode;
        localStorage.setItem('businessPartnerCode', res?.data?.businessPartnerCode);

        this.sellerService.setStepperData('sellerDetais', res?.data);
        this.sellerService.actionSignal.set('basicDetailsSaved');
        this.sellerService.actionSignal.set('');
      }
    },
    error: (err: any) => {
      this.isLoading = false;
      this.notificationService.showError(err?.message);
    }
  });
}

// gstNumber(event: any) {
//   const upper = event.target.value.toUpperCase();
//   this.basicForm.patchValue({ gstNumber: upper }, { emitEvent: false });
// }
ongstNumber(event:any){
  const upper = event.target.value.toUpperCase();
  this.basicForm.patchValue({gstNumber: upper}, { emitEvent: false});
}
}
