import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { TranslateService,TranslateModule } from '@ngx-translate/core';

declare var Razorpay: any;  // For Razorpay integration

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true, // <-- Add this line
  imports: [FormsModule, TranslateModule] // <-- Add this line
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

  onSubmit(form: NgForm) {
    if (form.valid) {
      alert("Bank details submitted successfully!");
      console.log("Payment Details:", this.paymentDetails);
      this.processPayment(); // Trigger payment after submission
    } else {
      alert("Please fill out all required fields correctly!");
    }
  }

  processPayment() {
    const options = {
      "key": "your-api-key", // Replace with your Razorpay API key
      "amount": this.paymentDetails.amount, // Amount in paise
      "currency": "INR",
      "name": this.paymentDetails.accountHolder,
      "description": "Payment for services",
      "handler": function (response: any) {
        alert("Payment successful! Transaction ID: " + response.razorpay_payment_id);
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  }
}
