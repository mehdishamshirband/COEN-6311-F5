import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { UserForgetPassword } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  userForgetPassword : UserForgetPassword = {
    emailAddress: ''
  }

constructor(private userService: UserService) { }

  ForgetPassword() {
    console.warn(this.userService.validateEmail(this.userForgetPassword.emailAddress));
    console.warn(this.userForgetPassword);
  }
}
