import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FactoriesComponent } from "./factories/factories.component";
import { FieldDetailsComponent } from './field-details/field-details.component';
import { SuccessfulComponent } from './successful/successful.component';
import { RegisteredComponent } from "./registered/registered.component";
import { PaymentComponent } from './payment/payment.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent }, // Temporarily set home as the default component
  { path: 'home', component: HomeComponent },
  { path: 'factories', component: FactoriesComponent },
  { path: 'field-details', component: FieldDetailsComponent },
  { path: 'successful', component: SuccessfulComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'details', component: RegisteredComponent },
];

