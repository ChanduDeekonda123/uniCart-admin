import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Popover } from 'primeng/popover';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-smart-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    IconField,
    InputIcon,
    ButtonModule,
    Popover
  ],
  templateUrl: './smart-table.html',
  styleUrls: ['./smart-table.less']
})
export class SmartTable implements OnInit{
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() showActions = false;
  @ViewChild('dt') dt: any;
  @Input() disableSelection: boolean = false;
  @Input() actionBtns: any[] = [];
  @Output() emitAction = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<any | null>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  selectedActionRow: any;
  globalFields: string[] = [];
  visible2: boolean = false;
  searchValue: string = '';
  selectedRow: any = null;
  filteredData: any[] = [];
  ngOnInit(): void {
    this.globalFields = this.columns.map(col =>col.field);
  }
  ngOnChanges(changes:SimpleChanges) {
    // this.selectionChange.emit(this.selectedRow);
    // console.log(changes);
    if(changes['data'] !== undefined){
      this.data = changes['data']?.currentValue;
    }
  }
  filterTable(value: string) {
  this.dt.filterGlobal(value, 'contains');
  }
  get visibleColumns() {
    return this.columns.filter(col => col.isCheck);
  }
  action(actionType:string, selectedData:any) {
    this.emitAction.emit({
      actionType: actionType,
      data: selectedData
    })
  }
  AddClicked() {
    this.onAdd.emit();
  }
  clear(table: any) {
    table.clear();
    this.searchValue = '';
  }
  openActions(event: Event, row: any, pop: any) {
    this.selectedActionRow = row;
    pop.toggle(event);
  }
  onEdit(pop: any) {
    this.edit.emit(this.selectedActionRow);
    pop.hide();
  }
  onDelete(pop: any) {
    this.delete.emit(this.selectedActionRow);
    pop.hide();
  }
}
