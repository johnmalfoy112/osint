// src/app/components/google-trends-search/google-trends-search.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoogleTrendsSearchService } from '../service/google-trends-search.service';

@Component({
  selector: 'app-google-trends-search',
  templateUrl: './google-trends-search.component.html',
  styleUrls: ['./google-trends-search.component.css'],
})
export class GoogleTrendsSearchComponent implements OnInit {

  constructor(
    private googleTrendsService: GoogleTrendsSearchService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      query: [''],
      dataTypes: [''],
    });
  }

  googleTrendsData: any;
  searchForm: FormGroup;
  // Search placeholder functions
  isFocused: boolean = false;
  currentDataType: string = '';
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }
  ngOnInit(): void {
    // Additional initialization logic if needed
  }

  getGoogleTrendsData(): void {
    const { query, dataTypes } = this.searchForm.value;
    this.googleTrendsService.getGoogleTrendsData(query, dataTypes).subscribe(
      (data) => {
        this.googleTrendsData = data;
        console.log(this.googleTrendsData);
      },
      (error) => {
        console.error('Error fetching Google Trends data:', error);
      }
    );
  }

  onChangeDataTypes(selectedDataType: string): void {
    // Ensure dataTypes is always an array
    const currentDataTypes = this.searchForm.get('dataTypes')?.value || [];
    // Check if selectedDataType is already in the array
    const isSelected = currentDataTypes.includes(selectedDataType);
    // Update dataTypes based on selection
    const newDataTypes = isSelected
      ? currentDataTypes.filter((type: string) => type !== selectedDataType)
      : [selectedDataType];
    // Update the form value
    this.searchForm.patchValue({ dataTypes: newDataTypes });
    // Update the currentDataType for display
    this.currentDataType = isSelected ? '' : selectedDataType;
  }
  
}
