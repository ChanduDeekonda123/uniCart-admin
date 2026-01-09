import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../Environment/enviroment';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  mainUrl: any = environment?.apiBaseUrl;
  constructor(private httpClint: HttpClient) {
  }
  getCompleteUrl(url: any) {
    return this.mainUrl + url;
  }
  getMethod(endPoint: any) {
    const url = this.getCompleteUrl(endPoint);
    return this.httpClint.get(url);
  }
  postMethod(endPoint: any, payload: any) {
    const url = this.getCompleteUrl(endPoint);
    return this.httpClint.post(url, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => error)
      })
    );
  }
  putMethod(endPoint:any, payload:any) {
    const url = this.getCompleteUrl(endPoint);
    return this.httpClint.put(url, payload)
  }
  getMethodWithParams(endPoint:any, payload:any){
    const url = this.getCompleteUrl(endPoint);
    return this.httpClint.get(url, {params:payload})
  }
  deleteMethod(endPoint: any) {
  const url = this.getCompleteUrl(endPoint);
  return this.httpClint.delete(url).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error);
      return throwError(() => error);
    })
  );
}
}


//this file helps to call apis like get,post,put,delete