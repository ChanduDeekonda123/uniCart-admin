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
import { Seller } from '../../../service/seller/seller';
import { SmartTable } from '../../../smart-table/smart-table';
import { actionBtns, actionsKeys, listParams } from '../seller.config';
import { SpinnerLoader } from '../../../spinner-loader/spinner-loader';
import { ToastModule } from 'primeng/toast';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-seller-list',
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
    SpinnerLoader,
    ToastModule
  ],
  templateUrl: './seller-list.html',
  styleUrl: './seller-list.less',
})
export class SellerList implements OnInit {
  @ViewChild(SmartTable) smartTable!: SmartTable;
  sellerList: any[] = [];
  actionbtns: any[] = [...actionBtns];
  sellerProfile = {
    businessApprovel: false,
    addressApprovel: false,
    bankApprovel: false,
    productsApprovel: false,
    status: 'Draft',
    currentStep: 0
  };
  isLoading: any;
  op: any;
  activeTabIndex = 0;
  cities: City[] | undefined;
  selectedCity: City | undefined;
  selectAll: boolean = false;
  selectedItems: any[] = [];
  showSelection: string[] = [];
  hideSelection: string[] = [];
  tableColumns: any[] = [];
  checked: any;
  recordCounts:any = {};
  draftCount: number = 0;
  pendingCount: number = 0;
  approvelCount: number = 0;
  rejectedCount: number = 0;
  constructor(private router: Router, private sellerService: Seller) {
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
    // this.getSellerList(0);
    this.onTabChange(0);
    // this.getSellerCount();
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
    switch (action?.actionType) {
      case actionsKeys['edit']:
        this.sellerService.setStepperData('viewMode', actionsKeys['edit']);
        localStorage.setItem('businessPartnerCode', action?.data?.businessPartnerCode);
        this.router.navigate(['/seller/seller-details/create-seller/confirmation'])
        break;
      case actionsKeys['view']:
        this.sellerService.setStepperData('viewMode', actionsKeys['view']);
        localStorage.setItem('businessPartnerCode', action?.data?.businessPartnerCode);
        this.router.navigate(['/seller/seller-details/create-seller/confirmation'])
        break;
      case actionsKeys['delete']:
        this.deleteSeller(action?.data?._id);
        break;
      default:
        break;
    }
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
  // updateTabStatusFromRecord(record: any) {
  //   const status = record?.approvalStatus;
  //   if (status === 'd') {
  //     this.sellerProfile.status = "Draft";
  //     this.draftCount++;
  //   }
  //   else if (status === 'p') {
  //     this.sellerProfile.status = "Pending";
  //   }
  //   else if (status === 'a') {
  //     this.sellerProfile.status = "Approvel";
  //   }
  //   else if(status === 'r'){
  //     this.sellerProfile.status = "Rejected";
  //   }
  // }
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
        this.actionbtns = actionBtns.filter((btn: any) =>
          btn.text === actionsKeys['edit'] ||
          btn.text === actionsKeys['delete']
        );
        break;
      case 1:
        this.actionbtns = actionBtns.filter((btn: any) =>
          btn.text === actionsKeys['view']
        );
        break;
      case 2:
        this.actionbtns = actionBtns.filter((btn: any) =>
          btn.text === actionsKeys['view'] ||
          btn.type === actionsKeys['edit']
        );
        break;
    }
    this.actionbtns = this.actionbtns
    this.getSellerList(this.activeTabIndex);
    this.getSellerCount();
  }

  getSellerList(index: number) {
    const reqPayLoad = {
      userId: localStorage.getItem('userId'),
      approvalStatus: listParams[index]
    };
    this.sellerService.getSellerList(reqPayLoad).subscribe({
      next: (res: any) => {
        if (res?.status === 'success' && Array.isArray(res?.data)) {
          this.sellerList = this.mapSellerRows(res.data);
        } else {
          this.sellerList = [];
        }
      },
      error: (err: any) => {
        this.sellerList = [];
      }
    });
  }

  getSellerCount() {
    const reqPayLoad = {
      userId: localStorage.getItem('userId'),
    };
    this.isLoading = true;
    this.sellerService.getSellerCount(reqPayLoad).subscribe({
      next: (res: any) => {
        if (res?.status?.toLowerCase() === 'success') {
          this.isLoading = false;
          this.recordCounts = res.data;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
      }
    })
  }
}
