import { Component, OnInit } from '@angular/core';
import { NewsapiService } from '../service/newsapi.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  newsCountBySource: number[] = [];
  sourceLabels: string[] = [];

  constructor(private newsService: NewsapiService) {}

  ngOnInit() {
  }

 
}
