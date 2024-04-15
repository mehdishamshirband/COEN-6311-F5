import {Component, OnInit} from '@angular/core';
import {NavBarComponent} from "../navbar/navbar.component";
import {User} from "../interfaces/user.interface";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {CommonModule, DatePipe} from "@angular/common";
import {UserService} from "../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {RouterModule} from "@angular/router";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-account-information',
  standalone: true,
  imports: [
    NavBarComponent,
    FormsModule,
    CommonModule,
    DatePipe,
    RouterModule
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
    zipcode: '',
    firstLineAddress: '',
    secondLineAddress: ''
  };

  editMode = false;

  constructor(private fb: FormBuilder, private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {

    if (history.state.authToken === undefined && sessionStorage.getItem('accessToken') === null) {
      void this.router.navigate(['/login']);
    }

    // Store the token in the session storage
    sessionStorage.setItem('accessToken', history.state.authToken['access']);
    sessionStorage.setItem('refreshToken', history.state.authToken['refresh']);
    let authToken:any = sessionStorage.getItem('accessToken')!;

    if (authToken === null) {
      console.error('No access token found in the session storage');
    }

    if (history.state.checkout) {
      void this.router.navigate(['/checkout']);
    }


    // Fetch the user information
    this.userService.getUserInfo(authToken).subscribe({
      next: (user: User) => {
        console.warn('User information fetched', user)
        this.user = user;
      },
    error: (error) => {
      console.log('Error fetching user information', error);
    }
    });
    //this.user = this.userService.getUserSample();
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


  logOut() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    void this.router.navigate(['/']);
  }

  requestAlreadySent = false;
  isAgent = false;

  requestAgent() {
    alert('Request sent, our team will process your request shortly, thank you!')
    this.requestAlreadySent = true;
    //TODO: backend to request agent status
  }

  deleteAccount() {
    //TODO: backend to delete account
  }

}
