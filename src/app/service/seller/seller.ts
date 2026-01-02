import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { END_POINT_URL } from '../../constant';
import { HttpService } from '../http-service/http-service';
@Injectable({
  providedIn: 'root',
})
export class Seller {
  actionSignal = signal('');
  sellerAdded = signal<any>(null);
  businessPartnerCode = signal<string | null>(null);
  stepperData: any = {};
  sellerDetails = signal<any>(null);
  constructor(private httpService: HttpService, private router: Router) { }
  saveGeneralDetails(payLoad: any): Observable<any> {
    if (this.stepperData?.sellerDetails?.isNewRecord) {
      return this.httpService.putMethod(END_POINT_URL.UPDATE_SELLERDETAILS, payLoad);
    } else {
      return this.httpService.postMethod(END_POINT_URL.SAVE_GENERALDETAILS, payLoad);
    }
  }
  getSellerList(payload: any): Observable<any> {
    return this.httpService.getMethodWithParams(END_POINT_URL.SHOW_SELLERLIST, payload);
  }
  updateSellerDetails(payload: any): Observable<any> {
    return this.httpService.putMethod(END_POINT_URL.UPDATE_SELLERDETAILS, payload);
  }
  getSellerByCode(payLoad: any): Observable<any> {
    return this.httpService.getMethodWithParams(END_POINT_URL.GETSELLERBY_CODE, payLoad);
  }
  deleteSeller(id: any): Observable<any> {
    return this.httpService.deleteMethod(END_POINT_URL.DELETE_SELLERLIST + '/' + id)
  }
  setStepperData(key: any, data: any) {
    this.stepperData[key] = data;
  }
  getStepperData(key: any) {
    return this.stepperData[key];
  }
  sendForApprovel(payload: any): Observable<any> {
    return this.httpService.putMethod(END_POINT_URL.SENDFOR_APPROVEL, payload);
  }
  approveRejectSeller(payload: any): Observable<any> {
    return this.httpService.putMethod(END_POINT_URL.REJECTAPPROVE_SELLER, payload);
  }
  getSellerCount(payload:any): Observable<any>{
    return this.httpService.getMethodWithParams(END_POINT_URL.GETSELLER_COUNT, payload)
  }
}
