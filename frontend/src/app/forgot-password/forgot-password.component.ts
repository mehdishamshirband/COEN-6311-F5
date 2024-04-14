import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { UserForgetPassword } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  userForgetPassword : UserForgetPassword = {
    email: ''
  }

constructor(private userService: UserService,
            private router: Router) { }

  ForgetPassword() {
    if(this.userService.validateEmail(this.userForgetPassword.email)) {
      this.userService.forgetPassword(this.userForgetPassword).subscribe({
        next: (response) => {
          if(response.detail) {
            alert('An email has been sent to you with instructions on how to reset your password');
            void this.router.navigate(['/login']);
          }
          else {
            alert('Invalid email');
          }
        },
        error: (error) => {
          alert('Invalid email');
        }
      });
      }
    else{
      alert('Invalid email');
    }
    }
}
