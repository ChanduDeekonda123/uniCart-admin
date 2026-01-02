import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class Notifications {

  constructor(private messageService:MessageService) {}


  showSuccess(message: string){
    this.messageService.add({
      severity:'success',
      summary:'Success',
      detail: message,
      life: 3000,
    });
  }

  showError(message: string){
    this.messageService.add({
      severity:'error',
      summary:'Error',
      detail: message,
      life: 4000,
    });
  }
  showWarning(message: string){
    this.messageService.add({
      severity:'warn',
      summary:'Warning',
      detail: message,
      life: 3000,
    });
  }

  showInfo(message: string){
    this.messageService.add({
      severity:'info',
      summary:'Information',
      detail: message,
      life: 3000,
    });
  }

  clearMessage(){
    this.messageService.clear();
  }
}
