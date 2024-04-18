import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  constructor(private router: Router,
              private http: HttpClient) {}
  url_backend!: string;
  Notifs!: any[];
  protected readonly sessionStorage = sessionStorage;
  user_id!: number;
  want_send_message : boolean = false;
  base_url = 'http://127.0.0.1:8000'

  header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':  'Bearer ' + sessionStorage.getItem('accessToken'),
  });

  send_message = {
    message : '',
    recipient : 0,
    sender : 0,
  }

  // Example of users, as we can't retrieve them from the backend
  Users = [
    {
      id : 1,
      name : 'Admin'
    },
    {
      id : 2,
      name : 'System Info'
    },
    {
      id : 3,
      name : 'Test User'
    },
    {
      id : 4,
      name : 'Miaou'
    },
    {
      id : 5,
      name : 'Ben'
    },
  ]


  ngOnInit() {
    this.url_backend = this.base_url + this.router.url.replaceAll('notification', 'Notifs') + '/';
    this.getNotifs();
    this.user_id = Number(this.url_backend.split('/')[4]);
  }


  // Function to retrieve the notification from the backend
  getNotifs() {
    fetch(this.url_backend)
    .then(response => response.json())
    .then(data => {
      this.Notifs = data.reverse(); // Reverse the array to show the last notification first
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  // Function to show only day and hour of the notification
  showDate(date: string) {
    return date.split('T')[0] + " " + date.split('T')[1].split('.')[0];
  }

  changeFeature() {
    this.want_send_message = !this.want_send_message;
    if (!this.want_send_message) {
      this.getNotifs();
    }
  }

  sendMessage() {
    this.send_message.sender = this.user_id;

    this.http.post(this.base_url + '/Notifs/', this.send_message, {headers: this.header}).subscribe({
      next: (response: any) => {
        alert(response.msg)
        this.send_message = {
          message : '',
          recipient : 0,
          sender : 0,
        }
      },
      error: (error) => {
        alert("Error :" + error.msg);
      }
    });
  }
}
