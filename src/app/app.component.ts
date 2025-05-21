import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [TranslateModule, RouterOutlet, HeaderComponent]
})
export class AppComponent {
  title = 'sugar_cane';

  constructor(private translate: TranslateService) {
    // Set default and active language
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
