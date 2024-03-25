import {Component, OnInit} from '@angular/core';
import {NavBarComponent} from "../navbar/navbar.component";
import {User} from "../interfaces/user.interface";
import { FormsModule } from "@angular/forms";
import {CommonModule, DatePipe} from "@angular/common";

@Component({
  selector: 'app-user-account-information',
  standalone: true,
  imports: [
    NavBarComponent,
    FormsModule,
    CommonModule,
    DatePipe
  ],
  templateUrl: './user-account-information.component.html',
  styleUrl: './user-account-information.component.css'
})

export class UserAccountInformationComponent implements OnInit {
  user: User = {
    id: 0,
    emailAddress: 'benjamin.vauchel.51@gmail.com', //TODO: delete
    firstName: '',
    lastName: '',
    birthDate: new Date(0),
    phone: '',
    country: '',
    province: '',
    city: '',
    zipcode: ''
  };

    editMode = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveChanges(): void {
    console.log('User information saved', this.user);
    this.editMode = false;
  }

  checkIfEmpty(inputElement: HTMLInputElement) {
    if (inputElement.value) {
      inputElement.classList.add('has-value');
    } else {
      inputElement.classList.remove('has-value');
    }
  }
}
