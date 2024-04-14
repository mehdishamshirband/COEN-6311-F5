import { Component} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
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
    email: '',
    password: ''
  }
  constructor(private userService: UserService,
              private router: Router) { }

  data_validator = [true, true];

  Login() {
    this.data_validator = [true, true];
    if(!this.userService.validateEmail(this.userLogin.email)) {
      alert('Email address is not valid');
      this.data_validator[0] = false;
    }
    if(!this.userService.validatePassword(this.userLogin.password)) {
      alert('Password is not valid');
      this.data_validator[1] = false;
    }

    // If the email and password are valid, get the token
    // If the token is valid, navigate to the account page
    if (this.data_validator.every(Boolean)) {
      let token = this.userService.postToken(this.userLogin).subscribe({
        next: (token) => {
          if(token) {
            void this.router.navigate(['/account'], {state: {authToken: token}});
          }
          else {
            alert('Invalid email or password');
          }
        },
        error: (error) => {
          alert('Invalid email or password');
        }
      });
    }
  }
}


