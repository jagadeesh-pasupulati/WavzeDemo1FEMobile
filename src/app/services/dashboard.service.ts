import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getTodayCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/today-customers`);
  }

  getCustomersNeedingAction(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers-needing-action`);
  }
}
