import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Customer {
  customerId?: string;
  propertyId?: string;
  createTs?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phn1Type?: string;
  phn1Nbr?: number;
  phn2Type?: string;
  phn2Nbr?: number;
  methodPref?: string;
  timeZone?: string;
  languagePref?: string;
  languageOthr?: string;
  birthDate?: string;
  maritalStatus?: string;
  employer?: string;
  occupation?: string;
  annualIncome?: string;
  estCreditRange?: string;
  fullName?: string;
  phone?: string;
  stage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/api/customers`;

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  searchCustomers(query: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: string, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
