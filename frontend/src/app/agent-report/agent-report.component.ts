import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-agent-report',
  standalone: true,
  imports: [],
  templateUrl: './agent-report.component.html',
  styleUrl: './agent-report.component.css'
})
export class AgentReportComponent {
  report_data: any;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.retrieveAgentReport();
  }

  retrieveAgentReport() {
    void this.http.get('http://127.0.0.1:8000/Report/').subscribe((data) => {
      this.report_data = data;
    });
  }
}
