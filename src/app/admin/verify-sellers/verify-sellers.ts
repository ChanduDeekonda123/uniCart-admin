import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from "primeng/button";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Listbox } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { Popover } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
// import { actionBtns, actionsKeys, listParams } from '../seller.config';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Seller } from '../../service/seller/seller';
import { SmartTable } from '../../smart-table/smart-table';
import { adminActionBtns, actionsKeys, adminListParams } from '../admin.config';
import { Notifications } from '../../service/notification/notifications';
import { Toast } from 'primeng/toast';
import { SpinnerLoader } from '../../spinner-loader/spinner-loader';
// import { actionBtns, actionsKeys, listParams } from '../../seller/seller-details/seller.config';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-verify-sellers',
  imports: [
    TabsModule,
    StepperModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    SelectModule,
    BreadcrumbModule,
    SmartTable,
    InputIconModule,
    Popover,
    Listbox,
    CommonModule,
    MultiSelectModule,
    Dialog,
    Toast,
    SpinnerLoader
  ],
  templateUrl: 'verify-sellers.html',
  styleUrl: './verify-sellers.less',
  providers: [ConfirmationService, MessageService]
})
export class VerifySellers implements OnInit {
  @ViewChild(SmartTable) smartTable!: SmartTable;
  sellerList: any[] = [];
  isLoading:any;
  adminBtns = adminActionBtns;
  sellerProfile = {
    businessApprovel: false,
    addressApprovel: false,
    bankApprovel: false,
    productsApprovel: false,
    status: 'Draft',
    currentStep: 0
  };
  op: any;
  showReasonDialog = false;
  adminComment: string = '';
  selectedSellerId: string | null = null;
  selectedActionType: string | null = null;
  activeTabIndex = 0;
  cities: City[] | undefined;
  selectedCity: City | undefined;
  selectAll: boolean = false;
  selectedItems: any[] = [];
  showSelection: string[] = [];
  hideSelection: string[] = [];
  tableColumns: any[] = [];
  checked: any;
  pendingCount = 0;
  approvelCount = 0;
  rejectCount = 0;
  actionType: string ='';
  constructor(private router: Router,
    private sellerService: Seller,
    private confirmationService: ConfirmationService,
    private notificationService: Notifications,
    private messageService: MessageService
  ) {
    effect(() => {
      const newSeller = this.sellerService.sellerAdded();
      if (newSeller) {
        this.appendSellerToTable(newSeller);
        this.sellerService.sellerAdded.set(null);
      }
    });
  }
  ngOnInit() {
    this.getColumns();
    this.getSellerList(0);
    this.onTabChange(0);
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
    // this.syncShowHideSelections();
  }
  syncShowHideSelections() {
    this.showSelection = this.tableColumns
      .filter(c => c.isCheck).map(c => c.field);
    this.hideSelection = this.tableColumns
      .filter(c => !c.isCheck)
      .map(c => c.field);
  }
  onSearch(event: any) {
    this.smartTable.filterTable(event.target.value);
  }
  getColumns() {
    this.tableColumns = this.fields.map((f, index) => ({
      field: f.value,
      header: f.label,
      isCheck: f.isCheck,
      width: '230px'
    }));
    this.syncShowHideSelections();
    // this.tableColumns.push({
    //   field: 'action',
    //   header: 'Action',
    //   isCheck: true,
    //   width: '100px'
    // });
  }
  addBusiness() {
    this.router.navigate(['seller/seller-details/create-seller/general']);
  }
  appendSellerToTable(seller: any) {
    const rows = this.mapSellerRows(seller);
    rows.forEach((r: any) => this.upsertSellerInList(r));
  }
  handleAction(action: any) {
    const id = action?.data?._id;
    switch (action?.actionType) {
      case actionsKeys['view']:
        this.sellerService.setStepperData('viewMode', actionsKeys['view']);
        localStorage.setItem('businessPartnerCode', action?.data?.businessPartnerCode);
        this.router.navigate(['/admin/verify-sellers/confirmation'])
        break;
      case actionsKeys['approve']:
        localStorage.setItem('businessPartnerCode', action?.data?.businessPartnerCode);
        this.openReasonDialog('a');
        break;
      case actionsKeys['reject']:
        localStorage.setItem('businessPartnerCode', action?.data?.businessPartnerCode);
        this.openReasonDialog('r');
        break;
      default:
        break;
    }
  }
  openReasonDialog(type:string) {
    this.actionType = type;
    this.adminComment = '';
    this.showReasonDialog = true;
  }
  submitReason() {
    console.log("Reason:", this.adminComment);
    this.showReasonDialog = false;
    this.approveRejectSeller();
  }
  cancelDialog() {
    this.showReasonDialog = false;
    this.adminComment = '';
  }

  editSeller(data: any) {
    // data.type === actionsKeys['edit'] {
    // }
    // localStorage.setItem('businessPartnerCode', data.data?.businessPartnerCode)
    // this.router.navigate([
    //   'seller/seller-details/edit-seller',
    //   data._id
    // ]);
  }
  deleteSeller(id: any) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this seller?')) {
      return;
    }
    this.sellerService.deleteSeller(id).subscribe({
      next: (res: any) => {
        if (res?.status === 'success') {
          this.sellerList = this.sellerList.filter(
            s => s._id !== id
          );
        }
      },
      error: (err: any) => {
        console.error('Delete seller failed', err);
      }
    });
  }
  upsertSellerInList(row: any) {
    const idx = this.sellerList.findIndex((s: any) => s._id === row._id);
    if (idx > -1) {
      this.sellerList[idx] = { ...this.sellerList[idx], ...row };
    } else {
      this.sellerList.unshift(row);
    }
  }
  mapSellerRows(list: any) {
    if (!Array.isArray(list)) list = [list];
    return list.map((item: any) => ({
      businessPartner: item?.businessPartner ?? '',
      businessPartnerCode: item?.businessPartnerCode ?? '',
      createdOn: item?.createdOn ?? '',
      city: item?.city ?? '',
      state: item?.state ?? '',
      country: item?.country ?? '',
      pincode: item?.pincode ?? '',
      currency: item?.currency ?? '',
      storeName: item?.storeName ?? '',
      gstNumber: item?.gstNumber ?? '',
      brandName: item?.brandName ?? '',
      salesRating: item?.salesRating ?? '',
      paymentRating: item?.paymentRating ?? '',
      transitDays: item?.transitDays ?? '',
      balance: item?.balance ?? 0,
      overDuebalance: item?.overDuebalance ?? 0,
      accountGroup: item?.accountGroup ?? '',
      slAccount: item?.slAccount ?? '',
      taxRates: item?.taxRates ?? '',
      paymentTerm: item?.paymentTerm ?? '',
      modeOfPayment: item?.modeOfPayment ?? '',
      overdueDays: item?.overdueDays ?? 0,
      creditLimit: item?.creditLimit ?? 0,
      creditHoldAmount: item?.creditHoldAmount ?? 0,
      isCreditHold: item?.isCreditHold ?? false,
      isOverdueHold: item?.isOverdueHold ?? false,
      paymentReminder: item?.paymentReminder ?? false,
      businessModel: item?.businessModel ?? '',
      businessCategory: item?.businessCategory ?? '',
      primaryProductCategory: item?.primaryProductCategory ?? '',
      domestic: item?.domestic ?? '',
      panNo: item?.panNo ?? '',
      aadharNo: item?.aadharNo ?? '',
      msmeNo: item?.msmeNo ?? '',
      pfNo: item?.pfNo ?? '',
      esiNo: item?.esiNo ?? '',
      recordStatus: item?.recordStatus ?? '',
      _id: item?._id
    }));
  }
  updateTabStatusFromRecord(record: any) {
    const status = record?.approvalStatus;
    if (status === 'p') {
      this.sellerProfile.status = "Pending";
      this.pendingCount++;
    }
    else if (status === 'a') {
      this.sellerProfile.status = "Approve";
      this.approvelCount++;
    }
    else if (status === 'r') {
      this.sellerProfile.status = "Reject";
      this.rejectCount++;
    }
  }
  fields = [
    { label: 'Business Partner', value: 'businessPartner', isCheck: true },
    { label: 'Business Partner Code', value: 'businessPartnerCode', isCheck: true, },
    { label: 'Created On', value: 'createdOn', isCheck: true, },
    { label: 'City', value: 'city', isCheck: true, },
    { label: 'State', value: 'state', isCheck: true, },
    { label: 'Country', value: 'country', isCheck: false, },
    { label: 'Pin Code', value: 'pincode', isCheck: false },
    { label: 'Currency', value: 'currency', isCheck: false },
    { label: 'Record Status', value: 'recordStatus', isCheck: false },
    { label: 'Store Name', value: 'storeName', isCheck: false },
    { label: 'GST Number', value: 'gstNumber', isCheck: false },
    { label: 'Brand Name', value: 'brandName', isCheck: false },
    { label: 'Sales Rating', value: 'salesRating', isCheck: false },
    { label: 'Payment Rating', value: 'paymentRating', isCheck: false },
    { label: 'Transit Days', value: 'transitDays', isCheck: false },
    { label: 'Balance', value: 'balance', isCheck: false },
    { label: 'Over due', value: 'overDuebalance', isCheck: false },
    { label: 'Account group', value: 'accountGroup', isCheck: false },
    { label: 'SL Account', value: 'slAccount', isCheck: false },
    { label: 'Tax Rate', value: 'taxRates', isCheck: false },
    { label: 'Payment Term', value: 'paymentTerm', isCheck: false },
    { label: 'Mode Of Payment', value: 'modeOfPayment', isCheck: false },
    { label: 'Overdue Days', value: 'overdueDays', isCheck: false },
    { label: 'Credit Limit', value: 'creditLimit', isCheck: false },
    { label: 'Credit Hold Amount', value: 'creditHoldAmount', isCheck: false },
    { label: 'Credit Hold', value: 'isCreditHold', isCheck: false },
    { label: 'Overdue Hold', value: 'isOverdueHold', isCheck: false },
    { label: 'Payment Reminder', value: 'paymentReminder', isCheck: false },
    { label: 'Business Model', value: 'businessModel', isCheck: false },
    { label: 'Business Category', value: 'businessCategory', isCheck: false },
    { label: 'Primary Product Category', value: 'primaryProductCategory', isCheck: false },
    { label: 'Domestic', value: 'domestic', isCheck: false },
    { label: 'PAN No', value: 'panNo', isCheck: false },
    { label: 'Aadhar No', value: 'aadharNo', isCheck: false },
    { label: 'MSME No', value: 'msmeNo', isCheck: false },
    { label: 'PF No', value: 'pfNo', isCheck: false },
    { label: 'ESI No', value: 'esiNo', isCheck: false },
  ];
  notifications = [
    { message: 'Product approved', type: 'APPROVED', color: 'success' },
    { message: 'Low stock warning', type: 'STOCK', color: 'warn' },
    { message: 'Order shipped', type: 'ORDER', color: 'info' },
    { message: 'New message', type: 'MESSAGE', color: 'secondary' },
  ];
  applyShow(pop: any) {
    this.tableColumns.forEach(col => {
      col.isCheck = this.showSelection.includes(col.field);
    });
    pop.hide();
    // this.syncShowHideSelections();
  }
  applyHide(pop: any) {
    this.tableColumns.forEach(col => {
      col.isCheck = !this.hideSelection.includes(col.field);
    });
    pop.hide();
    // this.syncShowHideSelections();
  }
  clearShow() {
    this.showSelection = [];
  }
  clearHide() {
    this.hideSelection = [];
  }
  onTabChange(index: any) {
    this.activeTabIndex = Number(index);
    switch (this.activeTabIndex) {
      case 0:
        this.adminBtns = adminActionBtns.filter((btn: any) =>
          btn.text === actionsKeys['view'] ||
          btn.text === actionsKeys['approve'] ||
          btn.text === actionsKeys['reject']
        );
        break;
      case 1:
        this.adminBtns = adminActionBtns.filter((btn: any) =>
          btn.text === actionsKeys['view']
        );
        break;
      case 2:
        this.adminBtns = adminActionBtns.filter((btn: any) =>
          btn.text === actionsKeys['view']
        );
        break;
    }
    this.adminBtns = this.adminBtns;
    this.getSellerList(this.activeTabIndex);
  }
  getSellerList(index: number) {
    const reqPayLoad = {
      userId: localStorage.getItem('userId'),
      approvalStatus: adminListParams[index]
    };
    this.sellerService.getSellerList(reqPayLoad).subscribe({
      next: (res: any) => {
        if (res?.status === 'success' && Array.isArray(res?.data)) {
          this.sellerList = this.mapSellerRows(res.data);
          this.pendingCount = 0;
          this.approvelCount = 0;
          res.data.forEach((record: any) => {
            this.updateTabStatusFromRecord(record);
          });
        } else {
          this.sellerList = [];
        }
      },
      error: (err: any) => {
        this.sellerList = [];
      }
    });
  }
  approveRejectSeller(){
    const reqPayLoad = {
      businessPartnerCode : localStorage.getItem('businessPartnerCode'),
      userId: localStorage.getItem('userId'),
      remarks : this.adminComment,
      actionType: this.actionType
    };
    this.isLoading = true;
    this.sellerService.approveRejectSeller(reqPayLoad).subscribe({
      next: (res : any)=> {
        if(res?.status === 'success'){
          this.isLoading = false;
          this.notificationService.showSuccess(res?.message);
          this.getSellerList(this.activeTabIndex);
        }
      },
      error:(err:any) =>{
        this.isLoading = false;
        this.notificationService.showError(err?.message);
      }
    });
  }
}
