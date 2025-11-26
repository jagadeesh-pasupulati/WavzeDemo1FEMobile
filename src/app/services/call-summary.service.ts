import { Injectable } from '@angular/core';
import { Customer } from './customer.service';

export interface CallSummaryData {
  customer: Customer | null;
  phoneNumber: string | null;
  callId: string | null;
  callDuration: number;
  callStartTime: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class CallSummaryService {
  private callSummaryData: CallSummaryData = {
    customer: null,
    phoneNumber: null,
    callId: null,
    callDuration: 0,
    callStartTime: null
  };

  setCallSummaryData(data: CallSummaryData) {
    this.callSummaryData = { ...data };
  }

  getCallSummaryData(): CallSummaryData {
    return { ...this.callSummaryData };
  }

  clearCallSummaryData() {
    this.callSummaryData = {
      customer: null,
      phoneNumber: null,
      callId: null,
      callDuration: 0,
      callStartTime: null
    };
  }
}

