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
interface AddressItem {
	addressType: string;
	businessParther: string;
	addressA: string;
	addressB: string;
	landmark: string;
	city: string;
	state: string;
	country: string;
	pincode: string;
	isDefault: boolean;
	selected: boolean;
}
@Component({
	selector: 'app-address-detail',
	providers: [MessageService],
	imports: [DrawerModule, ButtonModule, SmartTable,
		FormsModule, CommonModule, SelectModule, SmartTable,
		ReactiveFormsModule, InputText, DividerModule, Checkbox,
		SpinnerLoader, ToastModule],
	templateUrl: './address-detail.html',
	styleUrl: './address-detail.less',
})
export class AddressDetail implements OnInit {
	visible2: boolean = false;
	@Input() data: any = [];
	@Input() disabled: boolean = false;
	@ViewChild('addressTypes') addressTypes!: any;
	addressForm!: FormGroup;
	addressType: any = "billing";
	isLoading: any;
	tableData: AddressItem[] = [];
	constructor(private fb: FormBuilder,
		private sellerService: Seller,
		private notificationService: Notifications,
		private messageService: MessageService,
		private cdr: ChangeDetectorRef,
	) {
		effect(() => {
			const value = this.sellerService.actionSignal();
			value === 'save-address' && this.updateSellerDetails();
			value === 'clear-address' && this.clearForm();
		})
	}
	ngOnInit(): void {
		if (this.data?.length) {
			this.tableData = this.data;
		}
		this.addressForm = this.fb.group({
			addressType: [null],
			businessParther: [null, Validators.required],
			addressA: [null, Validators.required],
			addressB: [null, Validators.required],
			landmark: [null, Validators.required],
			city: [null, Validators.required],
			state: [null, Validators.required],
			country: [null, Validators.required],
			pincode: [null, Validators.required],
			isDefault: [false]
		});
		const addressDetails = this.sellerService.getStepperData('sellerDetails');
		if (addressDetails?.addressDetails?.length) {
			this.tableData = addressDetails?.addressDetails;
		}
		this.addressType = [
			{ name: 'Billing Address', code: "Ba" },
			{ name: 'Shopping Address', code: "Sa" },
			{ name: 'Sold To Address', code: "Sa" }
		]
	}
	ngOnChanges(changes: SimpleChanges) {
		// console.log(changes);
		if (changes['data'] !== undefined) {
			this.tableData = changes['data']?.currentValue;
		}
	}
	// focusFirstInput() {
	// 	setTimeout(() => {
	// 		const el = this.addressTypes?.el?.nativeElement?.querySelector('.p-select-label-container');
	// 		if (el) {
	// 			el.click();
	// 		}
	// 	}, 100);
	// }
	// 	onDrawerOpen() {
	//   setTimeout(() => {
	//     this.addressTypes.nativeElement.focus();
	//   }, 50);  // Small delay to wait for PrimeNG animation
	// }
	openDrawer() {
		this.visible2 = true;
	}
	openSelect(selectRef: any) {
		const el = selectRef.el.nativeElement.querySelector('.p-select-label-container');
		el?.click();
	}
	isInvalid(name: string) {
		const c = this.addressForm.get(name);
		return c?.invalid && (c.touched || c.dirty);
	}
	numbersOnlyZipcode(event: any) {
		const value = event.target.value.replace(/[^0-9]/g, '');
		event.target.value = value.substring(0, 6);
		this.addressForm.get('pincode')?.setValue(event.target.value);
	}
	focusNext(field: any) {
		field?.focus();
	}

	myColumns = [
		{ field: 'addressType', header: 'Address Type', isCheck: true, isDefault: true, id: 1, width: '180px' },
		{ field: 'businessParther', header: 'Business Parther', isCheck: true, isDefault: true, id: 2, width: '180px' },
		{ field: 'addressA', header: 'Address A', isCheck: true, isDefault: true, id: 3, width: '180px' },
		{ field: 'addressB', header: 'Address B', isCheck: true, isDefault: true, id: 4, width: '180px' },
		{ field: 'landmark', header: 'Landmark', isCheck: true, isDefault: true, id: 5, width: '140px' },
		{ field: 'city', header: 'City', isCheck: true, isDefault: true, id: 6, width: '140px' },
		{ field: 'state', header: 'State', isCheck: true, isDefault: true, id: 7, width: '140px' },
		{ field: 'country', header: 'Country', isCheck: true, isDefault: true, id: 8, width: '140px' },
		{ field: 'pincode', header: 'Pincode', isCheck: true, isDefault: true, id: 9, width: '140px' }
	];
	addItem() {
		const newItem: AddressItem = this.addressForm.getRawValue();
		if (this.addressForm.invalid) {
			this.addressForm.markAllAsTouched();
			return;
		}
		if (newItem.isDefault) {
			this.tableData.forEach((item: AddressItem) => (item.isDefault = false));
		}
		this.tableData = [...this.tableData, newItem];
		this.tableData.sort((a, b) => {
			if (a.isDefault && !b.isDefault) return -1;
			if (!a.isDefault && b.isDefault) return 1;
			return 0;
		});
		// this.addressForm.reset();
		// this.visible2 = true;
		// console.log(this.addressForm.value.isDefault);
		this.addressForm.reset({ isDefault: false });
		this.addressForm.markAsPristine();
		this.addressForm.markAllAsTouched();
		this.visible2 = false;
	}
	updateSellerDetails() {
		const reqPayLoad = {
			userId: localStorage.getItem('userId'),
			businessPartnerCode: this.sellerService.businessPartnerCode,
			addressDetails: this.tableData
		};
		this.isLoading = true;
		this.sellerService.updateSellerDetails(reqPayLoad).subscribe({
			next: (res: any) => {
				if (res?.status === 'success') {
					this.isLoading = false;
					this.notificationService.showSuccess(res?.message);
					this.sellerService.businessPartnerCode = res?.data?.businessPartnerCode;
					this.sellerService.setStepperData('sellerDetails', res?.data);
					this.sellerService.actionSignal.set('addressDetailsSaved')
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
		this.addressForm.reset();
	}
}