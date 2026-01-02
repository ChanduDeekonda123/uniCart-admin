import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { Seller } from '../../../service/seller/seller';
import { actionsKeys, stepperUrls } from '../seller.config';
@Component({
	selector: 'app-create-seller',
	standalone: true,
	imports: [StepsModule, ToastModule, RouterOutlet, CommonModule, ButtonModule, BreadcrumbModule],
	templateUrl: './create-seller.html',
	styleUrl: './create-seller.less',
	providers: [MessageService]
})
export class CreateSeller implements OnInit {
	activeIndex: number = 0;
	items: MenuItem[] = [];
	isViewMode = false;
	resourceUrl: string = 'seller/seller-details/create-seller/';
	generalFormValid = false;
	stepRoutes = [
		'general',
		'basic',
		'address',
		'contact',
		'finance',
		'bank',
		'statutory',
		'confirmation'
	];
	sellerCode: any = null;
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private sellerService: Seller
	) {
		effect(() => {
			const value = this.sellerService.actionSignal();
			value === 'generalDetailsSaved' && (this.sellerCode = this.sellerService.businessPartnerCode);
			// value === 'clear-general' && this.clearForm();
		})
	}
	ngOnInit(): void {
		this.items = [
			{
				label: 'General Detail',
				routerLink: ['general'],
				command: () => this.setActiveStep('general')
			},
			{
				label: 'Basic Detail',
				routerLink: ['basic'],
				command: () => this.setActiveStep('basic')
			},
			{
				label: 'Address Detail',
				routerLink: ['address'],
				command: () => this.setActiveStep('address')
			},
			{
				label: 'Contact Detail',
				routerLink: ['contact'],
				command: () => this.setActiveStep('contact')
			},
			{
				label: 'Finance Detail',
				routerLink: ['finance'],
				command: () => this.setActiveStep('finance')
			},
			{
				label: 'Bank Detail',
				routerLink: ['bank'],
				command: () => this.setActiveStep('bank')
			},
			{
				label: 'Statutory Detail',
				routerLink: ['statutory'],
				command: () => this.setActiveStep('statutory')
			},
			{
				label: 'Confirmation',
				routerLink: ['confirmation'],
				command: () => this.setActiveStep('confirmation')
			}
		];
		const mode = this.sellerService.getStepperData('viewMode');
		this.isViewMode = mode === actionsKeys['view'];
		// const current = this.router.url.split('/').pop();
		// if (current !== 'general') {
		// 	this.router.navigate(['general'], { relativeTo: this.route });
		// }
		// const idx = this.stepRoutes.indexOf(current!);
		// if (idx !== -1) this.activeIndex = idx;
	}
	setActiveStep(step: string) {
		this.activeIndex = this.stepRoutes.indexOf(step);
	}

	onGeneralFormChange(status: boolean) {
		this.generalFormValid = status;
	}

	save() {
		this.sellerService.actionSignal.set(`save-${stepperUrls[this.activeIndex]}`)
		this.sellerCode = this.sellerService.businessPartnerCode
	}
	sendForApproval(){
		this.sellerService.actionSignal.set('send-approval');
	}
	nextStep() {
		if (this.activeIndex < this.stepRoutes.length - 1) {
			this.activeIndex++;
			this.router.navigate([this.stepRoutes[this.activeIndex]], {
				relativeTo: this.route
			});
		}
	}
	previousStep() {
		if (this.activeIndex > 0) {
			this.activeIndex--;
			this.router.navigate([this.stepRoutes[this.activeIndex]], {
				relativeTo: this.route
			});
		}
	}
	
	clearAll() {
		this.sellerService.actionSignal.set(`clear-${stepperUrls[this.activeIndex]}`)
	}
	breadcrumbItems = [{ label: 'Create Seller' }];

	ngOnDestroy() {
		localStorage.removeItem('businessPartnerCode');
		this.sellerService.stepperData = {};
		this.sellerService.actionSignal.set('');
	}
}
