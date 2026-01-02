import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Config {
  
  loginUserId:any;
  loginUserName:any;
  loginUserEmail:any;

  constructor() {
    this.getUserDetais()
  }

  getUserDetais() {
    this.loginUserEmail = localStorage.getItem('u_email');
    this.loginUserId = localStorage.getItem('userId');
    this.loginUserName = localStorage.getItem('u_username');
  }
  
}
