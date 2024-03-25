import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { login } from '../interfaces/booking.interface';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  email!: string;
  password!: string;

  Login(data: login) {
    console.warn(data);
  }
}


