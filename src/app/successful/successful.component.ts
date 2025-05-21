import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { TranslateService,TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-successful',
  templateUrl: './successful.component.html',
  styleUrls: ['./successful.component.css'], // Corrected to styleUrls
  imports: [TranslateModule]
})
export class SuccessfulComponent {

  constructor(private router: Router, private translate: TranslateService) {} // Inject Router

  navigateHome() {
    this.router.navigate(['/home']);
  }

}