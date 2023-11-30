import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ElibraryService {

  private apiUrl = 'http://localhost:3000/api/elibrary'; // Update with your server URL

  constructor(private http: HttpClient) { }

  //fetch data from mongo db
  getElibraryData(searchTerm: string, folderName: string): Observable<any> {
    const params = new HttpParams()
      .set('q', searchTerm)
      .set('limit', '50') // Add this line to set the limit
      .set('folderName', folderName); // Add folderName parameter
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching elibrary data:', error);
        return throwError('Error fetching elibrary data. Please try again later.');
      })
    );
  }

  //get cover image from local machine
  getCoverImageUrl(coverFilename: string): string {
    return `../../assets/${coverFilename}`;
  }

  //get pdf url from local machine
  getPdfUrl(filename: string): string {
    return `../../assets/${filename}`;
  }

}
