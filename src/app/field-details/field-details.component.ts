import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router'; // Import Router
import { TranslateService, TranslateModule } from '@ngx-translate/core';

declare var google: any;

@Component({
  selector: 'app-field-details',
  standalone: true, // Indicate that this is a standalone component
  imports: [FormsModule, CommonModule, TranslateModule], // Add FormsModule and CommonModule to imports
  templateUrl: './field-details.component.html',
  styleUrls: ['./field-details.component.css'],
})
export class FieldDetailsComponent implements OnInit {

  farms: any[] = [];
  factories: any[] = [];
  allocations: any[] = [];
  farmerLocation: { lat: number, lng: number } | null = null;
  formData: any = {}; // Store form data here

  constructor(private router: Router, private translate: TranslateService) {} // Inject Router

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.farms = [
      { id: 1, yield: 100, distances: { A: 10, B: 20, C: 30 } },
      { id: 2, yield: 120, distances: { A: 15, B: 10, C: 25 } },
      { id: 3, yield: 80, distances: { A: 25, B: 15, C: 20 } }
    ];

    this.factories = [
      { id: 'A', capacity: 200, status: 'shutdown', location: { lat: 12.5215, lng: 76.8953 } }, // Sri Chamundeshwari Sugars Ltd. KM Doddi Mandya, Karnataka
      { id: 'B', capacity: 150, status: 'active', location: { lat: 12.5000, lng: 76.6833 } },  // Pandavapura Sahakara Sakkare Karkhane Ltd (PSSK), Pandavapura, Mandya, Karnataka
      { id: 'C', capacity: 180, status: 'active', location: { lat: 12.5215, lng: 76.8953 } }   // Mysore Sugar Co. Ltd., Mandya, Karnataka
    ];
  }

  getFarmerLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.farmerLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('Farmer location:', this.farmerLocation);
        this.calculateAllDistances(); // Call calculateAllDistances here
      }, (error) => {
        console.error('Error getting location', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  calculateDistances() {
    if (this.farmerLocation) {
      const service = new google.maps.DistanceMatrixService();
      const origin = new google.maps.LatLng(this.farmerLocation.lat, this.farmerLocation.lng);
      const destinations = this.factories.map(factory => new google.maps.LatLng(factory.location.lat, factory.location.lng));

      service.getDistanceMatrix({
        origins: [origin],
        destinations: destinations,
        travelMode: google.maps.TravelMode.DRIVING
      }, (response: any, status: string) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const results = response.rows[0].elements;
          results.forEach((result: any, index: number) => {
            console.log(`Distance to Factory ${this.factories[index].id}: ${result.distance.text}`);
          });
        } else {
          console.error('Error calculating distances', status);
        }
      });
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      // Create a JSON object with form values
      this.formData = {
        landnumber: form.value.landnumber,
        name: form.value.name,
        cultivationdate: form.value.cultivationdate,
        cultivationacre: form.value.cultivationacre,
        yieldduration: form.value.yieldduration,
        harvestingreadiness: form.value.harvestingreadiness,
        terms: form.value.terms
      };

      // Get farmer location and calculate distances
      this.getFarmerLocation();
    } else {
      console.log('Please fill out the form correctly.');
    }
  }

  // Helper method to get cookie value by name
  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Helper method to set cookie value
  setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  // New method to calculate distance using Haversine formula
  calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371.0; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Method to calculate distances to all factories
  calculateAllDistances() {
    if (this.farmerLocation) {
      const distances: any = {};
      this.factories.forEach(factory => {
        const distance = this.calculateHaversineDistance(
          this.farmerLocation!.lat,
          this.farmerLocation!.lng,
          factory.location.lat,
          factory.location.lng
        );
        distances[`Distance to Factory ${factory.id}`] = `${distance.toFixed(2)} km`;
        console.log(`Distance to Factory ${factory.id}: ${distance.toFixed(2)} km`);
      });
      this.saveDistancesInCookies(distances);
    }
  }

  // Method to save distances in cookies
  saveDistancesInCookies(distances: any) {
    const existingData = this.getCookie('formData');
    let formDataArray = existingData ? JSON.parse(existingData) : [];

    // Ensure formDataArray is an array
    if (!Array.isArray(formDataArray)) {
      formDataArray = [];
    }

    // Add distances to the latest form data entry
    this.formData = {
      ...this.formData,
      ...distances
    };

    formDataArray.push(this.formData);

    // Save updated array in cookies
    this.setCookie('formData', JSON.stringify(formDataArray), 7);

    // Navigate to the successful route
    this.router.navigate(['/successful']);
  }
}
