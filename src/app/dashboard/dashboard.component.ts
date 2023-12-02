import { Component, OnInit } from '@angular/core';
import { NewsapiService } from '../service/newsapi.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  newsData: any[] = [];
  newsCountBySource: { [key: string]: number } = {};
  newsCountByCountry: { [key: string]: { count: number; sources: string[]; languages: string[] } } = {};
  newsCountByLanguage: { [key: string]: number } = {};
  sourceLabels: string[] = [];
  loadMoreSource: boolean = false;
  loadMoreCountry: boolean = false;
  loadMoreLanguage: boolean = false;
  isCountryDataLoaded: boolean = false;
  isSourceDataLoaded: boolean = false;
  isLanguageDataLoaded: boolean = false;
  showTables: boolean = false; // Add this line

  constructor(private newsService: NewsapiService) {}

  ngOnInit() {
    this.fetchNewsData();
  }

  loadMoreButtonClicked(table: string) {
    if (table === 'source') {
      this.loadMoreSource = !this.loadMoreSource;
    } else if (table === 'country') {
      this.loadMoreCountry = !this.loadMoreCountry;
    } else if (table === 'language') {
      this.loadMoreLanguage = !this.loadMoreLanguage;
    }
  }

  private fetchNewsData() {
    this.newsService.getNews('', '').subscribe((data: any[]) => {
      this.newsData = data;
      this.countNewsBySource();
      this.countNewsByCountry();
      this.countNewsByLanguage();
    });
  }

  private countNewsBySource() {
    this.newsData.forEach((news) => {
      const sourceId = news.source_id;
      if (!this.newsCountBySource[sourceId]) {
        this.newsCountBySource[sourceId] = 1;
        this.sourceLabels.push(sourceId);
      } else {
        this.newsCountBySource[sourceId]++;
      }
      this.isSourceDataLoaded = true;
    });
  }

  private countNewsByCountry() {
    this.newsData.forEach((news) => {
      const country = news.country;
      if (!this.newsCountByCountry[country]) {
        this.newsCountByCountry[country] = { count: 1, sources: [news.source_id], languages: [news.language] };
      } else {
        this.newsCountByCountry[country].count++;
        if (!this.newsCountByCountry[country].sources.includes(news.source_id)) {
          this.newsCountByCountry[country].sources.push(news.source_id);
        }
        if (!this.newsCountByCountry[country].languages.includes(news.language)) {
          this.newsCountByCountry[country].languages.push(news.language);
        }
      }
      this.isCountryDataLoaded = true;
    });
  }

  private countNewsByLanguage() {
    this.newsCountByLanguage = this.countOccurrences(this.newsData, 'language');
    this.isLanguageDataLoaded = true;
  }

  private countOccurrences(data: any[], key: string): any {
    const counts: any = {};
    data.forEach(item => {
      const value = item[key];
      counts[value] = counts[value] ? counts[value] + 1 : 1;
    });
    return counts;
  }
}
