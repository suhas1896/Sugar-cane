import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [TranslateModule]
})
export class HeaderComponent {
  // constructor(private translate: TranslateService) { 
  //   this.translate.setDefaultLang('en');
  constructor(private translate: TranslateService) {
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.setDefaultLang(savedLanguage);
    this.translate.use(savedLanguage);

    // Debugging translation loading
    this.translate.get('HELLO').subscribe(value => {
      console.log('Translation for HELLO:', value);
    });
  }
  // }
  switchLanguage(language: string) {
    console.log(`Switching language to: ${language}`);
    this.translate.use(language);
    localStorage.setItem('appLanguage', language);
    this.translate.get('HELLO').subscribe(value => {
      console.log(`Translation for HELLO in ${language}:`, value);
    });
  }
 }
