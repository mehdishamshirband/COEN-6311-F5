import { Component } from '@angular/core';
import { ScrollToTopService } from './services/scroll-to-top.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private scrollToTopService: ScrollToTopService) {
  }
  title = 'Concordia Travel';
}
