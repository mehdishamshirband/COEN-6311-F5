import { Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { UserLogin } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  userLogin : UserLogin = {
    emailAddress: '',
    password: ''
  }
  constructor(private userService: UserService) { }

  Login() {
    console.warn(this.userService.validateEmail(this.userLogin.emailAddress));
    console.warn(this.userService.validatePassword(this.userLogin.password));
    console.warn(this.userLogin);
  }

}


