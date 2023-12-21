import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GoogleTrendsSearchService {

    constructor(private http: HttpClient) { }


    private apiUrl = 'http://localhost:3001/google-trends-search';

    getGoogleTrendsData(query: string, dataTypes: string[]): Observable<any> {
        const params = new HttpParams().set('q', query).set('data_types', dataTypes.join(','));

        return this.http.get<any>(this.apiUrl, { params });
    }

}
