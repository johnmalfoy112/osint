import { Component, OnInit } from '@angular/core';
import { ElibraryService } from '../service/elibrary.service';

@Component({
  selector: 'app-elibrary',
  templateUrl: './elibrary.component.html',
  styleUrls: ['./elibrary.component.css']
})
export class ElibraryComponent implements OnInit {

  constructor(private elibraryService: ElibraryService) { }

  ngOnInit(): void {
    this.fetchElibraryData();
  }

  elibraryData: any[] = [];
  searchTerm: string = '';

  // Search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

  //fetch data from mongo
  fetchElibraryData() {
    this.elibraryService.getElibraryData(this.searchTerm).subscribe(
      (data) => {
        this.elibraryData = data;
        console.log(data);
        // Handle data as needed
      },
      (error) => {
        console.error('Error fetching elibrary data:', error);
        // Handle error as needed
      }
    );
  }

  //get pdf url from local machine
  getPdfUrl(filename: string): string {
    return this.elibraryService.getPdfUrl(filename);
  }

  //get pdf cover photo from local machine
  getCoverImageUrl(coverFilename: string): string {
    return this.elibraryService.getCoverImageUrl(coverFilename);
  }

  //for search from the data
  search() {
    this.fetchElibraryData(); // Re-fetch data with the updated search term
  }

}
