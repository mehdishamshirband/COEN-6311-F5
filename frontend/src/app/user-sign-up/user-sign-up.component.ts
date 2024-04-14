import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { UserRegister } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-sign-up',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css'
})
export class UserSignUpComponent {

  userRegister: UserRegister = {
    first_Name: '',
    last_Name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  data_validator = [true, true, true];

  constructor(private userService: UserService,
              private router: Router) {}

  signUp() {
    this.data_validator = [true, true, true, true];

    if(!this.userService.noEmptyNames(this.userRegister.first_Name, this.userRegister.last_Name)) {
      alert('First name and last name cannot be empty');
      this.data_validator[0] = false;
    }

    if (!this.userService.validateEmail(this.userRegister.email)) {
      alert('Email address is not valid');
      this.data_validator[1] = false;
    }
    if (!this.userService.validatePassword(this.userRegister.password)) {
      alert('Password is not valid, it must contains at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number');
      this.data_validator[2] = false;
    }
    if (!this.userService.validatePasswordMatch(this.userRegister.password, this.userRegister.confirmPassword)) {
      alert('Passwords do not match');
      this.data_validator[3] = false;
    }

    // Check if all the fields are valid
    // Then create the user
    // Then get the token (nested subscribe)
    if(this.data_validator.every(Boolean)) {
      void this.userService.createUser(this.userRegister).subscribe({
        next: (result) => {
          if (result.email) {
            let userData = {email: this.userRegister.email, password: this.userRegister.password};
            this.userService.postToken(userData).subscribe({
              next: (token) => {
                if (token) {
                  void this.router.navigate(['/account'], {state: {authToken: token}});
                }
                else {
                  alert('Unknown error, please try again later');
                }
              },
              error: (err) => {alert('Error ' + err);},
            });
          }
        },
        error: (err) => {console.warn(err) ;alert('Error: ' + err.error.email[0]);},});
    }

  }
}
