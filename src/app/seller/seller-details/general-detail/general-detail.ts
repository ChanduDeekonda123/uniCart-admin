import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from "primeng/toast";
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Subscription } from 'rxjs';
import { CommonApi } from '../../../service/common-api/common-api';
import { Notifications } from '../../../service/notification/notifications';
import { Seller } from '../../../service/seller/seller';
import { SpinnerLoader } from '../../../spinner-loader/spinner-loader';
// interface generalItem {
//   businessPartnerCode: string;
//   businessParther: string;
//   actualPartner: string;
//   addressB: string;
//   landmark: string;
//   city: string;
//   state: string;
//   country: string;
//   pincode: string;
//   website: string;
//   oldPartnerRefCode: string;
//   validTo: string;
// }
@Component({
  selector: 'app-general-detail',
  standalone: true,
  templateUrl: './general-detail.html',
  styleUrls: ['./general-detail.less'],
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    FluidModule,
    SpinnerLoader,
    ToastModule,
    ToggleSwitch
  ]
})
export class GeneralDetail implements OnInit {
  generalForm!: FormGroup;
  @ViewChild('actualPartner') actualPartner!: ElementRef;
  @ViewChild ('generalFocus') generalFocus!:ElementRef;
  subscription!: Subscription;
  sellerDetails: any = {};
  @Output() formStatusChange = new EventEmitter<boolean>();
  isLoading: any;
  constructor(private fb: FormBuilder,
    private sellerService: Seller,
    private commonService: CommonApi,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private notificationService: Notifications
  ) {
    effect(() => {
      const value = this.sellerService.actionSignal();
      value === 'save-general' && this.saveGeneralDetails();
      value === 'clear-general' && this.clearForm();
    })
  }
  ngOnInit(): void {
    this.generalForm = this.fb.group({
      businessPartner: [null, Validators.required],
      businessPartnerCode: [null, Validators.required],
      actualPartner: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      country: [null, Validators.required],
      pincode: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      currency: [null, Validators.required],
      website: [null, Validators.pattern(/https || www?:\/\/.+/)],
      checked: [{ value: true, disabled: true }]
      // oldPartnerRefCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      // validTo: ['', Validators.required],
    });
    // const data = this.sellerService.getStepperData('sellerDetails');
    // if(data?.this.sellerDetails?.isNewRecord === true){
    //   this.generalForm.get('checked')?.setValue(true);
    //   this.generalForm.get('checked')?.disable()
    // }
    // const viewMode = this.sellerService.getStepperData('viewMode');
    // if (viewMode === 'Edit') {
    //   this.generalForm.get('checked')?.enable();
    // }
    

    const data  = this.sellerService.getStepperData('sellerDetails');
    const status = data?.approvalStatus;
    if(status === 'd'){
      this.generalForm.get('checked')?.disable();
    } else if(status === 'a'){
      this.generalForm.get('checked')?.enable();
    } else if( status === 'p'){
      this.generalForm.get('checked')?.enable();
    }
    this.sellerDetails = this.sellerService.getStepperData('sellerDetails');
    if (this.sellerDetails?.generalDetails) {
      this.generalForm.patchValue(this.sellerDetails?.generalDetails);
    }
    this.generalForm.statusChanges.subscribe((): void => {
      this.formStatusChange.emit(this.generalForm.valid);
    })
  }
  focusNext(field:any){
    field?.focus();
  }
  ngAfterViewInit() {
  setTimeout(() => {
    this.generalFocus.nativeElement.focus();
  }, 0);
}
  isInvalid(controlName: string) {
    const control = this.generalForm.get(controlName);
    return control?.invalid && (control.touched || control.dirty);
  }
  getSequenceCode() {
    // if (this.generalForm.get('businessPartner')?.value
    //   && this.generalForm.get('businessPartnerCode')?.value === null)
    if(this.generalForm.get('businessPartner')?.invalid){
      return;
    }
    {
      this.commonService.getSequenceCode().subscribe(
        (res: any) => {
          if (res?.status?.toLowerCase() === 'success') {
            // this.generalForm.patchValue({
            //   businessPartnerCode: res.seqCode
            // });
            this.generalForm?.get('businessPartnerCode')?.setValue(res.seqCode);
            this.getFormControls['businessPartnerCode']?.disable();
            setTimeout(()=>{
              this.actualPartner.nativeElement.focus();
            })
          }
        }
      );
    }
  }
  saveGeneralDetails() {
    this.generalForm.markAllAsTouched();
    if (this.generalForm.invalid) {
      this.notificationService.showError('Please enter valid credentials.');
      return;
    }
    let reqPayLoad: any;
    if (this.sellerDetails?.isNewRecord) {
      reqPayLoad = {
        userId: localStorage.getItem('userId'),
        businessPartnerCode: this.sellerDetails?.businessPartnerCode,
        generalDetails: this.generalForm.getRawValue()
      };
    } else {
      reqPayLoad = {
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('u_username'),
        generalDetails: this.generalForm.getRawValue()
      };
    }
    // const reqPayLoad = {
    //   userId: localStorage.getItem('userId'),
    //   userName: localStorage.getItem('u_username'),
    //   generalDetails: this.generalForm.getRawValue()
    // };
    this.isLoading = true;
    this.sellerService.saveGeneralDetails(reqPayLoad).subscribe({
      next: (res: any) => {
        if (res?.status === 'success') {
          this.isLoading = false;
          const code = res?.data?.businessPartnerCode;
          // this.sellerService.businessPartnerCode.set(code);
          // this.sellerService.sellerAdded.set(res.data);
          this.notificationService.showSuccess(res?.message);
          this.sellerService.businessPartnerCode = res?.data?.businessPartnerCode;
          this.sellerService.setStepperData('sellerDetails', res?.data);
          this.sellerDetails = res?.data;
          this.sellerService.actionSignal.set('generalDetailsSaved')
          // this.sellerService.sellerAdded.set(res.data);
          this.sellerService.actionSignal.set('');
        } else {
          this.notificationService.showError(res?.message);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notificationService.showError(err?.message);
      }
    });
  }
  get getFormControls() {
    return this.generalForm.controls as any;
  }
  numbersOnlyZipcode(event: any) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = value.substring(0, 6);
    this.generalForm.get('pincode')?.setValue(event.target.value);
  }
  numbersOnlyForRef(event: any) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = value.substring(0, 7);
    this.generalForm.get('oldPartnerRefCode')?.setValue(event.target.value);
  }
  clearForm() {
    this.generalForm.reset();
  }

}
