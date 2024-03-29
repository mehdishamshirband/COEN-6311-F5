import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { UserRegister } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-sign-up',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css'
})
export class UserSignUpComponent {

  userRegister: UserRegister = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private userService: UserService) {}

  signUp() {
    console.warn(this.userService.validateEmail(this.userRegister.emailAddress));
    console.warn(this.userService.validatePassword(this.userRegister.password));
    console.warn(this.userService.validatePasswordMatch(this.userRegister.password, this.userRegister.confirmPassword));
    console.warn(this.userRegister);
  }
}
