import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService,TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-registered',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './registered.component.html',
  styleUrls: ['./registered.component.css']
})
export class RegisteredComponent implements OnInit {
  data: any[] = [];
  factory1Data: any[] = [];
  factory2Data: any[] = [];
  factory3Data: any[] = [];
  factoryName: string | null = null;
  isFactoryShutdown: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute, private router: Router, private translate: TranslateService) {}

  ngOnInit() {
    this.loadDataFromCookies();
    this.route.queryParams.subscribe(params => {
      this.factoryName = params['factory'] || null;
      const operationalStatus = params['status'] || null;
      console.log('Factory Name:', this.factoryName);
      console.log('Operational Status:', operationalStatus);
      this.isFactoryShutdown = operationalStatus === 'Shutdown';
      this.filterDataByFactory();
    });
  }

  loadDataFromCookies() {
    const existingData = this.getCookieData('formData') || [];
    this.factory1Data = this.getCookieData('factory1Data') || [];
    this.factory2Data = this.getCookieData('factory2Data') || [];
    this.factory3Data = this.getCookieData('factory3Data') || [];
  
    existingData.forEach(item => {
      // Check if item is already assigned manually
      const alreadyAssigned =
        this.factory1Data.some(i => i.landnumber === item.landnumber) ||
        this.factory2Data.some(i => i.landnumber === item.landnumber) ||
        this.factory3Data.some(i => i.landnumber === item.landnumber);
  
      if (!alreadyAssigned) {
        // If not manually assigned, assign based on nearest factory
        const distances = {
          factory1: parseFloat(item['Distance to Factory A']),
          factory2: parseFloat(item['Distance to Factory B']),
          factory3: parseFloat(item['Distance to Factory C'])
        };
  
        const nearestFactory = Object.keys(distances).reduce((a, b) =>
          distances[a as keyof typeof distances] < distances[b as keyof typeof distances] ? a : b
        ) as keyof typeof distances;
  
        // Mark item as auto-assigned
        item.autoAssigned = true;
  
        switch (nearestFactory) {
          case 'factory1':
            this.factory1Data.push(item);
            break;
          case 'factory2':
            this.factory2Data.push(item);
            break;
          case 'factory3':
            this.factory3Data.push(item);
            break;
        }
      } else {
        // If manually assigned, ensure autoAssigned is false
        item.autoAssigned = false;
      }
    });
  
    console.log('Factory 1 Data:', this.factory1Data);
    console.log('Factory 2 Data:', this.factory2Data);
    console.log('Factory 3 Data:', this.factory3Data);
  }
  

  getCookieData(name: string): any[] | null {
    const cookieValue = this.getCookie(name);
    return cookieValue ? JSON.parse(cookieValue) : null;
  }

  setCookieData(name: string, data: any[]) {
    this.document.cookie = `${name}=${JSON.stringify(data)};path=/`;
  }

  getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = this.document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  }

  addToFactory1(item: any) {
    item.autoAssigned = false; // Remove auto-assigned flag
    this.factory1Data.push(item);
    this.factory2Data = this.factory2Data.filter(i => i.landnumber !== item.landnumber);
    this.factory3Data = this.factory3Data.filter(i => i.landnumber !== item.landnumber);
    this.updateCookies();
    this.filterDataByFactory();
  }
  
  addToFactory2(item: any) {
    item.autoAssigned = false; // Remove auto-assigned flag
    this.factory2Data.push(item);
    this.factory1Data = this.factory1Data.filter(i => i.landnumber !== item.landnumber);
    this.factory3Data = this.factory3Data.filter(i => i.landnumber !== item.landnumber);
    this.updateCookies();
    this.filterDataByFactory();
  }
  
  addToFactory3(item: any) {
    item.autoAssigned = false; // Remove auto-assigned flag
    this.factory3Data.push(item);
    this.factory1Data = this.factory1Data.filter(i => i.landnumber !== item.landnumber);
    this.factory2Data = this.factory2Data.filter(i => i.landnumber !== item.landnumber);
    this.updateCookies();
    this.filterDataByFactory();
  }
  

  updateCookies() {
    this.setCookieData('factory1Data', this.factory1Data);
    this.setCookieData('factory2Data', this.factory2Data);
    this.setCookieData('factory3Data', this.factory3Data);
  }

  filterDataByFactory() {
    console.log('Filtering data for:', this.factoryName);
    switch (this.factoryName) {
      case 'factory1':
        this.data = this.factory1Data.slice();
        break;
      case 'factory2':
        this.data = this.factory2Data.slice();
        break;
      case 'factory3':
        this.data = this.factory3Data.slice();
        break;
      default:
        this.data = [];
        break;
    }
    console.log('Filtered Data:', this.data);
  }
    processPayment(item: any) {
    // alert(`Processing payment for ${item.name}, Land Number: ${item.landnumber}`);
    // Integrate payment gateway (Razorpay, Stripe, PayPal) inside this function
    this.router.navigate(['/payment'], { queryParams: { landnumber: item.landnumber, name: item.name } });
  }
}
