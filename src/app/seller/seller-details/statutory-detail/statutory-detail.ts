import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { Notifications } from '../../../service/notification/notifications';
import { Seller } from '../../../service/seller/seller';
import { SpinnerLoader } from '../../../spinner-loader/spinner-loader';
@Component({
  selector: 'app-statutory-detail',
  standalone: true,
  templateUrl: './statutory-detail.html',
  styleUrls: ['./statutory-detail.less'],
  providers:[MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    FluidModule,
    SelectModule,
    SpinnerLoader,
    ToastModule
  ]
})
export class StatutoryDetail implements OnInit {
  statutoryForm!: FormGroup;
  business:any[] = [];
  isLoading:any;
  businessCategory:any[] = [];
  subscription!: Subscription;
  primaryProductCategory:any[] = [];
  constructor(private fb: FormBuilder,
    private sellerService: Seller,
    private notificationService: Notifications,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) {
    effect(()=>{
    const value = this.sellerService.actionSignal();
		value === 'save-statutory' && this.updateSellerDetails();
		value === 'clear-statutory' && this.clearForm();
    })
  }
  ngOnInit(): void {
    this.statutoryForm = this.fb.group({
      businessModel:[null],
      primaryProductCategory:[null],
      businessCategory:[null],
      domestic: [null, Validators.required],
      panNo: [null, Validators.required],
      aadharNo: [null, Validators.required],
      msmeNo: [null, Validators.required],
      pfNo: [null, Validators.required],
      esiNo: [null, Validators.required]
    });
    const staturtoryDetails = this.sellerService.getStepperData('sellerDetails');
    if(staturtoryDetails?.staturtoryDetails){
      this.statutoryForm.patchValue(staturtoryDetails?.staturtoryDetails);
    }
    this.business = [
      { name: "Business To Business", code: "B2B" },
      { name: "Business To Client", code: "B2C" }
    ];
    this.businessCategory = [
      { name:'Retail Seller', code:"Rs"},
      { name:'Wholesale Seller', code:"Ws"},
      { name:'Manufacturer', code:"Mf"},
      { name:'Distributor', code:"Dr"},
      { name:'Service Provider',code:"Sp"}
    ];
    this.primaryProductCategory = [
      { name:'Electronics', code:"El"},
      { name:'Fashion', code:"Fn"},
      { name:'Grocery', code:"Gy"},
      { name:'Beauty', code:"By"},
      { name:'Home Appliances',code:"Ha"},
      { name:'Tools & Hardware', code:"Th"},
      { name:'Books', code:"Bs"}
    ];
  }
  updateSellerDetails(){
    this.statutoryForm.markAllAsTouched();
    if (this.statutoryForm.invalid) {
      this.notificationService.showError('Please enter valid credentials');
      return;
    }
    const reqPayLoad = {
      userId: localStorage.getItem('userId'),
      businessPartnerCode: this.sellerService.businessPartnerCode,
      staturtoryDetails: this.statutoryForm.getRawValue()
    };
    this.isLoading = true;
    this.sellerService.updateSellerDetails(reqPayLoad).subscribe({
      next: (res: any) => {
        if (res?.status === 'success') {
          this.isLoading = false;
          this.notificationService.showSuccess(res?.message);
          this.sellerService.businessPartnerCode = res?.data?.businessPartnerCode;
					this.sellerService.setStepperData('sellerDetails', res?.data);
					this.sellerService.actionSignal.set('statutoryDetailsSaved')
					this.sellerService.actionSignal.set('');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notificationService.showError(err?.message);
      }
    })
  }
  clearForm(){
    this.statutoryForm.reset();
    this.statutoryForm.markAsPristine();
    this.statutoryForm.markAsUntouched();
  }
  isInvalid(controlName: string) {
  const control = this.statutoryForm.get(controlName);
  return control?.invalid && (control.touched || control.dirty);
}
// numbersOnlyZipcode(event: any) {
//   const value = event.target.value.replace(/[^0-9]/g, '');
//   event.target.value = value.substring(0, 5);
//   this.statutoryForm.get('pincode')?.setValue(event.target.value);
// }
numbersOnly(event: any, controlName: string) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    const trimmed = value.substring(0, 12);
    event.target.value = trimmed;
    this.statutoryForm.get(controlName)?.setValue(trimmed);
  }
}
