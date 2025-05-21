import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgZone } from '@angular/core';

declare var Razorpay: any; // Razorpay integration

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [FormsModule, TranslateModule]
})
export class PaymentComponent {
  paymentDetails = {
    accountHolder: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    mobileNumber: '',
    amount: 50000 // Default amount in paise (₹500)
  };

  constructor(private router: Router, private translate: TranslateService, private ngZone: NgZone) {}

  ngOnInit() {
  document.body.classList.remove('modal-open');
  document.body.style.overflow = 'auto';
}

  onSubmit(form: NgForm) {
    if (form.valid) {
      alert(this.translate.instant("BANK_SUBMIT_SUCCESS"));
      console.log("Payment Details:", this.paymentDetails);
      this.processPayment(); // Trigger payment after submission
    } else {
      alert(this.translate.instant("BANK_SUBMIT_ERROR"));
    }
  }

  processPayment() {
    const options = {
      key: "your-api-key", // Replace with your Razorpay API key
      amount: this.paymentDetails.amount, // Amount in paise
      currency: "INR",
      name: this.paymentDetails.accountHolder,
      description: this.translate.instant("PAYMENT_DESCRIPTION"),
      handler: (response: any) => {
        this.ngZone.run(() => {
          alert(this.translate.instant("PAYMENT_SUCCESS") + response.razorpay_payment_id);
          this.redirectToSuccessPage();
        });
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  redirectToSuccessPage() {
    this.router.navigate(['/successful']);
  }
}
