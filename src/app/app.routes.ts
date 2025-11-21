import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  { 
    path: 'customers', 
    component: CustomersComponent 
  },
  { 
    path: 'customers/:id', 
    component: CustomerDetailsComponent 
  },
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];
