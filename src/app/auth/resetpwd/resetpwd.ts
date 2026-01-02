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

@Component({
  selector: 'app-resetpwd',
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
  templateUrl: './resetpwd.html',
  styleUrls: ['./resetpwd.less'],
  providers: [MessageService]
})
export class Resetpwd implements OnInit, AfterViewInit {
  resetForm!: FormGroup;

  otpTimer = { timer: 180, minutes: 3, seconds: 0 };
  isLoading = false;
  isSendingOtp = false;
  isVerifyingOtp = false;
  otpSent = false;
  isOtpVerified = false;
  isPwdReset = false;
  showOtpTimer = false;
  otpTimeInterval: any;
  isEmailValid = false;

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

    this.resetForm.get('u_email')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const emailCtrl = this.resetForm.get('u_email');
      this.isEmailValid = !!(emailCtrl?.valid && emailCtrl.value);
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() { }

  private createForm() {
    this.resetForm = this.fb.group(
      {
        u_email: ['', [Validators.required, Validators.email]],
        otp: [{ value: '', disabled: true }, Validators.required],
        u_password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const pass = form.get('u_password')?.value;
    const confirm = form.get('confirm_password')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  sendOtp() {
    const email = this.resetForm.get('u_email')?.value;
    if (!email || !this.resetForm.get('u_email')?.valid) {
      this.notificationService.showError('Please enter a valid email to send OTP.');
      return;
    }

    this.isSendingOtp = true;
    const payload = { u_email: email, isPwdReset: true };

    this.commonService.sentEmailOtp(payload).subscribe({
      next: (res: any) => {
        this.isSendingOtp = false;
        this.otpSent = true;
        this.notificationService.showSuccess(res.message || 'OTP sent successfully!');
        this.getFormControls['u_email']?.disable();
        this.getFormControls['otp']?.enable();
        this.startTimer();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isSendingOtp = false;
        this.notificationService.showError(err.error?.message || 'Failed to send OTP.');
        this.otpSent = false;
      }
    });
  }

  verifyOtp() {
    const email = this.resetForm.get('u_email')?.value;
    const otp = this.resetForm.get('otp')?.value;

    if (!otp) {
      this.notificationService.showError('Please enter the OTP.');
      return;
    }

    this.isVerifyingOtp = true;
    const payload = { u_email: email, otp: otp, isPwdReset: true };

    this.commonService.verifyEmailOtp(payload).subscribe({
      next: (res: any) => {
        this.isVerifyingOtp = false;
        this.isOtpVerified = true;
        this.showOtpTimer = false;
        this.getFormControls['otp']?.disable();
        clearInterval(this.otpTimeInterval);
        this.notificationService.showSuccess(res.message || 'OTP verified successfully!');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isVerifyingOtp = false;
        this.isOtpVerified = false;
        this.notificationService.showError(err.error?.message || 'Invalid OTP.');
      }
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.notificationService.showError('Please fill all required fields correctly.');
      return;
    }

    if (!this.isOtpVerified) {
      this.notificationService.showError('Please verify your OTP first.');
      return;
    }

    this.isLoading = true;

    const payload = {
      u_email: this.resetForm.get('u_email')?.value,
      u_password: btoa(this.resetForm.get('u_password')?.value)
    };

    this.commonService.PwdReset(payload).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.isLoading = false;
          this.notificationService.showSuccess(res.message || 'Password reset successful!');
          this.isPwdReset = true;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.notificationService.showError(res.message);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notificationService.showError(err.error?.message || 'Password reset failed.');
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
    return this.resetForm.controls as any;
  }
}
