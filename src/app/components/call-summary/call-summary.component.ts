import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CallSummaryService, CallSummaryData } from '../../services/call-summary.service';
import { Customer } from '../../services/customer.service';

@Component({
  selector: 'app-call-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, DialogModule, DropdownModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen flex flex-col" style="height: calc(100vh - 3rem);">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6 flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 flex-1">
            <button (click)="goBack()" 
                    class="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <i class="pi pi-arrow-left text-gray-700 text-lg"></i>
            </button>
            <div class="flex-1">
              <h1 class="text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-2" style="font-size: 24px; font-weight: 600; line-height: 32px;">
                <i class="pi pi-phone text-gray-700"></i>
                {{ getCustomerName() }}/Phone Call
              </h1>
              <div class="text-sm text-gray-600" style="font-size: 14px; line-height: 20px;">
                <span>{{ formatCallDate() }}</span>
                <span class="mx-2">•</span>
                <span>{{ callSummaryData.phoneNumber || 'N/A' }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button (click)="openWriteEmailDialog()" 
                    class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300">
              Write Email
              <span class="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full ml-1">W</span>
            </button>
            <button (click)="openCreateLeadDialog()" 
                    class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300">
              Create Lead
              <span class="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full ml-1">Cmd+L</span>
            </button>
            <button class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <i class="pi pi-ellipsis-h"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-lg shadow-sm p-6 flex-1 min-h-0 overflow-y-auto">
        <div class="space-y-6">
          <!-- Audio Player -->
          <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
            <!-- Left side: Play/Pause Icon -->
            <button (click)="toggleAudioPlayback()" 
                    class="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
              <i *ngIf="isAudioPlaying" 
                 class="pi pi-pause text-gray-700"></i>
              <i *ngIf="!isAudioPlaying" 
                 class="pi pi-play text-gray-700"></i>
            </button>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-900">{{ formatCallTime(audioCurrentTime, audioTotalTime) }}</span>
              </div>
              <div class="w-full bg-gray-300 rounded-full h-1 cursor-pointer" 
                   (click)="seekAudio($event)">
                <div class="bg-blue-600 h-1 rounded-full transition-all" 
                     [style.width.%]="(audioCurrentTime / audioTotalTime) * 100"></div>
              </div>
            </div>
            <!-- Right side: Speaker Icon -->
            <button (click)="toggleAudioMute()" 
                    class="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
              <i class="pi pi-volume-up text-gray-700"></i>
            </button>
          </div>
          
          <!-- Hidden Audio Element -->
          <audio #audioPlayer
                 (loadedmetadata)="onAudioLoaded()"
                 (timeupdate)="onAudioTimeUpdate()"
                 (ended)="onAudioEnded()"
                 (play)="isAudioPlaying = true"
                 (pause)="isAudioPlaying = false"
                 style="display: none;"></audio>

          <!-- Call Outcome Buttons -->
          <div class="flex gap-3">
            <button (click)="callOutcome = 'spoke'" 
                    [class.bg-blue-600]="callOutcome === 'spoke'"
                    [class.text-white]="callOutcome === 'spoke'"
                    [class.bg-white]="callOutcome !== 'spoke'"
                    [class.text-gray-700]="callOutcome !== 'spoke'"
                    [class.border-blue-600]="callOutcome === 'spoke'"
                    class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-circle-fill text-xs" 
                 [class.text-white]="callOutcome === 'spoke'"
                 [class.text-blue-600]="callOutcome !== 'spoke'"></i>
              Spoke with Customer
            </button>
            <button (click)="callOutcome = 'leftMessage'" 
                    [class.bg-blue-600]="callOutcome === 'leftMessage'"
                    [class.text-white]="callOutcome === 'leftMessage'"
                    [class.bg-white]="callOutcome !== 'leftMessage'"
                    [class.text-gray-700]="callOutcome !== 'leftMessage'"
                    [class.border-blue-600]="callOutcome === 'leftMessage'"
                    class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-question-circle text-xs"></i>
              Left Message
            </button>
            <button (click)="callOutcome = 'noMessage'" 
                    [class.bg-blue-600]="callOutcome === 'noMessage'"
                    [class.text-white]="callOutcome === 'noMessage'"
                    [class.bg-white]="callOutcome !== 'noMessage'"
                    [class.text-gray-700]="callOutcome !== 'noMessage'"
                    [class.border-blue-600]="callOutcome === 'noMessage'"
                    class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-times text-xs"></i>
              No Message Left
            </button>
          </div>

          <!-- Post-Call Analysis Section -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4" style="font-size: 18px; font-weight: 600;">Post-Call Analysis</h3>
            
            <div class="space-y-6">
              <!-- Summary Field -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2" style="font-size: 14px; font-weight: 500;">Summary</label>
                <textarea [(ngModel)]="callSummaryText" 
                          rows="4"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="A representative named Brian Smith contacted Mrs. Conner regarding refinancing options for her home mortgage. After confirming her interest in both lowering her interest rate and pulling cash from equity, Mrs. Martin provided details about her property value ($450K), mortgage balance ($250K), and current variable interest-only loan. She also mentioned having two mortgages and seeking $25k cash. The representative explained they could provide competitive rates, then transferred the call to a loan officer, Christopher Gurley, to discuss specific offers."
                          style="font-size: 14px; line-height: 20px;"></textarea>
              </div>

              <!-- Intent Field -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2" style="font-size: 14px; font-weight: 500;">Intent</label>
                <input type="text" 
                       [(ngModel)]="callIntentText"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Refinance mortgage and offer rates."
                       style="font-size: 14px; line-height: 20px;">
              </div>

              <!-- Comments Field -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2" style="font-size: 14px; font-weight: 500;">Comments</label>
                <textarea [(ngModel)]="callCommentsText" 
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Write your comments here..."
                          style="font-size: 14px; line-height: 20px;"></textarea>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button (click)="goBack()" 
                    class="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors border border-gray-300">
              Cancel
            </button>
            <button (click)="saveCallSummary()" 
                    class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Write Email Dialog -->
    <p-dialog [(visible)]="showWriteEmailDialog" 
              [modal]="true" 
              [style]="{width: '800px', maxWidth: '95vw'}"
              [styleClass]="'write-email-dialog'"
              [draggable]="false"
              [resizable]="false"
              [closable]="false">
      <ng-template pTemplate="header">
        <div class="w-full px-6 py-4 border-b border-gray-200 bg-white">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-gray-900" style="font-size: 18px; font-weight: 600; line-height: 24px;">Write Email</h2>
            <div class="flex items-center gap-2">
              <span class="text-gray-500" style="font-size: 12px; line-height: 16px;">Esc</span>
              <button (click)="closeWriteEmailDialog()" 
                      class="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <i class="pi pi-times text-gray-700" style="font-size: 18px;"></i>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2 text-gray-900" style="font-size: 14px; line-height: 20px; color: #111827;">
            <i class="pi pi-user" style="font-size: 14px; color: #4b5563;"></i>
            <span style="font-weight: 500; color: #111827;">{{ getCustomerName() }}</span>
            <span style="color: #9ca3af;">•</span>
            <span style="color: #111827;">{{ callSummaryData.phoneNumber || 'N/A' }}</span>
            <span style="color: #9ca3af;">•</span>
            <span style="color: #111827;">{{ getCustomerEmail() }}</span>
          </div>
        </div>
      </ng-template>
      
      <div class="px-6 py-6 space-y-6">
        <!-- Subject Field -->
        <div>
          <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Subject:</label>
          <input type="text" 
                 [(ngModel)]="emailSubject"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 style="font-size: 14px; line-height: 20px; color: #111827;">
        </div>

        <!-- Tone Selection Buttons -->
        <div>
          <label class="block text-gray-900 mb-3" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Tone:</label>
          <div class="flex gap-3 flex-wrap">
            <button (click)="selectTone('trustworthy')" 
                    [class]="selectedTone === 'trustworthy' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-md transition-colors"
                    style="font-size: 14px; font-weight: 500; line-height: 20px;">
              Trustworthy
            </button>
            <button (click)="selectTone('professional')" 
                    [class]="selectedTone === 'professional' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-md transition-colors"
                    style="font-size: 14px; font-weight: 500; line-height: 20px;">
              Professional
            </button>
            <button (click)="selectTone('friendly')" 
                    [class]="selectedTone === 'friendly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-md transition-colors"
                    style="font-size: 14px; font-weight: 500; line-height: 20px;">
              Friendly
            </button>
            <button (click)="selectTone('default')" 
                    [class]="selectedTone === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-md transition-colors"
                    style="font-size: 14px; font-weight: 500; line-height: 20px;">
              Default
            </button>
          </div>
        </div>

        <!-- Email Body -->
        <div>
          <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Email Body:</label>
          <textarea [(ngModel)]="emailBody" 
                    rows="12"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style="font-size: 14px; line-height: 20px; color: #111827;"></textarea>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button (click)="closeWriteEmailDialog()" 
                  class="px-4 py-2 bg-white rounded-md hover:bg-gray-50 transition-colors border border-gray-300"
                  style="font-size: 14px; font-weight: 500; line-height: 20px; color: #374151;">
            Cancel
            <span class="ml-1" style="font-size: 12px; line-height: 16px; color: #6b7280;">Esc</span>
          </button>
          <button (click)="sendEmail()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  style="font-size: 14px; font-weight: 500; line-height: 20px;">
            Send
            <span class="ml-1" style="font-size: 12px; line-height: 16px; opacity: 0.8;">S</span>
          </button>
        </div>
      </ng-template>
    </p-dialog>

    <!-- Create Lead Dialog -->
    <p-dialog [(visible)]="showCreateLeadDialog" 
              [modal]="true" 
              [style]="{width: '900px', maxWidth: '95vw', maxHeight: '90vh'}"
              [styleClass]="'create-lead-dialog'"
              [draggable]="false"
              [resizable]="false"
              [closable]="false">
      <ng-template pTemplate="header">
        <div class="w-full px-6 py-4 border-b border-gray-200 bg-white">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-gray-900" style="font-size: 18px; font-weight: 600; line-height: 24px;">Create Lead</h2>
            <div class="flex items-center gap-2">
              <span class="text-gray-500" style="font-size: 12px; line-height: 16px;">Esc</span>
              <button (click)="closeCreateLeadDialog()" 
                      class="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <i class="pi pi-times text-gray-700" style="font-size: 18px;"></i>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2 text-gray-900" style="font-size: 14px; line-height: 20px; color: #111827;">
            <i class="pi pi-user" style="font-size: 14px; color: #4b5563;"></i>
            <span style="font-weight: 500; color: #111827;">{{ getCustomerName() }}</span>
            <span style="color: #9ca3af;">•</span>
            <span style="color: #111827;">{{ callSummaryData.phoneNumber || 'N/A' }}</span>
            <span style="color: #9ca3af;">•</span>
            <span style="color: #111827;">{{ getCustomerEmail() }}</span>
          </div>
        </div>
      </ng-template>
      
      <div class="px-6 py-6 space-y-6 overflow-y-auto" style="max-height: calc(90vh - 180px);">
        <!-- Product Type Section -->
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Product Type</label>
            <p-dropdown [(ngModel)]="leadData.productType" 
                       [options]="productTypes" 
                       optionLabel="label"
                       placeholder="Select Product Type"
                       class="w-full"
                       [style]="{width: '100%'}"></p-dropdown>
          </div>
          <div class="pt-6">
            <i class="pi pi-arrow-right text-gray-400"></i>
          </div>
          <div class="flex-1">
            <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Product</label>
            <p-dropdown [(ngModel)]="leadData.product" 
                       [options]="products" 
                       optionLabel="label"
                       placeholder="Select Product"
                       class="w-full"
                       [style]="{width: '100%'}"></p-dropdown>
          </div>
        </div>

        <!-- Borrower Information Section -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Borrower Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Borrower Name</label>
              <input type="text" [(ngModel)]="leadData.borrowerName" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Co-Borrower Name
                <span class="text-yellow-600 ml-1" *ngIf="!leadData.coBorrowerName">⚠️</span>
              </label>
              <input type="text" [(ngModel)]="leadData.coBorrowerName" 
                     placeholder="Not provided"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Phone Number
                <span class="text-yellow-600 ml-1" *ngIf="!leadData.phoneNumber">⚠️</span>
              </label>
              <input type="text" [(ngModel)]="leadData.phoneNumber" 
                     placeholder="Not provided"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Email Address
                <span class="text-yellow-600 ml-1" *ngIf="!leadData.emailAddress">⚠️</span>
              </label>
              <input type="email" [(ngModel)]="leadData.emailAddress" 
                     placeholder="Not provided"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div class="col-span-2">
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Current Address
                <span class="text-yellow-600 ml-1" *ngIf="!leadData.currentAddress">⚠️</span>
              </label>
              <input type="text" [(ngModel)]="leadData.currentAddress" 
                     placeholder="Single-family residence (exact address not provided)"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
          </div>
        </div>

        <!-- Property Information Section -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Property Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Property Type</label>
              <input type="text" [(ngModel)]="leadData.propertyType" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Estimated Property Value</label>
              <input type="text" [(ngModel)]="leadData.estimatedPropertyValue" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Current Mortgages</label>
              <input type="text" [(ngModel)]="leadData.currentMortgages" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Combined Mortgage Balance (approx.)</label>
              <input type="text" [(ngModel)]="leadData.combinedMortgageBalance" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
          </div>
        </div>

        <!-- Loan Purpose Section -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Loan Purpose</h3>
          <div>
            <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Purpose of Refinance</label>
            <textarea [(ngModel)]="leadData.loanPurpose" 
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style="font-size: 14px; line-height: 20px; color: #111827;"></textarea>
          </div>
        </div>

        <!-- Current Loan Details Section -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Current Loan Details</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Current Interest Rate</label>
              <input type="text" [(ngModel)]="leadData.currentInterestRate" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Loan Type</label>
              <input type="text" [(ngModel)]="leadData.loanType" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Remaining Balance</label>
              <input type="text" [(ngModel)]="leadData.remainingBalance" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Current Lender
                <span class="text-yellow-600 ml-1" *ngIf="!leadData.currentLender">⚠️</span>
              </label>
              <input type="text" [(ngModel)]="leadData.currentLender" 
                     placeholder="Not provided"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div class="col-span-2">
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Second Mortgage Balance
                <span class="text-yellow-600 ml-1" *ngIf="!leadData.secondMortgageBalance">⚠️</span>
              </label>
              <input type="text" [(ngModel)]="leadData.secondMortgageBalance" 
                     placeholder="Not broken out separately"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
          </div>
        </div>

        <!-- Requested Loan Details Section -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Requested Loan Details</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Requested Loan Type</label>
              <input type="text" [(ngModel)]="leadData.requestedLoanType" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Requested Loan Amount</label>
              <input type="text" [(ngModel)]="leadData.requestedLoanAmount" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div class="col-span-2">
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Cash-Out Amount</label>
              <input type="text" [(ngModel)]="leadData.cashOutAmount" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
          </div>
        </div>

        <!-- Borrower Financial Information Section -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Borrower Financial Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Annual Income
                <span class="text-yellow-600 ml-1">⚠️</span>
              </label>
              <input type="text" [(ngModel)]="leadData.annualIncome" 
                     placeholder="Not provided"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Employment Status
                <span class="text-yellow-600 ml-1">⚠️</span>
              </label>
              <input type="text" [(ngModel)]="leadData.employmentStatus" 
                     placeholder="Not provided"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Credit Score
                <span class="text-yellow-600 ml-1">⚠️</span>
              </label>
              <input type="text" [(ngModel)]="leadData.creditScore" 
                     placeholder="Not provided"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div>
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">
                Other Debts/Liabilities
                <span class="text-yellow-600 ml-1">⚠️</span>
              </label>
              <input type="text" [(ngModel)]="leadData.otherDebts" 
                     placeholder="Not provided"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
            <div class="col-span-2">
              <label class="block text-gray-900 mb-2" style="font-size: 14px; font-weight: 500; line-height: 20px; color: #111827;">Bankruptcy History</label>
              <input type="text" [(ngModel)]="leadData.bankruptcyHistory" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     style="font-size: 14px; line-height: 20px; color: #111827;">
            </div>
          </div>
        </div>

        <!-- Additional Notes Section -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Additional Notes</h3>
          <div>
            <textarea [(ngModel)]="leadData.additionalNotes" 
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style="font-size: 14px; line-height: 20px; color: #111827;"></textarea>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button (click)="closeCreateLeadDialog()" 
                  class="px-4 py-2 bg-white rounded-md hover:bg-gray-50 transition-colors border border-gray-300"
                  style="font-size: 14px; font-weight: 500; line-height: 20px; color: #374151;">
            Cancel
            <span class="ml-1" style="font-size: 12px; line-height: 16px; color: #6b7280;">Esc</span>
          </button>
          <button (click)="createLead()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  style="font-size: 14px; font-weight: 500; line-height: 20px;">
            Create Lead
            <span class="ml-1" style="font-size: 12px; line-height: 16px; opacity: 0.8;">S</span>
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .create-lead-dialog .p-dropdown {
      width: 100%;
      font-size: 14px;
      line-height: 20px;
    }
    
    :host ::ng-deep .create-lead-dialog .p-dropdown .p-dropdown-label {
      font-size: 14px;
      line-height: 20px;
      color: #111827;
      padding: 8px 12px;
    }
    
    :host ::ng-deep .create-lead-dialog .p-dropdown .p-dropdown-trigger {
      width: 2.5rem;
    }
    
    :host ::ng-deep .create-lead-dialog .p-inputtext {
      font-size: 14px;
      line-height: 20px;
      color: #111827;
    }
    
    :host ::ng-deep .create-lead-dialog .p-inputtext::placeholder {
      color: #9ca3af;
      font-size: 14px;
    }
    
    :host ::ng-deep .create-lead-dialog textarea {
      font-size: 14px;
      line-height: 20px;
      color: #111827;
    }
    
    :host ::ng-deep .create-lead-dialog textarea::placeholder {
      color: #9ca3af;
      font-size: 14px;
    }
  `]
})
export class CallSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audioPlayer', { static: false }) audioPlayerRef!: ElementRef<HTMLAudioElement>;
  callSummaryData: CallSummaryData = {
    customer: null,
    phoneNumber: null,
    callId: null,
    callDuration: 0,
    callStartTime: null
  };
  
  callOutcome: 'spoke' | 'leftMessage' | 'noMessage' = 'spoke';
  callSummaryText = 'A representative named Brian Smith contacted Mrs. Martin regarding refinancing options for her home mortgage. After confirming her interest in both lowering her interest rate and pulling cash from equity, Mrs. Martin provided details about her property value ($450K), mortgage balance ($250K), and current variable interest-only loan. She also mentioned having two mortgages and seeking $25K cash. The representative explained they could provide competitive rates, then transferred the call to a loan officer, Christopher Gurley, to discuss specific offers.';
  callIntentText = 'Refinance mortgage and offer rates.';
  callCommentsText = '';
  isAudioPlaying = false;
  audioCurrentTime = 0;
  audioTotalTime = 299;
  audioElement: HTMLAudioElement | null = null;
  audioUpdateInterval: any = null;
  audioVolume = 1.0;
  audioMuted = false;

  // Write Email Dialog
  showWriteEmailDialog = false;
  selectedTone: 'trustworthy' | 'professional' | 'friendly' | 'default' = 'trustworthy';
  emailSubject = '';
  emailBody = '';

  // Create Lead Dialog
  showCreateLeadDialog = false;
  leadData: any = {
    productType: { label: 'Mortgage', value: 'mortgage' },
    product: { label: 'Refinance', value: 'refinance' },
    borrowerName: '',
    coBorrowerName: '',
    phoneNumber: '',
    emailAddress: '',
    currentAddress: '',
    propertyType: 'Single-family residence',
    estimatedPropertyValue: '$450,000',
    currentMortgages: 'Two',
    combinedMortgageBalance: '$250,000 (approx.)',
    loanPurpose: 'Replace variable interest-only loan with fixed-rate mortgage\nConsolidate two mortgages\nCash-out refinance ($25,000 requested)',
    currentInterestRate: '~6% (variable, interest-only)',
    loanType: 'Interest-only, variable rate',
    remainingBalance: '$250,000 (approx.)',
    currentLender: '',
    secondMortgageBalance: '',
    requestedLoanType: 'Fixed-rate mortgage',
    requestedLoanAmount: '~$275,000 (to cover $250,000 balance + $25,000 cash-out)',
    cashOutAmount: '$25,000',
    annualIncome: '',
    employmentStatus: '',
    creditScore: '',
    otherDebts: '',
    bankruptcyHistory: 'None in past 12 months (per transcript)',
    additionalNotes: 'Mrs. Martin is already speaking with another company about refinancing.\nExpressed clear preference for a fixed-rate mortgage rather than another interest-only option'
  };
  productTypes = [
    { label: 'Mortgage', value: 'mortgage' },
    { label: 'Auto Loan', value: 'auto' },
    { label: 'Personal Loan', value: 'personal' }
  ];
  products = [
    { label: 'Refinance', value: 'refinance' },
    { label: 'Purchase', value: 'purchase' },
    { label: 'Cash-Out', value: 'cashout' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private callSummaryService: CallSummaryService
  ) {}

  ngOnInit() {
    // Get call summary data from service
    this.callSummaryData = this.callSummaryService.getCallSummaryData();
    
    // Initialize audio total time with actual call duration
    this.audioTotalTime = this.callSummaryData.callDuration > 0 ? this.callSummaryData.callDuration : 299;
    
    // If no data available, redirect back
    if (!this.callSummaryData.customer) {
      console.warn('No call summary data available, redirecting...');
      this.goBack();
    }
  }

  ngAfterViewInit() {
    // Initialize audio element after view is initialized
    setTimeout(() => {
      if (this.audioPlayerRef && this.audioPlayerRef.nativeElement) {
        this.audioElement = this.audioPlayerRef.nativeElement;
        this.initializeAudio();
        // Load the audio file
        if (this.audioElement) {
          this.audioElement.load();
        }
      }
    }, 0);
  }

  ngOnDestroy() {
    // Clean up audio when component is destroyed
    this.stopAudioPlayback();
    if (this.audioUpdateInterval) {
      clearInterval(this.audioUpdateInterval);
    }
  }

  getCustomerName(): string {
    if (!this.callSummaryData.customer) {
      return 'Customer';
    }
    const customer = this.callSummaryData.customer;
    return customer.fullName || 
           (customer.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : '') || 
           'Customer';
  }

  getCustomerEmail(): string {
    if (!this.callSummaryData.customer) {
      return 'N/A';
    }
    return this.callSummaryData.customer.email || 'N/A';
  }

  formatCallDate(): string {
    if (!this.callSummaryData.callStartTime) {
      return 'Today';
    }
    const now = new Date();
    const callDate = new Date(this.callSummaryData.callStartTime);
    const isToday = callDate.toDateString() === now.toDateString();
    
    if (isToday) {
      const hours = callDate.getHours();
      const minutes = callDate.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      const displayHours = hours % 12 || 12;
      return `Today at ${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
    } else {
      return callDate.toLocaleDateString();
    }
  }

  formatCallTime(current: number, total: number): string {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    return `${formatTime(current)}/${formatTime(total)}`;
  }

  toggleAudioPlayback() {
    if (!this.audioElement) {
      // Initialize audio element if not already done
      setTimeout(() => {
        if (this.audioPlayerRef && this.audioPlayerRef.nativeElement) {
          this.audioElement = this.audioPlayerRef.nativeElement;
          this.initializeAudio();
          this.toggleAudioPlayback();
        }
      }, 0);
      return;
    }

    if (this.isAudioPlaying) {
      this.audioElement.pause();
      this.isAudioPlaying = false;
      if (this.audioUpdateInterval) {
        clearInterval(this.audioUpdateInterval);
        this.audioUpdateInterval = null;
      }
    } else {
      // Check if audio has a source
      if (!this.audioElement.src || this.audioElement.src === window.location.href) {
        // No audio source set - simulate playback for demo
        this.simulateAudioPlayback();
      } else {
        this.audioElement.play().then(() => {
          this.isAudioPlaying = true;
          this.startAudioUpdateInterval();
        }).catch((error) => {
          console.error('Error playing audio:', error);
          // Fallback to simulation if play fails
          this.simulateAudioPlayback();
        });
      }
    }
  }

  initializeAudio() {
    if (this.audioElement) {
      // Set the audio source to the call recording
      this.audioElement.src = '/assets/audio/MortgageCall.mp3';
      this.audioElement.volume = this.audioVolume;
      
      this.audioElement.addEventListener('loadedmetadata', () => {
        if (this.audioElement) {
          this.audioTotalTime = Math.floor(this.audioElement.duration);
          console.log('Audio loaded. Duration:', this.audioTotalTime, 'seconds');
        }
      });

      this.audioElement.addEventListener('error', (error) => {
        console.error('Error loading audio:', error);
      });
    }
  }

  simulateAudioPlayback() {
    // Simulate audio playback when no actual audio file is available
    this.isAudioPlaying = true;
    this.startAudioUpdateInterval();
  }

  startAudioUpdateInterval() {
    if (this.audioUpdateInterval) {
      clearInterval(this.audioUpdateInterval);
    }
    
    this.audioUpdateInterval = setInterval(() => {
      if (this.audioElement && !this.audioElement.paused) {
        // Real audio playback
        this.audioCurrentTime = Math.floor(this.audioElement.currentTime);
        
        // Update total time if it changes
        if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
          this.audioTotalTime = Math.floor(this.audioElement.duration);
        }
      } else if (this.isAudioPlaying && (!this.audioElement || !this.audioElement.src)) {
        // Simulated playback - increment time
        this.audioCurrentTime++;
        if (this.audioCurrentTime >= this.audioTotalTime) {
          this.audioCurrentTime = this.audioTotalTime;
          this.onAudioEnded();
        }
      } else if (this.audioElement) {
        // Update from audio element currentTime if paused
        this.audioCurrentTime = Math.floor(this.audioElement.currentTime);
      }
    }, 100); // Update every 100ms for smooth progress bar
  }

  onAudioLoaded() {
    if (this.audioElement) {
      this.audioTotalTime = Math.floor(this.audioElement.duration);
    }
  }

  onAudioTimeUpdate() {
    if (this.audioElement) {
      this.audioCurrentTime = Math.floor(this.audioElement.currentTime);
    }
  }

  onAudioEnded() {
    this.isAudioPlaying = false;
    this.audioCurrentTime = 0;
    if (this.audioUpdateInterval) {
      clearInterval(this.audioUpdateInterval);
      this.audioUpdateInterval = null;
    }
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
    }
  }

  seekAudio(event: MouseEvent) {
    if (!this.audioElement || !this.audioTotalTime) {
      // For simulated playback, allow seeking
      const progressBar = event.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * this.audioTotalTime;
      this.audioCurrentTime = Math.floor(newTime);
      return;
    }

    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * this.audioTotalTime;

    this.audioCurrentTime = Math.floor(newTime);
    this.audioElement.currentTime = newTime;
  }

  toggleAudioMute() {
    if (!this.audioElement) {
      return;
    }

    if (this.audioMuted || this.audioVolume === 0) {
      // Unmute
      this.audioMuted = false;
      this.audioVolume = 1.0;
      this.audioElement.volume = 1.0;
      this.audioElement.muted = false;
    } else {
      // Mute
      this.audioMuted = true;
      this.audioElement.muted = true;
    }
  }

  stopAudioPlayback() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.isAudioPlaying = false;
    this.audioCurrentTime = 0;
    if (this.audioUpdateInterval) {
      clearInterval(this.audioUpdateInterval);
      this.audioUpdateInterval = null;
    }
  }

  goBack() {
    const customerId = this.callSummaryData.customer?.customerId;
    if (customerId) {
      this.router.navigate(['/customers', customerId]);
    } else {
      this.router.navigate(['/customers']);
    }
  }

  saveCallSummary() {
    // TODO: Implement save functionality - send to backend
    console.log('Saving call summary:', {
      callId: this.callSummaryData.callId,
      customer: this.callSummaryData.customer,
      outcome: this.callOutcome,
      summary: this.callSummaryText,
      intent: this.callIntentText,
      comments: this.callCommentsText,
      duration: this.callSummaryData.callDuration
    });
    
    // Navigate back after saving
    this.goBack();
  }

  openWriteEmailDialog() {
    this.showWriteEmailDialog = true;
    this.selectedTone = 'trustworthy';
    this.updateEmailContent();
  }

  closeWriteEmailDialog() {
    this.showWriteEmailDialog = false;
  }

  selectTone(tone: 'trustworthy' | 'professional' | 'friendly' | 'default') {
    this.selectedTone = tone;
    this.updateEmailContent();
  }

  updateEmailContent() {
    const customer = this.callSummaryData.customer;
    // Extract last name for "Mrs. [LastName]" format, default to "Mrs. Martin" if not available
    const lastName = customer?.lastName || 'Martin';
    const customerName = `Mrs. ${lastName}`;

    const emailTemplates = {
      trustworthy: {
        subject: 'A Clear Path to Your Fixed-Rate Refinance',
        body: `Dear ${customerName},\n\nThank you for speaking with us today. I understand you'd like to move from a variable interest-only loan to a stable fixed-rate option while also accessing $25,000 in cash. That combination is absolutely possible, and our loan officer will tailor solutions that meet both your monthly budget and long-term peace of mind.\n\nWe'll provide you with competitive offers so you can confidently compare them against others. Please let me know a good time to continue the conversation.\n\nWarm regards,\n\nBrian Smith`
      },
      professional: {
        subject: 'Compare Our Best Rates Before You Decide',
        body: `Dear ${customerName},\n\nI appreciated our call earlier. Since you're seeking both a fixed-rate refinance and $25,000 cash out, we'd like to ensure you have our best terms in hand before committing elsewhere.\n\nOur team can outline rate options that not only eliminate your variable loan risk but also consolidate your mortgages. Reviewing these side-by-side with any competitor's offer ensures you don't miss out on meaningful savings.\n\nWhen would you like us to walk you through the details?\n\nSincerely,\n\nBrian Smith`
      },
      friendly: {
        subject: 'Lock in Your Fixed Rate Now',
        body: `Dear ${customerName},\n\nIt was great connecting with you today. Since you're interested in replacing your 6% variable loan with a stable fixed rate and pulling out $25,000, this is the perfect time to act. Rates are shifting quickly, and locking in sooner ensures you capture today's advantage.\n\nI can connect you directly with our loan officer to finalize options before market changes reduce the benefit. Could we schedule that follow-up this week?\n\nBest,\n\nBrian Smith`
      },
      default: {
        subject: 'Tailoring a Refinance Plan Around Your Goals',
        body: `Dear ${customerName},\n\nThank you for sharing your situation with me. You're looking for more stability through a fixed-rate mortgage, relief from your second loan, and $25,000 in cash. Those are meaningful goals, and we'd like to build a plan around them.\n\nThink of us as your partner in this process—we'll simplify the steps, present clear numbers, and ensure you feel confident every step of the way.\n\nWould you like me to set up a convenient time with our loan officer to review the options together?\n\nWarmly,\n\nBrian Smith`
      }
    };

    const template = emailTemplates[this.selectedTone];
    this.emailSubject = template.subject;
    this.emailBody = template.body;
  }

  sendEmail() {
    // TODO: Implement email sending functionality - send to backend
    console.log('Sending email:', {
      to: this.getCustomerName(),
      subject: this.emailSubject,
      body: this.emailBody,
      tone: this.selectedTone,
      customer: this.callSummaryData.customer
    });
    
    // Close dialog after sending
    this.closeWriteEmailDialog();
  }

  openCreateLeadDialog() {
    // Pre-populate lead data from customer and call summary
    const customer = this.callSummaryData.customer;
    const lastName = customer?.lastName || 'Martin';
    
    this.leadData.borrowerName = `Mrs. ${lastName}`;
    this.leadData.phoneNumber = this.callSummaryData.phoneNumber || '';
    this.leadData.emailAddress = customer?.email || '';
    this.leadData.currentAddress = 'Single-family residence (exact address not provided)';
    this.leadData.coBorrowerName = '';
    this.leadData.currentLender = '';
    this.leadData.secondMortgageBalance = '';
    this.leadData.annualIncome = '';
    this.leadData.employmentStatus = '';
    this.leadData.creditScore = '';
    this.leadData.otherDebts = '';
    
    this.showCreateLeadDialog = true;
  }

  closeCreateLeadDialog() {
    this.showCreateLeadDialog = false;
  }

  createLead() {
    // TODO: Implement lead creation functionality - send to backend
    console.log('Creating lead:', {
      customer: this.callSummaryData.customer,
      leadData: this.leadData
    });
    
    // Close dialog after creating
    this.closeCreateLeadDialog();
  }
}

