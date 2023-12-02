import { Component } from '@angular/core';
import { NewsapiService } from '../../service/newsapi.service';
import { saveAs } from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import * as Sentiment from 'sentiment';
import { TranslationService } from '../../service/translation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liveseach',
  templateUrl: './liveseach.component.html',
  styleUrls: ['./liveseach.component.css']
})

export class LiveseachComponent {

  constructor(private api: NewsapiService, private translationService: TranslationService) { }

  //advnace search menu online
  countries: { name: string, code: string }[] = [
    { name: 'All', code: '' },
    { name: 'Afghanistan', code: 'af' },
    { name: 'Albania', code: 'al' },
    { name: 'Algeria', code: 'dz' },
    { name: 'Angola', code: 'ao' },
    { name: 'Argentina', code: 'ar' },
    { name: 'Australia', code: 'au' },
    { name: 'Austria', code: 'at' },
    { name: 'Azerbaijan', code: 'az' },
    { name: 'Bahrain', code: 'bh' },
    { name: 'Bangladesh', code: 'bd' },
    { name: 'Barbados', code: 'bb' },
    { name: 'Belarus', code: 'by' },
    { name: 'Belgium', code: 'be' },
    { name: 'Bermuda', code: 'bm' },
    { name: 'Bhutan', code: 'bt' },
    { name: 'Bolivia', code: 'bo' },
    { name: 'Bosnia And Herzegovina', code: 'ba' },
    { name: 'Brazil', code: 'br' },
    { name: 'Brunei', code: 'bn' },
    { name: 'Bulgaria', code: 'bg' },
    { name: 'Burkina Faso', code: 'bf' },
    { name: 'Cambodia', code: 'kh' },
    { name: 'Cameroon', code: 'cm' },
    { name: 'Canada', code: 'ca' },
    { name: 'Cape Verde', code: 'cv' },
    { name: 'Cayman Islands', code: 'ky' },
    { name: 'Chile', code: 'cl' },
    { name: 'China', code: 'cn' },
    { name: 'Colombia', code: 'co' },
    { name: 'Comoros', code: 'km' },
    { name: 'Costa Rica', code: 'cr' },
    { name: 'Côte d\'Ivoire', code: 'ci' },
    { name: 'Croatia', code: 'hr' },
    { name: 'Cuba', code: 'cu' },
    { name: 'Cyprus', code: 'cy' },
    { name: 'Czech Republic', code: 'cz' },
    { name: 'Denmark', code: 'dk' },
    { name: 'Djibouti', code: 'dj' },
    { name: 'Dominica', code: 'dm' },
    { name: 'Dominican Republic', code: 'do' },
    { name: 'DR Congo', code: 'cd' },
    { name: 'Ecuador', code: 'ec' },
    { name: 'Egypt', code: 'eg' },
    { name: 'El Salvador', code: 'sv' },
    { name: 'Estonia', code: 'ee' },
    { name: 'Ethiopia', code: 'et' },
    { name: 'Fiji', code: 'fj' },
    { name: 'Finland', code: 'fi' },
    { name: 'France', code: 'fr' },
    { name: 'French Polynesia', code: 'pf' },
    { name: 'Gabon', code: 'ga' },
    { name: 'Georgia', code: 'ge' },
    { name: 'Germany', code: 'de' },
    { name: 'Ghana', code: 'gh' },
    { name: 'Greece', code: 'gr' },
    { name: 'Guatemala', code: 'gt' },
    { name: 'Guinea', code: 'gn' },
    { name: 'Haiti', code: 'ht' },
    { name: 'Honduras', code: 'hn' },
    { name: 'Hong Kong', code: 'hk' },
    { name: 'Hungary', code: 'hu' },
    { name: 'Iceland', code: 'is' },
    { name: 'India', code: 'in' },
    { name: 'Indonesia', code: 'id' },
    { name: 'Iraq', code: 'iq' },
    { name: 'Ireland', code: 'ie' },
    { name: 'Israel', code: 'il' },
    { name: 'Italy', code: 'it' },
    { name: 'Jamaica', code: 'jm' },
    { name: 'Japan', code: 'jp' },
    { name: 'Jordan', code: 'jo' },
    { name: 'Kazakhstan', code: 'kz' },
    { name: 'Kenya', code: 'ke' },
    { name: 'Kuwait', code: 'kw' },
    { name: 'Kyrgyzstan', code: 'kg' },
    { name: 'Latvia', code: 'lv' },
    { name: 'Lebanon', code: 'lb' },
    { name: 'Libya', code: 'ly' },
    { name: 'Lithuania', code: 'lt' },
    { name: 'Luxembourg', code: 'lu' },
    { name: 'Macau', code: 'mo' },
    { name: 'Macedonia', code: 'mk' },
    { name: 'Madagascar', code: 'mg' },
    { name: 'Malawi', code: 'mw' },
    { name: 'Malaysia', code: 'my' },
    { name: 'Maldives', code: 'mv' },
    { name: 'Mali', code: 'ml' },
    { name: 'Malta', code: 'mt' },
    { name: 'Mauritania', code: 'mr' },
    { name: 'Mexico', code: 'mx' },
    { name: 'Moldova', code: 'md' },
    { name: 'Mongolia', code: 'mn' },
    { name: 'Montenegro', code: 'me' },
    { name: 'Morocco', code: 'ma' },
    { name: 'Mozambique', code: 'mz' },
    { name: 'Myanmar', code: 'mm' },
    { name: 'Namibia', code: 'na' },
    { name: 'Nepal', code: 'np' },
    { name: 'Netherlands', code: 'nl' },
    { name: 'New Zealand', code: 'nz' },
    { name: 'Niger', code: 'ne' },
    { name: 'Nigeria', code: 'ng' },
    { name: 'North Korea', code: 'kp' },
    { name: 'Norway', code: 'no' },
    { name: 'Oman', code: 'om' },
    { name: 'Pakistan', code: 'pk' },
    { name: 'Panama', code: 'pa' },
    { name: 'Paraguay', code: 'py' },
    { name: 'Peru', code: 'pe' },
    { name: 'Philippines', code: 'ph' },
    { name: 'Poland', code: 'pl' },
    { name: 'Portugal', code: 'pt' },
    { name: 'Puerto Rico', code: 'pr' },
    { name: 'Romania', code: 'ro' },
    { name: 'Russia', code: 'ru' },
    { name: 'Rwanda', code: 'rw' },
    { name: 'Samoa', code: 'ws' },
    { name: 'San Marino', code: 'sm' },
    { name: 'Saudi Arabia', code: 'sa' },
    { name: 'Senegal', code: 'sn' },
    { name: 'Serbia', code: 'rs' },
    { name: 'Singapore', code: 'sg' },
    { name: 'Slovakia', code: 'sk' },
    { name: 'Slovenia', code: 'si' },
    { name: 'Solomon Islands', code: 'sb' },
    { name: 'Somalia', code: 'so' },
    { name: 'South Africa', code: 'za' },
    { name: 'South Korea', code: 'kr' },
    { name: 'Spain', code: 'es' },
    { name: 'Sri Lanka', code: 'lk' },
    { name: 'Sudan', code: 'sd' },
    { name: 'Sweden', code: 'se' },
    { name: 'Switzerland', code: 'ch' },
    { name: 'Syria', code: 'sy' },
    { name: 'Taiwan', code: 'tw' },
    { name: 'Tajikistan', code: 'tj' },
    { name: 'Tanzania', code: 'tz' },
    { name: 'Thailand', code: 'th' },
    { name: 'Tonga', code: 'to' },
    { name: 'Tunisia', code: 'tn' },
    { name: 'Turkey', code: 'tr' },
    { name: 'Turkmenistan', code: 'tm' },
    { name: 'Uganda', code: 'ug' },
    { name: 'Ukraine', code: 'ua' },
    { name: 'United Arab Emirates', code: 'ae' },
    { name: 'United Kingdom', code: 'gb' },
    { name: 'United States of America', code: 'us' },
    { name: 'Uruguay', code: 'uy' },
    { name: 'Uzbekistan', code: 'uz' },
    { name: 'Venezuela', code: 've' },
    { name: 'Vietnam', code: 'vi' },
    { name: 'Yemen', code: 'ye' },
    { name: 'Zambia', code: 'zm' },
    { name: 'Zimbabwe', code: 'zw' }

  ];

  languages: { name: string, code: string }[] = [
    { name: 'All', code: '' },
    { name: 'Afrikaans', code: 'af' },
    { name: 'Albanian', code: 'sq' },
    { name: 'Amharic', code: 'am' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Armenian', code: 'hy' },
    { name: 'Assamese', code: 'as' },
    { name: 'Azerbaijani', code: 'az' },
    { name: 'Basque', code: 'eu' },
    { name: 'Belarusian', code: 'be' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Bosnian', code: 'bs' },
    { name: 'Bulgarian', code: 'bg' },
    { name: 'Burmese', code: 'my' },
    { name: 'Catalan', code: 'ca' },
    { name: 'Central Kurdish', code: 'ckb' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Croatian', code: 'hr' },
    { name: 'Czech', code: 'cs' },
    { name: 'Danish', code: 'da' },
    { name: 'Dutch', code: 'nl' },
    { name: 'English', code: 'en' },
    { name: 'Estonian', code: 'et' },
    { name: 'Filipino', code: 'pi' },
    { name: 'Finnish', code: 'fi' },
    { name: 'French', code: 'fr' },
    { name: 'Georgian', code: 'ka' },
    { name: 'German', code: 'de' },
    { name: 'Greek', code: 'el' },
    { name: 'Gujarati', code: 'gu' },
    { name: 'Hebrew', code: 'he' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Hungarian', code: 'hu' },
    { name: 'Icelandic', code: 'is' },
    { name: 'Indonesian', code: 'id' },
    { name: 'Italian', code: 'it' },
    { name: 'Japanese', code: 'jp' },
    { name: 'Kannada', code: 'kn' },
    { name: 'Khmer', code: 'kh' },
    { name: 'Kinyarwanda', code: 'rw' },
    { name: 'Korean', code: 'ko' },
    { name: 'Latvian', code: 'lv' },
    { name: 'Lithuanian', code: 'lt' },
    { name: 'Luxembourgish', code: 'lb' },
    { name: 'Macedonian', code: 'mk' },
    { name: 'Malay', code: 'ms' },
    { name: 'Malayalam', code: 'ml' },
    { name: 'Maltese', code: 'mt' },
    { name: 'Maori', code: 'mi' },
    { name: 'Marathi', code: 'mr' },
    { name: 'Mongolian', code: 'mn' },
    { name: 'Nepali', code: 'ne' },
    { name: 'Norwegian', code: 'no' },
    { name: 'Oriya', code: 'or' },
    { name: 'Pashto', code: 'ps' },
    { name: 'Persian', code: 'fa' },
    { name: 'Polish', code: 'pl' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Punjabi', code: 'pa' },
    { name: 'Romanian', code: 'ro' },
    { name: 'Russian', code: 'ru' },
    { name: 'Samoan', code: 'sm' },
    { name: 'Serbian', code: 'sr' },
    { name: 'Shona', code: 'sn' },
    { name: 'Sinhala', code: 'si' },
    { name: 'Slovak', code: 'sk' },
    { name: 'Slovenian', code: 'sl' },
    { name: 'Somali', code: 'so' },
    { name: 'Spanish', code: 'es' },
    { name: 'Swahili', code: 'sw' },
    { name: 'Swedish', code: 'sv' },
    { name: 'Tajik', code: 'tg' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Telugu', code: 'te' },
    { name: 'Thai', code: 'th' },
    { name: 'Turkish', code: 'tr' },
    { name: 'Turkmen', code: 'tk' },
    { name: 'Ukrainian', code: 'uk' },
    { name: 'Urdu', code: 'ur' },
    { name: 'Uzbek', code: 'uz' },
    { name: 'Vietnamese', code: 'vi' },
    { name: 'Welsh', code: 'cy' }
  ];

  articles: any[] = [];  //news articles data
  searcht: string;   //search query
  newsData: any;   //news data
  selectedLanguage: any; languageCode: string;   //language code
  selectedcountry: any; countryCode: string;   //country code
  nextPageToken: any;    //nextpagetoken
  countries1: { name: string }[] = [];  //offline countries menu
  languages1: { name: string }[] = [];   //offline language menu
  selectedCountryFilter: string = 'All';   //offline countries code
  selectedLanguageFilter: string = 'All'; //offline language code
  selectedArticles: any[] = [];
  allArticles: any[] = [];
  [x: string]: any;
  nextpageValue: any;
  sentiment = new Sentiment();
  selectedSentimentFilter: string = 'All'; // Add this line



  handleRemove(index: number) {
    // Implement your remove logic here
  }
  handleLoadMoreData() {
    throw new Error('Method not implemented.');
  }

  //placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
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
    for (const article of this.articles) {
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
  // exportAllNewsAsPdf(searchQuery: string) {
  //   const doc = new jsPDF();
  //   let yOffset = 10;
  //   for (const article of this.articles) {
  //     const title = `Title: ${article.title.slice(0, 100)}`; // Limit title to 60 characters
  //     const content = `Content: ${article.content.slice(0, 300)}`; // Limit content to 200 characters
  //     const text = `${title}\n${content}\n\n`;
  //     const splitTitle = doc.splitTextToSize(text, 180); // Set the width of the text box (180 units)
  //     doc.text(splitTitle, 10, yOffset, { align: 'left' });
  //     yOffset += splitTitle.length * 5; // Adjust the yOffset based on the number of lines
  //   }
  //   // Save the PDF
  //   doc.save(`News_${searchQuery}_${new Date().toISOString()}.pdf`);
  // }

  //export news as one pdf
  exportAllNewsAsPdf(searchQuery: string) {
    const doc = new jsPDF();
    const yOffset = 8; // Space from top and bottom
    const boxHeight = 80; // Height of each news box
    const spaceBetweenBoxes = 10; // Space between news boxes
    const padding = 5; // Padding inside the box
    let currentPage = 1;
    let yOffsetOnPage = yOffset;
    for (let i = 0; i < this.articles.length; i += 3) {
      if (currentPage !== 1) {
        doc.addPage();
      }
      // Add H1 heading at center for the first page
      if (currentPage === 1) {
        doc.setFontSize(16);
        const headingText = `Search Keyword: ${searchQuery}`;
        const headingWidth = doc.getTextWidth(headingText);
        const pageWidth = doc.internal.pageSize.getWidth();
        const headingX = (pageWidth - headingWidth) / 2;
        doc.text(headingText, headingX, yOffset + 10);
        yOffsetOnPage += 20; // Increase yOffset for the heading
      }
      for (let j = i; j < i + 3; j++) {
        const article = this.articles[j];
        if (!article) break;
        // Draw border box with padding
        doc.rect(10, yOffsetOnPage, 190, boxHeight);
        doc.setFillColor('255'); // Set fill color back to white
        const title = `Title: ${article.title.slice(0, 80)}`;
        const content = `Content: ${article.content.slice(0, 200)}`;
        // Add image if available
        if (article.image_url) {
          const imgData = article.image_url;
          doc.addImage(
            imgData,
            'JPEG',
            12 + padding,
            yOffsetOnPage + 2 + padding,
            50 - 2 * padding,
            50 - 2 * padding
          );
        }
        const textStartX = 70;
        let textYOffset = yOffsetOnPage + 5 + padding;
        const splitTitle = doc.splitTextToSize(title, 120 - 2 * padding);
        doc.text(splitTitle, textStartX + padding, textYOffset);
        textYOffset += splitTitle.length * 5 + 10 + padding;
        const splitContent = doc.splitTextToSize(
          content,
          120 - 2 * padding
        );
        doc.text(splitContent, textStartX + padding, textYOffset);
        yOffsetOnPage += boxHeight + spaceBetweenBoxes;
      }
      currentPage++;
      yOffsetOnPage = yOffset;
    }
    // Save the PDF
    doc.save(`News_${searchQuery}_${new Date().toISOString()}.pdf`);
  }

  // Function to extract distinct languages and countries
  extractDistinctLanguagesAndCountries() {
    const uniqueCountries = new Set<string>();
    const uniqueLanguages = new Set<string>();
    // Clear previous data
    this.countries1 = [];
    this.languages1 = [];
    for (const article of this.articles) {
      if (Array.isArray(article.country)) {
        uniqueCountries.add(article.country[0]); // Assuming you want the first element if it's an array
      } else if (typeof article.country === 'string') {
        uniqueCountries.add(article.country);
      }
      if (article.language) {
        uniqueLanguages.add(article.language);
      }
    }
    this.countries1 = Array.from(uniqueCountries).map(name => {
      return { name };
    });
    this.languages1 = Array.from(uniqueLanguages).map(name => {
      return { name };
    });
  }

  // Function to add or remove an article from the selected list
  toggleSelectedArticle(article: any) {
    const index = this.articles.findIndex(item => item === article);
    if (index !== -1) {
      this.articles.splice(index, 1);
    }
  }
  isArticleSelected(article: any) {
    return this.selectedArticles.includes(article);
  }

  //offline country filter
  setCountryFilter(country: string) {
    this.selectedCountryFilter = country;
    // console.log(this.selectedCountryFilter);
    // console.log(country);
    this.filterResults();
  }

  //offline language filter
  setLanguageFilter(language: string) {
    this.selectedLanguageFilter = language;
    this.filterResults();
  }

  //offline filter api
  filterResults() {
    const allArticles = this.allArticles.concat(this.selectedArticles);
    this.articles = allArticles.filter((article: { country: string | string[]; language: string; title: string }) => {
      const countryList = typeof article.country === 'string' ? [article.country] : article.country;
      const countryFilter = this.selectedCountryFilter === 'All' || countryList.some(country => country.trim().toLowerCase() === this.selectedCountryFilter.trim().toLowerCase());
      const languageFilter = this.selectedLanguageFilter === 'All' || article.language === this.selectedLanguageFilter;
      const isSelected = this.isArticleSelected(article);
      const titleSentiment = this.getSentimentAnalysisTitle(article.title);
      const sentimentFilter = this.selectedSentimentFilter === 'All' || this.selectedSentimentFilter === titleSentiment;
      return countryFilter && languageFilter && !isSelected && sentimentFilter;
    });
    this.updateAvailableLanguages();
  }

  //update language according to the country we choose
  updateAvailableLanguages() {
    const selectedCountry = this.selectedCountryFilter;
    if (selectedCountry !== 'All') {
      // Filter articles by selected country
      const filteredArticles = this.allArticles.filter((article: { country: string | string[]; language: string; }) => {
        const countryList = typeof article.country === 'string' ? [article.country] : article.country;
        return countryList.some(country => country.trim().toLowerCase() === selectedCountry.trim().toLowerCase());
      });
      // Extract unique languages from filtered articles
      const uniqueLanguages = new Set<string>();
      for (const article of filteredArticles) {
        if (article.language) {
          uniqueLanguages.add(article.language);
        }
      }
      this.languages1 = Array.from(uniqueLanguages).map(name => {
        return { name };
      });
    } else {
      // If 'All' is selected, show all available languages
      this.extractDistinctLanguagesAndCountries();
    }
  }

  //sentiment filter
  getSentimentAnalysisTitle(title: string): 'positive' | 'negative' | 'neutral' {
    const result = this.sentiment.analyze(title);
    if (result.score > 0) {
      return 'positive';
    } else if (result.score < 0) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  // selected sentiment
  selectSentimentFilter(sentiment: string) {
    this.selectedSentimentFilter = sentiment;
    this.filterResults();
  }

  //get article source website
  getSourceUrl(articleLink: string): string {
    // Use a URL object to parse the article link
    const url = new URL(articleLink);
    // Get the base URL (source website)
    return `${url.protocol}//${url.hostname}`;
  }

  //show keyword in console
  getValue(val: string) {
    //   console.warn(val)
  }

  //show country in console
  country(optioncount: string) {
    this.countryCode = optioncount;
    this.selectedcountry = optioncount;
    // console.warn(this.countryCode);
  }

  //show language in console
  language(optionlang: string) {
    this.languageCode = optionlang;
    this.selectedLanguage = optionlang;
    // console.warn(this.languageCode);
  }

  //translation
  onLanguageSelected(languageCode: string, query: string) {
    // Translate the search text
    this.translationService.translateText(query, languageCode).subscribe((translatedText) => {
      // Now, use the translated text to perform your search
      this.searchNews(translatedText, languageCode, this.countryCode);
      console.log(translatedText);
    });
  }

  ngOnInit(): void { }

  // search via keyword, countrycode and languagecode api
  searchNews(query: string, countrycode: string, languagecode: string) {
    this.api.topheadlines(query, countrycode, languagecode).subscribe(data => {
      this.newsData = data;
      this.nextPageToken = data.nextPage;
      // console.log("News Data:", data);
      // console.log(`Searching for translated text: ${query}`);
      // console.log(`Language Code: ${this.languageCode}`);
      // console.log(`Country Code: ${this.countryCode}`);
      // console.log(this.nextPageToken);
      if (data && data.status === "success") {
        this.articles = data.results;
        // console.log(this.articles);
        this.countries1 = [];
        this.languages1 = [];
        this.allArticles = this.articles.slice();

        //mongo db api
        for (const article of this.articles) {
          // Inside searchNews
          this.api.saveToMongoDB(article, query).subscribe({
            next: response => {
              // console.log('Data saved to MongoDB:', response);
            },
            error: error => {
              // console.error('Error saving data to MongoDB:', error);
            }

          });
        }
        this.extractDistinctLanguagesAndCountries();
        // Inside searchNews and nextPageNews functions, after getting data
        this.articles = data.results;
        this.filterResults();
      }
    });
  }

  //Loadmore search api
  loadmorenews(query: string, nextpagetoken: string) {
    this.api.nextpage(query, nextpagetoken).subscribe(data => {
      this.newsData = data;
      const newArticles = data.results;
      const pagetoken = data.nextPage;
      // Append new articles to the existing ones
      this.articles = this.articles.concat(newArticles);
      // Save all articles to allArticles
      this.allArticles = this.allArticles.concat(newArticles);
      // Update the nextPageToken
      this.nextPageToken = pagetoken;
      //mongo db api
      for (const article of this.articles) {
        // Inside searchNews
        this.api.saveToMongoDB(article, query).subscribe({
          next: response => {
            // console.log('Data saved to MongoDB:', response);
          },
          error: error => {
            // console.error('Error saving data to MongoDB:', error);
          }

        });
      }
      // Extract languages and countries again
      this.extractDistinctLanguagesAndCountries();
    });
  }

}
