import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, of } from 'rxjs';
import { switchMap, takeWhile, catchError } from 'rxjs/operators';
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

export interface CallStatus {
  callId: string;
  status: string; // initiated, connecting, connected, disconnected, failed
  phoneNumber: string;
  customerId?: string;
  customerName?: string;
  duration?: number;
  timestamp?: number;
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

  getCallStatus(callId: string): Observable<CallStatus> {
    return this.http.get<CallStatus>(`${this.apiUrl}/call/status/${callId}`);
  }

  /**
   * Poll for call status updates until call ends or fails
   * Returns an Observable that emits status updates every second
   */
  pollCallStatus(callId: string): Observable<CallStatus> {
    return interval(1000).pipe(
      switchMap(() => {
        console.log('Polling call status for callId:', callId);
        return this.getCallStatus(callId).pipe(
          // Handle 404 errors gracefully - return a default status
          // @ts-ignore - catchError is available
          catchError((error) => {
            if (error.status === 404) {
              console.log('Call status not found (404), returning default status');
              // Return a default status object if call not found
              return of({
                callId: callId,
                status: 'initiated',
                phoneNumber: '',
                duration: 0
              } as CallStatus);
            }
            console.error('Error getting call status:', error);
            throw error;
          })
        );
      }),
      takeWhile(status => {
        // Stop polling if status is disconnected, failed, or error
        const shouldContinue = status && 
          status.status !== 'disconnected' && 
          status.status !== 'failed' && 
          status.status !== 'error';
        
        if (!shouldContinue && status) {
          console.log('Polling will stop - call ended with status:', status.status);
        }
        
        return shouldContinue;
      }, true) // inclusive - emit the final status once before stopping
    );
  }

  /**
   * End (hang up) an active call
   */
  endCall(callId: string): Observable<CallResponse> {
    return this.http.post<CallResponse>(`${this.apiUrl}/call/${callId}/end`, {});
  }
}

