import { Component } from '@angular/core';
import { ScoutService } from '../../../services/scout.service';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule, ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {ThemePalette} from '@angular/material/core';
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']  // Corrected here
})
export class CountriesComponent {
  countries: any ;
  selectedCategory: string = 'all';
  countriesPerPage: number = 4;
  currentPage: number = 0;
  flag_path:any;
  filteredImages: any[] = [];  // Fixed: explicitly set as an array
  paginatedImages: any[] = [];
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  spinnerValue = 100;
  dataloading: boolean = true;
  constructor(private scoutService: ScoutService) {
  }

  ngOnInit() {
    this.loadCountries();
  }
  
  loadCountries(): void {
    this.scoutService.getDomains().subscribe(
      (response: any) => {
        if (response && response.status) {
          this.dataloading = false
          this.countries = response.data.domains;
          this.flag_path = response.data.flag_path;
          console.log('countries',this.countries)
        }
      },
      (error: any) => {
        console.error('Error fetching teams:', error);
      }
    );
  }

  selectedCountries: string[] = []; // Store selected country names here

  toggleCountrySelection(country: any) {
    const index = this.selectedCountries.indexOf(country.location);
    if (index === -1) {
      this.selectedCountries.push(country.location); // Select country if not selected
    } else {
      this.selectedCountries.splice(index, 1); // Deselect if already selected
    }
    console.log('countries',this.selectedCountries)

  }

  isSelectedCountry(country: any): boolean {
    return this.selectedCountries.includes(country.location);
  }
}
