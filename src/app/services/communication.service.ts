import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CallRequest {
  phoneNumber: string;
  customerId?: string;
  customerName?: string;
}

export interface CallResponse {
  callId: string;
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private apiUrl = `${environment.apiUrl}/api/communication`;

  constructor(private http: HttpClient) { }

  initiateOutboundCall(request: CallRequest): Observable<CallResponse> {
    return this.http.post<CallResponse>(`${this.apiUrl}/call`, request);
  }
}

