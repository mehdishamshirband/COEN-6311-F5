import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { signUp } from '../interfaces/booking.interface';

@Component({
  selector: 'app-user-sign-up',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css'
})
export class UserSignUpComponent {
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  confirmPassword!: string;

  signUp(data: signUp) {
    console.warn(data);
  }
}
