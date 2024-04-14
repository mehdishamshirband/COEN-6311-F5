import {Component, OnInit} from '@angular/core';
import {NavBarComponent} from "../navbar/navbar.component";
import {User} from "../interfaces/user.interface";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {CommonModule, DatePipe} from "@angular/common";
import {UserService} from "../services/user.service";

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
    email: '',
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

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.getUserSample();
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

  confirmAccountDeletion(event: Event) {
   event.stopPropagation();
    if (confirm('Are you sure you want to delete your account? This operation is irreversible!')) {
      this.deleteAccount();
    }
  }
  deleteAccount() {
    //TODO: backend to delete account
  }
}
