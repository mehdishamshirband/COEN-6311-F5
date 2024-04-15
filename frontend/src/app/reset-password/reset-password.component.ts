import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {UserResetPassword} from "../interfaces/user.interface";
import {RouterModule} from "@angular/router";
import {UserService} from "../services/user.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  userResetPassword: UserResetPassword = {
    email: '',
    reset_code: '',
    new_password: '',
    confirmPassword: ''
  };


  constructor(private router: Router,
              private userService: UserService) {}

  ResetPassword() {
    let data_validator = [true, true, true, true];

    if (!this.userService.validateEmail(this.userResetPassword.email)) {
      data_validator[0] = false;
      alert('Invalid email');
    }
    if (this.userResetPassword.reset_code.length !== 6) {
      data_validator[1] = false;
      alert('Invalid reset code');
    }
    if (!this.userService.validatePassword(this.userResetPassword.new_password)) {
      data_validator[2] = false;
      alert('Invalid password');
    }
    if (!this.userService.validatePasswordMatch(this.userResetPassword.new_password, this.userResetPassword.confirmPassword)) {
      data_validator[3] = false;
      alert('Passwords do not match');
    }

    if (data_validator.every(Boolean)) {
      void this.userService.resetPassword(this.userResetPassword).subscribe( {
        next: (data) => {
          alert('Password reset successfully');
          void this.router.navigate(['/login']);
        },
        error: (error) => {
          alert(error.error.detail);
        }
      });
    }

  }

    protected readonly sessionStorage = sessionStorage;
}
