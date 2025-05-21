import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService,TranslateModule } from '@ngx-translate/core'; // Import TranslateService

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [TranslateModule]
})
export class HomeComponent implements AfterViewInit {

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private translate: TranslateService // Inject TranslateService
  ) {}

  ngAfterViewInit() {
    if (typeof document !== 'undefined') {
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        new bootstrap.Modal(modalElement);
      }
    }
  }

  navigateToFieldDetails() {
    this.router.navigate(['/field-details']);
  }

  onLoginSubmit(userId: string, password: string) {
    if (userId === 'admin' && password === 'password') {
      this.router.navigate(['/factories']);
      this.removeModalBackdrop();
      this.cdr.detectChanges();
    } else {
      // Fetch translated error message
      this.translate.get('INVALID_CREDENTIALS').subscribe(message => {
        alert(message);
      });
    }
  }

  removeModalBackdrop() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
}
