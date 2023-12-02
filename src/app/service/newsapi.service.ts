import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NewsapiService {

  constructor(private _http: HttpClient) { }

  //News Api URL's & Keys
  private apiUrl = 'https://newsdata.io/api/1/news'; //live-search api url
  private apiKey ='pub_297136fd8848307062cd9e1e40716b38e5a94'; // Live search API key   // 'pub_31327dffa10e6d981c22b766f47ad9b7189df','pub_297136fd8848307062cd9e1e40716b38e5a94', pub_27769500773408e29dd09933adbd80b77ff09
  private incidenturl = 'https://newsapi.org/v2/everything';  // incident report api url
  private apikey = '548c78746d234b3d95b0eb26278421c2';  // incident report api key
  private serverUrl = 'http://localhost:3000/api/news';  //mongo db api url don't change this


  //live-search api
  topheadlines(query: string, countrycode?: string, languagecode?: string,): Observable<any> {
    let params = new HttpParams().set('apikey', this.apiKey).set('image', 1).set('q', query);
    if (countrycode) {
      params = params.set('country', countrycode);
    }
    if (languagecode) {
      params = params.set('language', languagecode);
    }
    return this._http.get<any>(this.apiUrl, { params });
  }

  //livesearch nextpage
  nextpage(query: string, nextpagetoken: string): Observable<any> {
    let params = new HttpParams().set('apikey', this.apiKey).set('image', 1).set('q', query);
    if (nextpagetoken) {
      params = params.set('page', nextpagetoken);
    }
    return this._http.get<any>(this.apiUrl, { params });
  }

  //incident-report api
  // incidentews(query: string, languagecode?: string ): Observable<any> {
  //   let params = new HttpParams().set('apikey', this.apikey).set('q', query);
  //   if (languagecode) {
  //     params = params.set('language', languagecode);
  //   }
  //     return this._http.get<any>(this.incidenturl , { params });
  // }

  //Incident-report api offline
  getNews(query: string, language: string): Observable<any[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
      // console.log(query);
    }
    if (language) {
      params = params.set('language', language);
      // console.log(language);
    }
    return this._http.get<any[]>(this.serverUrl, { params });
  }

  getNewsByKeywords(keywords: string[]): Observable<any> {
    const keywordsString = keywords.join(',');
    const url = `${this.serverUrl}/news/${keywordsString}`;
    return this._http.get(url);
  }

  getAllNewsFromMongo(): Observable<any[]> {
    return this._http.get<any[]>(this.serverUrl).pipe(
      tap(_ => console.log('Fetching all news from MongoDB')),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }


// mongodb api
saveToMongoDB(newsData: any, searchQuery: string): Observable<any> {
  newsData.country = newsData.country[0];
  newsData.searchQuery = searchQuery; // Add the searchQuery field
  return this._http.post(this.serverUrl, newsData);
}

}