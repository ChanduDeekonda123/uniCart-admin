import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http-service';
import { END_POINT_URL } from '../../constant';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonApi {


  constructor(private httpService: HttpService) {

  }
  loginUser(payload: any): Observable<any> {
    return this.httpService.postMethod(END_POINT_URL.LOGIN_USER, payload);
  }

  getSequenceCode(): Observable<any> {
    return this.httpService.getMethod(END_POINT_URL.SEQUENCE_CODE);
  }
  // registerUser(payload: any): Observable<any> {
  //   return this.httpService.postMethod(END_POINT_URL.REGISTER_USER, payload);
  // }

  sentEmailOtp(data: any): Observable<any> {
    return this.httpService.postMethod(END_POINT_URL.SEND_EMAIL_OTP, data);
  }

  verifyEmailOtp(data: any): Observable<any> {
    return this.httpService.postMethod(END_POINT_URL.VERIFY_EMAIL_OTP, data);
  }

  PwdReset(data:any):Observable<any> {
    return this.httpService.postMethod(END_POINT_URL.RESET_PASSWORD, data);
  }

  checkUserNameAvailability(data: any): Observable<any> {
    return this.httpService.postMethod(END_POINT_URL.CHECK_USERNAME_AVAILABILTY, data)
  }
  signinUser(data: any): Observable<any> {
    return this.httpService.postMethod(END_POINT_URL.SIGNUP_USER, data);
  }

  saveProduct(data: any): Observable<any> {
    return this.httpService.postMethod(END_POINT_URL.SAVE_PRODUCT, data);
  }
  UpdateProduct(id: any, data: any): Observable<any> {
    return this.httpService.postMethod(END_POINT_URL.UPDATE_PRODUCT + '/' + id, data)
  }
  getProductById(id: string | null): Observable<any> {
    return this.httpService.getMethod(END_POINT_URL.GET_PRODUCT_BY_ID + '/' + id);
  }
  // getProducts(data?: any): Observable<any> {
  //   return this.httpService.getMethod(END_POINT_URL.GET_PRODUCTS, {
  //     params: data
  //   });
  // }
  // deleteProduct(id: any): Observable<any> {
  //   return this.httpService.delete<any>(END_POINT_URL.DELETE_PRODUCT + '/' + id)
  // }

  // getProductsCategorys(data: any): Observable<any> {
  //   return this.httpService.getMethod(END_POINT_URL.GET_PRODUCTS_CATEGORY_LIST, {
  //     params: data
  //   });a
  // }



  
  cartdata: any = []

  addtocart(data: any) {
    this.cartdata.push(data)
  }
  getcartdata() {
    return this.cartdata
  }
  deletecartdata() {
    this.cartdata.length = 0
  }

  address: any = []

  adduseraddress(data: any) {
    this.address.push(data)
  }
  getuseraddress() {
    return this.address
  }
  deleteuseraddress() {
    this.address.length = 0
  }

}
