import { Component } from '@angular/core';
import { GoogleSearchService } from '../service/google.service';

@Component({
  selector: 'app-google-search',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})
export class GoogleSearchComponent {

  constructor(private searchService: GoogleSearchService) { }

  query: string;
  results: any[];
  results1: any[];
  startIndex = 1;
  searchType: string = 'query'; // Set default to 'query'
  currentPage = 1; // Initialize to 1, assuming we start with the first page
  resultsPerPage = 10; // Adjust this according to your needs, e.g., 10 results per page
  totalResults: number = 1000;

  //pagination for the search query
  get totalPages(): number {
    return Math.ceil(this.totalResults / this.resultsPerPage);
  }
  get pages(): number[] {
    const startPage = Math.max(1, this.currentPage - 8);
    const endPage = Math.min(this.totalPages, startPage + 9);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.search();
    }
  }

  handleImageError(event: any) {
    event.target.src = '../../../assets/nope-not-here.jpg';
  }
  

  // Search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

   //reset search placeholder
   setSearchType(type: "query" | "image") {
    this.searchType = type;
    this.query = ''; // Reset searchQuery
    this.results = []; // Clear query results
    this.results1 = []; // Clear image results
  }

  //search query and image api
  search() {
    if (this.searchType === 'query') {
      // Call your search query function
      const startIndex = (this.currentPage - 1) * this.resultsPerPage;
      this.searchService.search(this.query, startIndex, this.resultsPerPage).subscribe(
        data => {
          this.results = data.items;
        },
        error => {
          console.error(error);
        }
      );
    } else if (this.searchType === 'image') {
      // Call your search images function
      this.searchService.searchImages(this.query, this.startIndex).subscribe(
        data => {
          this.results1 = data.items;
          console.log(this.results1);
          console.log(data);
        },
        error => {
          console.error(error);
        }
      );
    }
  }

//loadmore api
  loadMore() {
    const startIndex = (this.currentPage - 1) * this.resultsPerPage;
      this.searchService.searchImages(this.query, startIndex).subscribe(
        data => {
          this.results1 = this.results1.concat(data.items);
          this.currentPage++;
          console.log(this.results1);
          console.log(data);
        },
        error => {
          console.error(error);
        }
      );
  }


}
