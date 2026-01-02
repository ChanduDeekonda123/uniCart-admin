import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { CommonApi } from '../../service/common-api/common-api';
import { Config } from '../../service/config/config';
import { SpinnerLoader } from '../../spinner-loader/spinner-loader';
import { Notifications } from '../../service/notification/notifications';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    RouterLink,
    SpinnerLoader
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.less'],
})
export class Login implements OnInit {
  // @ViewChild('password') passwordInput!: ElementRef;
  loginForm!: FormGroup;
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonApi,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private notificationService: Notifications,
    private configService: Config
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      u_email: ['', [Validators.required]],
      u_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  focusPassword(field:any) {
      field?.input?.nativeElement.focus();
      // this.passwordInput?.nativeElement.focus();
    }
    
  loginUser() {
    if (this.loginForm.invalid) {
      this.notificationService.showError('Please enter valid credentials.');
      return;
    }
    this.isLoading = true;
    const requestPayload = {
      identifier: this.loginForm.get('u_email')?.value,
      u_password: btoa(this.loginForm.get('u_password')?.value),
    };

    this.commonService.loginUser(requestPayload).subscribe(
      (res: any) => {
        if (res?.status === 'success') {
          this.isLoading = false;
          localStorage.setItem('u_email', res?.email);
          localStorage.setItem('u_username', res?.userName);
          localStorage.setItem('userId', res?.userId)
          localStorage.setItem('fashion-access-token', res?.token);
          this.notificationService.showSuccess(res?.message);
          this.configService.loginUserId = res?.userId;
          this.configService.loginUserName = res?.userName;
          this.configService.loginUserEmail = res?.email;
          this.router.navigate([res?.isAdmin ? '/admin' : '/seller']);
        } else {
          this.notificationService.showError(res?.message || 'Login failed');
        }
      },
      (error) => {
        this.isLoading = false;
        this.notificationService.showError(error.error?.message || 'Server error');
      }
    );
  }

}
