import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { debounceTime } from 'rxjs';
import { SpinnerLoader } from '../../spinner-loader/spinner-loader';
import { CommonApi } from '../../service/common-api/common-api';
import { Notifications } from '../../service/notification/notifications';
// import { CommonApi } from '../servcies/common-api-service/common-api';
// import { Notifications } from '../servcies/notification/notifications';
// import { SpinnerLoader } from '../spinner-loader/spinner-loader';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    SpinnerLoader,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.less'],
  providers: [MessageService]
})
export class Register implements OnInit, AfterViewInit {
  registerForm!: FormGroup;
  otpTimer: any = {
    timer: 180,
    minutes: 3,
    seconds: 0
  }
  isLoading: boolean = false;
  isSendingOtp = false;
  isVerifyingOtp = false;
  otpClicked = true;
  otpSent: boolean = false;
  isOtpVerified = false;
  usernameAvailability: any;
  isEmailValid = false;
  otpTimeInterval: any;
  showOtpTimer: boolean = false;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonApi,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private notificationService: Notifications
  ) { }
  ngOnInit() {
    this.createForm();
    this.registerForm.get('u_email')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const emailCtrl = this.registerForm.get('u_email');
      if (emailCtrl?.valid && emailCtrl.value) {
        this.isEmailValid = true;
      } else {
        this.isEmailValid = false;
      }
      this.cdr.detectChanges();
    });
  }
  focusPassword(field:any){
    field?.input?.nativeElement.focus();
  }
  focusNext(field:any){
    field?.focus();
  }
  ngAfterViewInit() {
    this.registerForm?.get('u_username')?.valueChanges
      .pipe(debounceTime(800))
      .subscribe((value: any) => {
        if (value) this.checkUsernameAvailability(value);
      });
  }
  private createForm() {
    this.registerForm = this.fb.group(
      {
        u_firstname: ['', Validators.required],
        u_lastname: ['', Validators.required],
        u_username: ['', Validators.required],
        u_phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        u_email: ['', [Validators.required, Validators.email]],
        e_otp: [{ value: '', disabled: true }, Validators.required],
        u_password: ['', [Validators.required, Validators.minLength(6)]],
        u_cnfm_password: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }
  private passwordMatchValidator(form: FormGroup) {
    const pass = form.get('u_password')?.value;
    const confirm = form.get('u_cnfm_password')?.value;
    return pass === confirm ? null : { mismatch: true };
  }
  sentEmailOtp() {
    const email = this.registerForm.get('u_email')?.value;
    if (!email || !this.registerForm.get('u_email')?.valid) {
      this.notificationService.showError('Please enter a valid email to send OTP.');
      return;
    }
    this.isSendingOtp = true;
    const payload = { u_email: email, isPwdReset: false };
    this.commonService.sentEmailOtp(payload).subscribe({
      next: (res: any) => {
        this.isSendingOtp = false;
        this.otpSent = true;
        this.notificationService.showSuccess(res.message || 'OTP sent successfully!');
        this.cdr.detectChanges();
        this.getFormControls['u_email']?.disable();
        this.getFormControls['e_otp']?.enable();
        this.otpTimer.timer = 180;
        this.startTimer();
      },
      error: (err: any) => {
        this.isSendingOtp = false;
        this.notificationService.showError(err.error?.message || 'Failed to send OTP.');
        this.otpSent = false;
        this.otpTimer.timer = 180;
      }
    });
  }
  verifyEmailOtp() {
    const email = this.registerForm.get('u_email')?.value;
    const otp = this.registerForm.get('e_otp')?.value;
    if (!otp) {
      this.notificationService.showError('Please enter the OTP.');
      return;
    }
    this.isVerifyingOtp = true;
    const payload = { u_email: email, otp: otp, isPwdReset: false };
    this.commonService.verifyEmailOtp(payload).subscribe({
      next: (res: any) => {
        this.isVerifyingOtp = false;
        this.isOtpVerified = res.isOtpVerified;
        this.showOtpTimer = false;
        this.getFormControls['e_otp']?.disable();
        this.otpTimer.timer = 180;
        this.notificationService.showSuccess(res.message || 'OTP verified successfully!');
        this.cdr.detectChanges();
        clearInterval(this.otpTimeInterval);
        this.isOtpVerified = true;
      },
      error: (err: any) => {
        this.isVerifyingOtp = false;
        this.isOtpVerified = false;
        this.notificationService.showError(err.error?.message || 'Invalid OTP.');
      }
    });
  }
  checkUsernameAvailability(value: string) {
    if (!value?.trim()) return;
    const payload = { u_username: value };
    this.commonService.checkUserNameAvailability(payload).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.usernameAvailability = res.data?.isUsernameExist;
          if (this.usernameAvailability) {
            this.notificationService.showError(res?.data?.message)
          } else {
            this.notificationService.showSuccess(res?.data?.message)
          }
        }
      },
      error: (err: any) => {
        this.notificationService.showError(err.error?.message || 'Failed to check username.');
      }
    });
  }
  signinUser() {
    if (this.registerForm.invalid) {
      this.notificationService.showError('Please fill all required fields correctly.');
      return;
    }
    if (!this.isOtpVerified) {
      this.notificationService.showError('Please verify your OTP before signing up.');
      return;
    }
    this.isLoading = true;
    this.registerForm.removeControl('u_cnfm_password');
    this.registerForm.removeControl('e_otp');
    const payload = this.registerForm.getRawValue();
    payload.u_password = btoa(payload.u_password);
    this.commonService.signinUser(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.notificationService.showSuccess(res.message || 'Registered successfully!');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationService.showError(err.error?.message || 'Registration failed.');
      }
    });
  }
  startTimer() {
    this.showOtpTimer = true;
    clearInterval(this.otpTimeInterval);
    this.otpTimer.timer = 180;

    this.otpTimeInterval = setInterval(() => {
      if (this.otpTimer.timer > 0) {
        this.otpTimer.timer--;
        this.otpTimer.minutes = Math.floor(this.otpTimer.timer / 60);
        this.otpTimer.seconds = this.otpTimer.timer % 60;
      } else {
        clearInterval(this.otpTimeInterval);
        this.showOtpTimer = false;
      }
      this.cdr.detectChanges();
    }, 1000);
  }
  get getFormControls() {
    return this.registerForm.controls as any;
  }

}
