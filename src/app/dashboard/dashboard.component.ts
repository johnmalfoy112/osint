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
  showTables: boolean = false;
  chartData: any[] = [];
  chartLabels: string[] = [];
  chartCountryLabels: string[] = [];
  chartCountryData: number[] = [];
  chartLanguageLabels: string[] = [];
  chartLanguageData: number[] = [];

  constructor(private newsService: NewsapiService) { }

  ngOnInit() {
    this.fetchNewsData();
  }

  //load more button data
  loadMoreButtonClicked(table: string) {
    if (table === 'source') {
      this.loadMoreSource = !this.loadMoreSource;
    } else if (table === 'country') {
      this.loadMoreCountry = !this.loadMoreCountry;
    } else if (table === 'language') {
      this.loadMoreLanguage = !this.loadMoreLanguage;
    }
  }

  //fetch data from mongo db
  private fetchNewsData() {
    this.newsService.getNews('', '').subscribe((data: any[]) => {
      this.newsData = data;
      this.countNewsBySource();
      this.countNewsByCountry();
      this.countNewsByLanguage();
      this.updateChartSourceData();
      this.updateChartCountryData();
      this.updateChartLanguageData();
    });
  }

  //sorce table data
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
    // Sort the data by descending order
    this.sourceLabels.sort((a, b) => this.newsCountBySource[b] - this.newsCountBySource[a]);
  }

  //chart data for newscountbysource
  private updateChartSourceData() {
    const sortedLabels = Object.keys(this.newsCountBySource).sort((a, b) => this.newsCountBySource[b] - this.newsCountBySource[a]);
    const topLabels = sortedLabels.slice(0, 15);
    this.chartLabels = topLabels;
    this.chartData = topLabels.map(label => this.newsCountBySource[label]);
    console.log('Chart Labels:', this.chartLabels);
    console.log('Chart Data:', this.chartData);
  }

  //country table data
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
    // Sort the data by descending order
    const sortedCountries = Object.keys(this.newsCountByCountry).sort((a, b) => this.newsCountByCountry[b].count - this.newsCountByCountry[a].count);
    sortedCountries.forEach((country) => {
      const countryData = this.newsCountByCountry[country];
      this.newsCountByCountry[country] = countryData;
    });
  }

  //chart data for newscountbycountry
  private updateChartCountryData() {
    const sortedCountries = Object.keys(this.newsCountByCountry).sort((a, b) => this.newsCountByCountry[b].count - this.newsCountByCountry[a].count);
    const topCountries = sortedCountries.slice(0, 15);
    this.chartCountryLabels = topCountries;
    this.chartCountryData = topCountries.map(country => this.newsCountByCountry[country].count);
    console.log('Chart Country Labels:', this.chartCountryLabels);
    console.log('Chart Country Data:', this.chartCountryData);
  }

  //language table data
  private countNewsByLanguage() {
    this.newsCountByLanguage = this.countOccurrences(this.newsData, 'language');
    this.isLanguageDataLoaded = true;
    // Sort the data by descending order
    const sortedLanguages = Object.keys(this.newsCountByLanguage).sort((a, b) => this.newsCountByLanguage[b] - this.newsCountByLanguage[a]);
    sortedLanguages.forEach((language) => {
      const languageData = this.newsCountByLanguage[language];
      this.newsCountByLanguage[language] = languageData;
    });
  }
  private countOccurrences(data: any[], key: string): any {
    const counts: any = {};
    data.forEach(item => {
      const value = item[key];
      counts[value] = counts[value] ? counts[value] + 1 : 1;
    });
    return counts;
  }

  //chart data for newscountbylanguage
  private updateChartLanguageData() {
    const sortedLanguages = Object.keys(this.newsCountByLanguage).sort((a, b) => this.newsCountByLanguage[b] - this.newsCountByLanguage[a]);
    const topLanguages = sortedLanguages.slice(0, 15);
    this.chartLanguageLabels = topLanguages;
    this.chartLanguageData = topLanguages.map(language => this.newsCountByLanguage[language]);
    console.log('Chart Language Labels:', this.chartLanguageLabels);
    console.log('Chart Language Data:', this.chartLanguageData);
  }


}
