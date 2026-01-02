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
interface ContactItem {
	fullName: string;
	designation: string;
	department: string;
	mobileNo: string;
	alternateNo: string;
	email: string;
	isDefault: boolean;
}
@Component({
	selector: 'app-contact-detail',
	imports: [DrawerModule, ButtonModule,
		FormsModule, CommonModule, SelectModule, SmartTable,
		ReactiveFormsModule, InputText, DividerModule, Checkbox, SpinnerLoader, ToastModule],
	templateUrl: './contact-detail.html',
	styleUrl: './contact-detail.less',
})
export class ContactDetail implements OnInit {

	@Input() data: any = [];
	visible2: boolean = false;
	isLoading: any;
	@ViewChild('contactFullName') contactFullName!: ElementRef;
	@Input() disabled: boolean = false;
	contactForm!: FormGroup;
	tableData: ContactItem[] = [];
	constructor(private fb: FormBuilder,
		private sellerService: Seller,
		private notificationService: Notifications,
		private messageService: MessageService,
		private cdr: ChangeDetectorRef,
	) {
		effect(() => {
			const value = this.sellerService.actionSignal();
			value === 'save-contact' && this.updateSellerDetails();
			value === 'clear-contact' && this.clearForm();
		})
	}
	ngOnInit(): void {
		if (this.data?.length) {
			this.tableData = this.data;
		}
		this.contactForm = this.fb.group({
			fullName: [null, Validators.required],
			designation: [null, Validators.required],
			department: [null, Validators.required],
			mobileNo: [null, Validators.required],
			alternateNo: [null, Validators.required],
			email: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]],
			isDefault: [false]
		});
		const contactDetails = this.sellerService.getStepperData('sellerDetails');
		if (contactDetails?.contactDetails?.length) {
			// this.contactForm.patchValue(contactDetails?.contactDetails);
			this.tableData = contactDetails?.contactDetails;
		}
	}
	ngOnChanges(changes: SimpleChanges) {
		console.log(changes);
		if (changes['data'] !== undefined) {
			this.tableData = changes['data']?.currentValue;
		}
	}
	openDrawer() {
		this.visible2 = true;
	}
	focusNext(field: any) {
		field?.focus();
	}
	isInvalid(name: string) {
		const c = this.contactForm.get(name);
		return c?.invalid && (c.touched || c.dirty);
	}
	numbersOnly(event: any, controlName: string) {
		const value = event.target.value.replace(/[^0-9]/g, '');
		const trimmed = value.substring(0, 16);
		event.target.value = trimmed;
		this.contactForm.get(controlName)?.setValue(trimmed);
	}
	focusFirstInput() {
		setTimeout(() => {
			if (this.contactFullName) {
				this.contactFullName.nativeElement.focus();
			}
		}, 50);
	}

	myColumns = [
		{ field: 'fullName', header: 'Full Name', isCheck: true, isDefault: true, id: 1 },
		{ field: 'designation', header: 'Designation', isCheck: true, isDefault: true, id: 2 },
		{ field: 'department', header: 'Department', isCheck: true, isDefault: true, id: 3 },
		{ field: 'mobileNo', header: 'Mobile No', isCheck: true, isDefault: true, id: 4 },
		{ field: 'alternateNo', header: 'Alternate No', isCheck: true, isDefault: true, id: 5 },
		{ field: 'email', header: 'Email', isCheck: true, isDefault: true, id: 6 },
	];
	addItem() {
		const newItem: ContactItem = this.contactForm.getRawValue();
		if (this.contactForm.invalid) {
			this.contactForm.markAllAsTouched();
			return;
		}
		if (newItem.isDefault) {
			this.tableData.forEach((item: ContactItem) => (item.isDefault = false));
		}
		this.tableData = [...this.tableData, newItem];
		this.tableData.sort((a, b) => {
			if (a.isDefault && !b.isDefault) return -1;
			if (!a.isDefault && b.isDefault) return 1;
			return 0;
		});
		this.contactForm.reset({ isDefault: false });
		this.contactForm.markAsPristine();
		this.contactForm.markAsUntouched();
		this.visible2 = false;
	}
	updateSellerDetails() {
		const reqPayLoad = {
			userId: localStorage.getItem('userId'),
			businessPartnerCode: this.sellerService.businessPartnerCode,
			contactDetails: this.tableData
		};
		this.isLoading = true;
		this.sellerService.updateSellerDetails(reqPayLoad).subscribe({
			next: (res: any) => {
				if (res?.status === 'success') {
					this.isLoading = false;
					this.notificationService.showSuccess(res?.message);
					this.sellerService.businessPartnerCode = res?.data?.businessPartnerCode;
					this.sellerService.setStepperData('sellerDetails', res?.data);
					this.sellerService.actionSignal.set('contactDetailsSaved')
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
		this.contactForm.reset();
		// this.contactForm.markAsPristine();
		// this.contactForm.markAsUntouched();
	}
}