import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';

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
