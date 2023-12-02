import { Component, OnInit } from '@angular/core';
import { NewsapiService } from '../../service/newsapi.service'
import { MatDialog } from '@angular/material/dialog';
import { IncidentReportDialogComponent } from '../../incident-report-dialog/incident-report-dialog.component';
import { saveAs } from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as JSZip from 'jszip';

@Component({
  selector: 'app-incidetreport',
  templateUrl: './incidetreport.component.html',
  styleUrls: ['./incidetreport.component.css']
})
export class IncidetreportComponent implements OnInit {

  constructor(private api: NewsapiService, public dialog: MatDialog) { }

  newsData: any;
  selectedLanguage: string;
  incidentData: any = [];
  searchTerm: string = '';
  languages: string[] = [];
  selectedArticles: any[] = [];
  showNoDataMessage: boolean = false;
  selectedKeywords: { keyword: string; group: string }[] = [];  // Modified this line

  // search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }
  isArticleSelected(article: any) {
    return this.selectedArticles.includes(article);
  }

  //export news as text in zip
  exportNewsAsText(article: any) {
    const exportData = `Title: ${article.title}\n\nContent: ${article.content}\n\n\n`;
    const blob = new Blob([exportData], { type: 'text/plain;charset=utf-8' });
    return new Promise<void>((resolve, reject) => {
      saveAs(blob, `${article.title}.txt`);
      resolve();
    });
  }
  exportAllNewsAsText(searchQuery: string) {
    const zip = new JSZip();
    const promises = [];
    for (const article of this.newsData) {
      const promise = this.exportNewsAsText(article)
        .then(() => {
          const exportData = `Title: ${article.title}\n\nContent: ${article.content}\n\n\n`;
          zip.file(`${article.title}.txt`, exportData);
        });
      promises.push(promise);
    }
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `News_${searchQuery}_${new Date().toISOString()}.zip`);
      });
    });
  }

  //export news as pdf in zip
  exportNewsAsPdf(article: any) {
    const documentDefinition = {
      content: [
        { text: `Title: ${article.title}`, fontSize: 16, bold: true },
        { text: `Content: ${article.content}` }
      ]
    };
    return new Promise<void>((resolve, reject) => {
      pdfMake.createPdf(documentDefinition).getBlob((blob) => {
        saveAs(blob, `${article.title}.pdf`);
        resolve();
      });
    });
  }
  exportAllNewsAsPdf(searchQuery: string) {
    const zip = new JSZip();
    const promises = [];
    for (const article of this.newsData) {
      const promise = new Promise<void>((resolve) => {
        const documentDefinition = {
          content: [
            { text: `Title: ${article.title}`, fontSize: 16, bold: true },
            { text: `Content: ${article.content}` }
          ]
        };
        pdfMake.createPdf(documentDefinition).getBlob((blob) => {
          zip.file(`${article.title}.pdf`, blob);
          resolve();
        });
      });
      promises.push(promise);
    }
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `News_${searchQuery}_${new Date().toISOString()}.zip`);
      });
    });
  }

  // Function to add or remove an article from the selected list
  toggleSelectedArticle(article: any) {
    const index = this.newsData.findIndex((item: any) => item === article);
    if (index !== -1) {
      this.newsData.splice(index, 1);
    }
  }

  // Extract language
  extractDistinctLanguagesAndCountries() {
    const uniqueLanguages = new Set<string>();
    for (const article of this.incidentData) {
      if (article.language) {
        uniqueLanguages.add(article.language);
      }
    }
    this.languages = Array.from(uniqueLanguages);
  }

  // Show search query
  getValue(val: string) {
    this.searchTerm = val;
  }

  ngOnInit(): void { }

  //incident search online api
  // searchNews(query: string, selectedLanguage: string) {
  //   this.api.incidentews(query, selectedLanguage).subscribe(data => {
  //     this.newsData = data.articles;
  //     console.log("News Data:", data);
  //     // console.log(this.newsData);
  // console.log(data.articles[0].title);
  // console.log(this.articles);
  //save to mongodb api
  //     for (const article of this.newsData) {
  //       this.api.saveToMongoDB(article).subscribe({
  //         next: response => {
  //           console.log('Data saved to MongoDB:', response);
  //         },
  //         error: error => {
  //           // console.error('Error saving data to MongoDB:', error);
  //         }
  //       });
  //     }

  //   });
  // }

  //Incident news offline api
  searchNews() {
    this.api.getNews(this.searchTerm, this.selectedLanguage).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.newsData = data;
          this.incidentData = data;
          this.extractDistinctLanguagesAndCountries();
        } else {
          this.newsData = [];
          // this.showNoDataMessage = true; // You can uncomment this if needed
        }
      },
      (error) => {
        console.error('Error fetching news data:', error);
        // Handle the error if needed
      }
    );
  }

  // Modify the language method
  language(optionlang: string) {
    this.selectedLanguage = optionlang;
    this.fetchNewsByKeywords(); // Modified this line
  }

  // Add a method to search news by keywords
  searchNewsByKeywords(keywords: string[]) {
    this.api.getNewsByKeywords(keywords).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.newsData = data;
          this.incidentData = data;
          this.extractDistinctLanguagesAndCountries();
        } else {
          this.newsData = [];
          // Handle the case when no data is found
        }
      },
      (error) => {
        console.error('Error fetching news data by keywords:', error);
        // Handle the error if needed
      }
    );
  }

  // Fetch news based on selected keywords
  fetchNewsByKeywords() {
    const keywords = this.selectedKeywords.map(keyword => keyword.keyword);
    this.api.getNews(keywords.join(','), this.selectedLanguage).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.newsData = data;
          this.incidentData = data;
          this.extractDistinctLanguagesAndCountries();
        } else {
          this.newsData = [];
        }
      },
      (error) => {
        console.error('Error fetching news data:', error);
      }
    );
  }

  // Function to add or remove a keyword from the selected list
  toggleSelectedKeyword(keywordObj: { keyword: string; group: string }) {
    const index = this.selectedKeywords.findIndex(k => k.keyword === keywordObj.keyword && k.group === keywordObj.group);
    if (index !== -1) {
      this.selectedKeywords.splice(index, 1);
    } else {
      this.selectedKeywords.push(keywordObj);
    }
  }

  // Method to open the keyword dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(IncidentReportDialogComponent, {
      width: '1000px',
    });
    // Handle the dialog closed event
    dialogRef.afterClosed().subscribe((selectedKeywords: { keyword: string; group: string }[]) => {
      // Check if selectedKeywords is not undefined
      if (selectedKeywords) {
        // Update the selectedKeywords in the component
        this.selectedKeywords = selectedKeywords;
        // Perform the news search with the selected keywords
        this.searchNews();
      }
    });
  }

}
