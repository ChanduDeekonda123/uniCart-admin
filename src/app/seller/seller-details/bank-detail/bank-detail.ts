import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { InputText } from "primeng/inputtext";
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { Notifications } from '../../../service/notification/notifications';
import { Seller } from '../../../service/seller/seller';
import { SmartTable } from '../../../smart-table/smart-table';
import { SpinnerLoader } from '../../../spinner-loader/spinner-loader';

interface BankItem {
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountType: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  address: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-bank-detail',
  imports: [
    DrawerModule, ButtonModule, FormsModule, CommonModule,
    SelectModule, SmartTable, ReactiveFormsModule,
    InputText, DividerModule, Checkbox,SpinnerLoader,ToastModule
  ],
  templateUrl: './bank-detail.html',
  styleUrl: './bank-detail.less',
})
export class BankDetail implements OnInit {

  visible2: boolean = false;
  bankForm!: FormGroup;
  @ViewChild('accountHolderName') accountHolderName!: ElementRef;
  @Input() data:any = [];
  @Input() disabled: boolean = false;
  isLoading:any;
  accountType: any = 'Save';
  tableData: BankItem[] = [];
  constructor(private fb: FormBuilder, private sellerService:Seller,
    private notificationService: Notifications,
		private messageService: MessageService,
		private cdr: ChangeDetectorRef) {
      effect(() => {
			const value = this.sellerService.actionSignal();
			value === 'save-bank' && this.updateSellerDetails();
			value === 'clear-bank' && this.clearForm();
		})
  }
  ngOnInit(): void {
    if(this.data?.length){
			this.tableData = this.data;
		}
    this.bankForm = this.fb.group({
      accountHolderName: [null, Validators.required],
      accountNumber: [
        null,
        [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]
      ],
      confirmAccountNumber: [
        null,
        [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)
        ]
      ],
      accountType: [null],
      bankName: [null, Validators.required],
      branchName: [null, Validators.required],
      ifscCode: [null, [
        Validators.required,
        Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      ]],
      address: [null, Validators.required],
      isDefault: [false]
    },
      { validators: this.matchAccountNumbers.bind(this) });
    const bankDetails = this.sellerService.getStepperData('sellerDetails');
		if (bankDetails?.bankDetails?.length) {
      this.tableData = bankDetails?.bankDetails
		}
    this.accountType = [
      { name: 'Savings', code: "Sa" },
      { name: 'Current', code: "Cu" }
    ];
  }
  ngOnChanges(changes: SimpleChanges) {
		console.log(changes);
		if (changes['data'] !== undefined) {
			this.tableData = changes['data']?.currentValue;
		}
	}
  openSelect(selectRef: any){
  const el = selectRef.el.nativeElement.querySelector('.p-select-label-container');
  el?.click();
}
  openDrawer() {
    this.visible2 = true;
  }
  focusFirstInput() {
		setTimeout(() => {
			if (this.accountHolderName) {
				this.accountHolderName.nativeElement.focus();
			}
		}, 50);
	}
  isInvalid(name: string) {
    const c = this.bankForm.get(name);
    return c?.invalid && (c.touched || c.dirty);
  }
  focusNext(field:any){
    field?.focus()
  }
  matchAccountNumbers(group: FormGroup) {
    const acc = group.get('accountNumber')?.value;
    const confirm = group.get('confirmAccountNumber')?.value;
    const confirmControl = group.get('confirmAccountNumber');
    if (!confirmControl) return null;
    let errors = confirmControl.errors || {};
    if (acc !== confirm) {
      errors['mismatch'] = true;
    } else {
      delete errors['mismatch'];
    }
    confirmControl.setErrors(Object.keys(errors).length ? errors : null);
    return null;
  }
  bankIfscCode(event:any){
  const upper = event.target.value.toUpperCase();
  this.bankForm.patchValue({ifscCode: upper}, { emitEvent: false});
}
  numbersOnly(event: any, controlName: string) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    const trimmed = value.substring(0, 15);
    event.target.value = trimmed;
    this.bankForm.get(controlName)?.setValue(trimmed);
  }
  myColumns = [
    { field: 'accountHolderName', header: 'Account Holder Name',isCheck: true, isDefault: true, id: 1 , width: '200px' },
    { field: 'accountNumber', header: 'Account No',isCheck: true,isDefault:true,id:2,width:'200px' },
    { field: 'confirmAccountNumber', header: 'Confirm Account Number',isCheck: true,isDefault:true,id:3 ,width: '250px'},
    { field: 'accountType', header: 'Account Type',isCheck:true,isDefault:true,id:4 ,width: '180px'},
    { field: 'bankName', header: 'Bank Name',isCheck:true,isDefault:true,id:5,width: '180px' },
    { field: 'branchName', header: 'Branch Name',isCheck: true, isDefault: true, id: 6 ,width: '180px'},
    { field: 'ifscCode', header: 'IFSC Code',isCheck: true, isDefault: true, id: 7,width: '180px'},
    { field: 'address', header: 'Address',isCheck: true, isDefault: true, id: 8 ,width: '180px'},
  ];
  addItem() {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }
    const newItem: BankItem = this.bankForm.getRawValue();
    if (newItem.isDefault) {
      this.tableData.forEach((item: BankItem) => item.isDefault = false);
    }
    this.tableData = [...this.tableData, newItem];
    this.tableData.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
    this.bankForm.reset({ isDefault: false });
    this.bankForm.markAsPristine();
    this.bankForm.markAsUntouched();
    this.visible2 = false;
  }
//   toUppercase(event: any) {
//   const value = event.target.value.toUpperCase();
//   this.bankForm.get('ifscCode')?.setValue(value, { emitEvent: false });
// }
  updateSellerDetails(){
    const reqPayLoad = {
      userId: localStorage.getItem('userId'),
      businessPartnerCode: this.sellerService.businessPartnerCode,
			bankDetails: this.tableData
    };
    this.isLoading = true;
		this.sellerService.updateSellerDetails(reqPayLoad).subscribe({
			next: (res: any) => {
      if (res?.status === 'success') {
					this.isLoading = false;
					this.notificationService.showSuccess(res?.message);
					this.sellerService.businessPartnerCode = res?.data?.businessPartnerCode;
					this.sellerService.setStepperData('sellerDetails', res?.data);
					this.sellerService.actionSignal.set('bankDetailsSaved');
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
    this.bankForm.reset();
    this.bankForm.markAsPristine();
    this.bankForm.markAsUntouched();
  }
}
