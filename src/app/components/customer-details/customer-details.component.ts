import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { CustomerService, Customer } from '../../services/customer.service';
import { CommunicationService } from '../../services/communication.service';
import { CallSummaryService } from '../../services/call-summary.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TagModule, ButtonModule, InputTextModule, InputTextareaModule, DialogModule, MenuModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen flex flex-col" style="height: calc(100vh - 3rem);">
      <!-- Customer Profile Header - Full Width -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6 flex-shrink-0">
        <div class="flex items-start justify-between gap-6">
          <div class="flex items-start gap-6 flex-1">
            <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {{ getInitials(customer) }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">OK to call</span>
              </div>
              <h1 class="text-2xl font-semibold text-gray-900 mb-2">{{ customer.fullName || (customer.firstName + ' ' + customer.lastName) }}</h1>
              <div class="flex items-center gap-2 flex-wrap text-sm">
                <span class="text-gray-500" style="font-size: 14px; line-height: 20px; color: #6b7280;">{{ customer.email || 'No email' }}</span>
                <span class="text-gray-300" style="color: #d1d5db;">|</span>
                <a *ngIf="isOkToCall(customer) && (customer.phone || customer.phn1Nbr)" 
                   (click)="makePhoneCall(customer, $event)" 
                   class="text-blue-600 hover:text-blue-800 underline cursor-pointer" 
                   style="font-size: 14px; line-height: 20px; color: #2563eb; text-decoration: underline;">{{ customer.phone || formatPhone(customer.phn1Nbr) }}</a>
                <span *ngIf="!isOkToCall(customer) || (!customer.phone && !customer.phn1Nbr)" 
                      class="text-gray-500" 
                      style="font-size: 14px; line-height: 20px; color: #6b7280;">{{ customer.phone || formatPhone(customer.phn1Nbr) || 'No phone' }}</span>
                <a href="#" class="text-gray-500 hover:text-gray-700 underline ml-1" style="font-size: 14px; line-height: 20px; color: #6b7280; text-decoration: underline;">View all details</a>
              </div>
            </div>
          </div>
              <div class="flex items-center gap-3 flex-shrink-0">
                <button *ngIf="isOkToCall(customer) && (customer.phone || customer.phn1Nbr)"
                        (click)="makePhoneCall(customer, $event)"
                        class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors flex items-center gap-2">
                  <i class="pi pi-phone"></i>
                  Call
                  <span class="text-xs bg-green-700 px-1.5 py-0.5 rounded-full">C</span>
                </button>
            <button (click)="logContactResult()" 
                    class="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors border border-gray-300 flex items-center gap-2">
              Log Contact Result
              <i class="pi pi-chevron-down text-xs"></i>
              <span class="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">L</span>
            </button>
            <button class="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors border border-gray-300 flex items-center gap-2">
              More
              <i class="pi pi-ellipsis-h"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-5 gap-6 flex-1 min-h-0">
        <!-- Main Content -->
        <div class="col-span-3 flex flex-col min-h-0">
          <!-- Product Interest Section with Tabs -->
          <div class="bg-white rounded-lg shadow-sm flex flex-col flex-1 min-h-0">
            <!-- Tabs -->
            <div class="border-b border-gray-200">
              <div class="flex">
                <button (click)="productTab = 'interested'"
                        [class.border-b-2]="productTab === 'interested'"
                        [class.border-blue-600]="productTab === 'interested'"
                        [class.text-blue-600]="productTab === 'interested'"
                        [class.text-gray-600]="productTab !== 'interested'"
                        class="px-6 py-3 text-sm font-medium transition-colors">
                  Interested Products
                </button>
                <button (click)="productTab = 'owned'"
                        [class.border-b-2]="productTab === 'owned'"
                        [class.border-blue-600]="productTab === 'owned'"
                        [class.text-blue-600]="productTab === 'owned'"
                        [class.text-gray-600]="productTab !== 'owned'"
                        class="px-6 py-3 text-sm font-medium transition-colors">
                  Owned Products
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="p-6 flex flex-col flex-1 min-h-0">
              <!-- Interested Products Tab -->
              <div *ngIf="productTab === 'interested'" class="flex flex-col flex-1 min-h-0">
                <!-- Current/Past Sub-tabs -->
                <div class="border-b border-gray-200 mb-4 flex-shrink-0">
                  <div class="flex">
                    <button (click)="interestedProductsTab = 'current'"
                            [class.border-b-2]="interestedProductsTab === 'current'"
                            [class.border-blue-600]="interestedProductsTab === 'current'"
                            [class.text-blue-600]="interestedProductsTab === 'current'"
                            [class.text-gray-600]="interestedProductsTab !== 'current'"
                            class="px-4 py-2 text-sm font-medium transition-colors">
                      Current
                    </button>
                    <button (click)="interestedProductsTab = 'past'"
                            [class.border-b-2]="interestedProductsTab === 'past'"
                            [class.border-blue-600]="interestedProductsTab === 'past'"
                            [class.text-blue-600]="interestedProductsTab === 'past'"
                            [class.text-gray-600]="interestedProductsTab !== 'past'"
                            class="px-4 py-2 text-sm font-medium transition-colors">
                      Past
                    </button>
                  </div>
                </div>

                <!-- Current Products Tab Content -->
                <div *ngIf="interestedProductsTab === 'current'" class="flex-1 overflow-y-auto product-scrollbar min-h-0">
                  <div class="space-y-3 pr-2">
                    <!-- Mortgage Product -->
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-home text-blue-600 text-xl"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900">Mortgage (30y Fixed Rate)</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">New</span>
                            </div>
                            <p class="text-sm text-gray-500 mb-1">Source: Website • Created: 8/15/2025</p>
                            <p class="text-sm text-green-600 font-medium mb-1">Call Today</p>
                            <p class="text-xs text-gray-600">Co-applicant: Jane Smith (406) 555-0120</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <button class="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
                            <i class="pi pi-phone text-xs"></i>
                            Call
                            <span class="text-xs bg-blue-700 px-1 rounded">C</span>
                          </button>
                          <button class="p-1.5 hover:bg-gray-100 rounded">
                            <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Checking Product -->
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-wallet text-blue-600 text-xl"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900">Checking (Basic Checking Plus)</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Follow Up</span>
                            </div>
                            <p class="text-sm text-gray-500 mb-1">Source: Phone • Created: 3/12/2025</p>
                            <p class="text-sm text-gray-600">Call in 5 days (3/12/2025)</p>
                          </div>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded">
                          <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Additional product for scrolling demo -->
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-credit-card text-blue-600 text-xl"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900">Credit Card</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">New</span>
                            </div>
                            <p class="text-sm text-gray-500 mb-1">Source: Website • Created: 8/20/2025</p>
                            <p class="text-sm text-green-600 font-medium mb-1">Call Today</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <button class="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
                            <i class="pi pi-phone text-xs"></i>
                            Call
                            <span class="text-xs bg-blue-700 px-1 rounded">C</span>
                          </button>
                          <button class="p-1.5 hover:bg-gray-100 rounded">
                            <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Another product for scrolling demo -->
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-home text-blue-600 text-xl"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900">Home Equity Loan</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Follow Up</span>
                            </div>
                            <p class="text-sm text-gray-500 mb-1">Source: Phone • Created: 3/15/2025</p>
                            <p class="text-sm text-gray-600">Call in 3 days (3/15/2025)</p>
                          </div>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded">
                          <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Past Products Tab Content -->
                <div *ngIf="interestedProductsTab === 'past'" class="flex-1 overflow-y-auto product-scrollbar min-h-0">
                  <div class="space-y-3 pr-2">
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors opacity-75">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-wallet text-gray-600 text-xl"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900">Checking (Basic Checking Plus)</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Closed Lost</span>
                            </div>
                            <p class="text-sm text-gray-500">Source: Phone • Created: 3/10/2025</p>
                          </div>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded">
                          <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors opacity-75">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-home text-gray-600 text-xl"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900">Mortgage (30y Fixed Rate)</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Closed Lost</span>
                            </div>
                            <p class="text-sm text-gray-500">Source: Phone • Created: 3/01/2024</p>
                          </div>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded">
                          <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                        </button>
                      </div>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors opacity-75">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-home text-gray-600 text-xl"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900">Mortgage (30y Fixed Rate)</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Closed Lost</span>
                            </div>
                            <p class="text-sm text-gray-500">Source: Phone • Created: 1/09/2024</p>
                          </div>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded">
                          <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                        </button>
                      </div>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors opacity-75">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-home text-gray-600 text-xl"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900">Mortgage (30y Fixed Rate)</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Closed Lost</span>
                            </div>
                            <p class="text-sm text-gray-500">Source: Phone • Created: 12/11/2023</p>
                          </div>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded">
                          <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Owned Products Tab -->
              <div *ngIf="productTab === 'owned'" class="flex flex-col flex-1 min-h-0">
                <div class="flex-1 overflow-y-auto product-scrollbar min-h-0">
                  <div class="space-y-3 pr-2">
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i class="pi pi-wallet text-gray-600 text-xl"></i>
                        </div>
                        <div class="flex-1">
                          <h4 class="font-semibold text-gray-900 mb-1">Checking</h4>
                          <p class="text-sm text-gray-500">Source: Phone • Created: 3/12/2025</p>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded">
                          <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar with Activity and All Details side by side -->
        <div class="col-span-2 col-start-4 grid grid-cols-2 gap-6 min-h-0">
          <!-- Activity Panel -->
          <div class="flex flex-col min-h-0">
            <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col flex-1 min-h-0">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Activity</h2>
              <div class="flex-1 overflow-y-auto activity-scrollbar min-h-0">
              <div class="space-y-6 pr-2">
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-3">Yesterday</p>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <i class="pi pi-phone text-green-500 mt-1"></i>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Phone Call</p>
                        <p class="text-xs text-gray-600 mt-0.5">The New Column indicates the user has been assigned a customer who applied for some new product.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-3">3 days ago (Nov 16, 2025)</p>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <i class="pi pi-send text-blue-500 mt-1"></i>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Email send</p>
                        <p class="text-xs text-gray-600 mt-0.5">Follow-up on load application.</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <i class="pi pi-inbox text-blue-500 mt-1"></i>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Email received</p>
                        <p class="text-xs text-gray-600 mt-0.5">Discuss refinancing options.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-3">4 days ago (Nov 15, 2025)</p>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <i class="pi pi-phone text-green-500 mt-1"></i>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Phone Call</p>
                        <p class="text-xs text-gray-600 mt-0.5">Time Sensitive indicates that one or more of the products have been flagged as needing an interaction outside of the normal contact strategy.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-3">19 days ago (Nov 1, 2025)</p>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <i class="pi pi-phone text-green-500 mt-1"></i>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Phone Call</p>
                        <p class="text-xs text-gray-600 mt-0.5">Discuss refinancing options.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Additional activities for scrolling demo -->
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-3">20 days ago (Oct 31, 2025)</p>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <i class="pi pi-send text-blue-500 mt-1"></i>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Email send</p>
                        <p class="text-xs text-gray-600 mt-0.5">Initial contact regarding mortgage options.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-3">25 days ago (Oct 26, 2025)</p>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <i class="pi pi-phone text-green-500 mt-1"></i>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Phone Call</p>
                        <p class="text-xs text-gray-600 mt-0.5">Welcome call for new customer.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-3">30 days ago (Oct 21, 2025)</p>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <i class="pi pi-inbox text-blue-500 mt-1"></i>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Email received</p>
                        <p class="text-xs text-gray-600 mt-0.5">Customer inquiry about checking account.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- All Details Panel -->
          <div class="flex flex-col min-h-0">
            <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col flex-1 min-h-0">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">All details</h2>
              <div class="space-y-4 flex-1 overflow-y-auto overflow-x-hidden activity-scrollbar min-h-0 pr-2">
                <div class="border-b border-gray-200 pb-2">
                  <p class="text-xs font-semibold text-gray-700 mb-1" style="font-size: 12px; font-weight: 600;">Name</p>
                  <p class="text-sm text-gray-900 break-words">{{ customer.fullName || (customer.firstName + ' ' + (customer.lastName || '')) }}</p>
                </div>
                <div class="border-b border-gray-200 pb-2">
                  <p class="text-xs font-semibold text-gray-700 mb-1" style="font-size: 12px; font-weight: 600;">Email</p>
                  <p class="text-sm text-gray-900 break-words">{{ customer.email || 'N/A' }}</p>
                </div>
                <div class="border-b border-gray-200 pb-2">
                  <p class="text-xs font-semibold text-gray-700 mb-1" style="font-size: 12px; font-weight: 600;">Phone</p>
                  <p class="text-sm text-gray-900 break-words">{{ customer.phone || formatPhone(customer.phn1Nbr) || 'N/A' }}</p>
                </div>
                <div class="border-b border-gray-200 pb-2">
                  <p class="text-xs font-semibold text-gray-700 mb-1" style="font-size: 12px; font-weight: 600;">Address</p>
                  <p class="text-sm text-gray-900 break-words">2972 Westheimer Rd. Santa Ana, Illinois 85486</p>
                </div>
                <div class="border-b border-gray-200 pb-2">
                  <p class="text-xs font-semibold text-gray-700 mb-1" style="font-size: 12px; font-weight: 600;">Time Zone</p>
                  <p class="text-sm text-gray-900 break-words">{{ customer.timeZone || 'EST' }}</p>
                </div>
                <div class="border-b border-gray-200 pb-2">
                  <p class="text-xs font-semibold text-gray-700 mb-1" style="font-size: 12px; font-weight: 600;">Call window</p>
                  <p class="text-sm text-gray-900 break-words">10:00am - 2:00pm</p>
                </div>
                <div class="border-b border-gray-200 pb-2">
                  <p class="text-xs font-semibold text-gray-700 mb-1" style="font-size: 12px; font-weight: 600;">Attempts</p>
                  <p class="text-sm text-gray-900 break-words">3/5</p>
                </div>
                <div class="border-b border-gray-200 pb-2">
                  <p class="text-xs font-semibold text-gray-700 mb-1" style="font-size: 12px; font-weight: 600;">Contact</p>
                  <p class="text-sm text-gray-900 break-words">{{ customer.methodPref || 'Phone' }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-700 mb-1" style="font-size: 12px; font-weight: 600;">Created</p>
                  <p class="text-sm text-gray-900 break-words">{{ formatDate(customer.createTs) || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Contact Results Modal (same as dashboard) -->
    <p-dialog [(visible)]="showLogContactResult" 
              [modal]="true" 
              [style]="{width: '600px', maxWidth: '90vw'}"
              [styleClass]="'log-contact-result-dialog'"
              [draggable]="false"
              [resizable]="false"
              [closable]="false">
      <ng-template pTemplate="header">
        <div class="flex items-center justify-between w-full px-6 py-4 border-b border-gray-200 bg-white">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-1" style="font-size: 20px; font-weight: 600; line-height: 28px;">Log Contact Results</h2>
            <div class="text-sm text-gray-600" style="font-size: 14px; line-height: 20px;">
              <div>{{ customer.fullName || (customer.firstName + ' ' + (customer.lastName || '')) }}</div>
              <div>{{ customer.email }}</div>
              <div>{{ customer.phone || formatPhone(customer.phn1Nbr) }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">Esc</span>
            <button (click)="closeLogContactResult()" 
                    class="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <i class="pi pi-times text-gray-700 text-lg"></i>
            </button>
          </div>
        </div>
      </ng-template>
      
      <div class="px-6 py-4 space-y-6">
        <!-- How did the contact occur? -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-3" style="font-size: 14px; font-weight: 500;">How did the contact occur?</label>
          <div class="flex gap-3">
            <button (click)="contactOccurred = 'outbound'"
                    [class.bg-blue-700]="contactOccurred === 'outbound'"
                    [class.text-white]="contactOccurred === 'outbound'"
                    [class.bg-gray-200]="contactOccurred !== 'outbound'"
                    [class.text-gray-700]="contactOccurred !== 'outbound'"
                    class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-arrow-right text-xs"></i>
              Outbound
            </button>
            <button (click)="contactOccurred = 'inbound'"
                    [class.bg-blue-700]="contactOccurred === 'inbound'"
                    [class.text-white]="contactOccurred === 'inbound'"
                    [class.bg-gray-200]="contactOccurred !== 'inbound'"
                    [class.text-gray-700]="contactOccurred !== 'inbound'"
                    class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-arrow-left text-xs"></i>
              Inbound
            </button>
          </div>
        </div>

        <!-- Contact methods -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-3" style="font-size: 14px; font-weight: 500;">Contact Methods</label>
          <div class="flex gap-3 flex-wrap">
            <button (click)="toggleContactMethod('phone')"
                    [class.bg-blue-700]="contactMethod.includes('phone')"
                    [class.text-white]="contactMethod.includes('phone')"
                    [class.bg-gray-200]="!contactMethod.includes('phone')"
                    [class.text-gray-700]="!contactMethod.includes('phone')"
                    class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-phone text-xs"></i>
              Phone
            </button>
            <button (click)="toggleContactMethod('text')"
                    [class.bg-blue-700]="contactMethod.includes('text')"
                    [class.text-white]="contactMethod.includes('text')"
                    [class.bg-gray-200]="!contactMethod.includes('text')"
                    [class.text-gray-700]="!contactMethod.includes('text')"
                    class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-comment text-xs"></i>
              Text
            </button>
            <button (click)="toggleContactMethod('email')"
                    [class.bg-blue-700]="contactMethod.includes('email')"
                    [class.text-white]="contactMethod.includes('email')"
                    [class.bg-gray-200]="!contactMethod.includes('email')"
                    [class.text-gray-700]="!contactMethod.includes('email')"
                    class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-envelope text-xs"></i>
              Email
            </button>
          </div>
        </div>

        <!-- Call Result (only show if contact method is phone) -->
        <div *ngIf="contactMethod.includes('phone')">
          <label class="block text-sm font-medium text-gray-900 mb-3" style="font-size: 14px; font-weight: 500;">Call Result</label>
          <div class="flex gap-3 flex-wrap">
            <button (click)="callResult = 'spoke'"
                    [class.bg-blue-700]="callResult === 'spoke'"
                    [class.text-white]="callResult === 'spoke'"
                    [class.bg-gray-200]="callResult !== 'spoke'"
                    [class.text-gray-700]="callResult !== 'spoke'"
                    class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-comments text-xs"></i>
              Spoke with Customer
            </button>
            <button (click)="callResult = 'left-message'"
                    [class.bg-blue-700]="callResult === 'left-message'"
                    [class.text-white]="callResult === 'left-message'"
                    [class.bg-gray-200]="callResult !== 'left-message'"
                    [class.text-gray-700]="callResult !== 'left-message'"
                    class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-question-circle text-xs"></i>
              Left Message
            </button>
            <button (click)="callResult = 'no-message'"
                    [class.bg-blue-700]="callResult === 'no-message'"
                    [class.text-white]="callResult === 'no-message'"
                    [class.bg-gray-200]="callResult !== 'no-message'"
                    [class.text-gray-700]="callResult !== 'no-message'"
                    class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                    style="font-size: 14px; font-weight: 500;">
              <i class="pi pi-times text-xs"></i>
              No Message Left
            </button>
          </div>
        </div>

        <!-- Products -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-3" style="font-size: 14px; font-weight: 500;">Products</label>
          <div class="space-y-3">
            <!-- Mortgage Product -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-home text-blue-600"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 mb-1" style="font-size: 14px; font-weight: 600;">Mortgage (30y Fixed Rate)</h4>
                  <p class="text-xs text-gray-500 mb-0.5">Source: Website</p>
                  <p class="text-xs text-gray-500 mb-0.5">Created: 8/15/2025</p>
                  <p class="text-xs text-gray-600 mt-1">Co-applicant: Jane Smith (406) 555-0120</p>
                </div>
                <div class="flex items-center gap-2">
                  <select class="text-xs border border-gray-300 rounded px-2 py-1 text-gray-700" style="font-size: 12px;">
                    <option>Select action...</option>
                    <option>Follow up</option>
                    <option>Mark as complete</option>
                  </select>
                  <button class="p-1.5 hover:bg-gray-100 rounded">
                    <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Checking Product -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-wallet text-blue-600"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 mb-1" style="font-size: 14px; font-weight: 600;">Checking (Basic Checking Plus)</h4>
                  <p class="text-xs text-gray-500 mb-0.5">Source: Phone</p>
                  <p class="text-xs text-gray-500">Created: 3/12/2025</p>
                </div>
                <div class="flex items-center gap-2">
                  <select class="text-xs border border-gray-300 rounded px-2 py-1 text-gray-700" style="font-size: 12px;">
                    <option>Select action...</option>
                    <option>Follow up</option>
                    <option>Mark as complete</option>
                  </select>
                  <button class="p-1.5 hover:bg-gray-100 rounded">
                    <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2" style="font-size: 14px; font-weight: 500;">Comments</label>
          <textarea [(ngModel)]="logContactComments"
                    placeholder="Write your comments here..."
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    style="font-size: 14px; min-height: 100px;"></textarea>
        </div>
      </div>

      <!-- Footer Buttons -->
      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          <button (click)="closeLogContactResult()" 
                  class="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
                  style="font-size: 14px; font-weight: 500;">
            <span class="text-xs text-gray-500">Esc</span>
            Cancel
          </button>
          <button (click)="saveLogContactResult()" 
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  style="font-size: 14px; font-weight: 500;">
            <i class="pi pi-check text-xs"></i>
            Done
          </button>
        </div>
      </ng-template>
    </p-dialog>

    <!-- Call Status Popup -->
    <p-dialog [(visible)]="showCallStatus" 
              [modal]="true" 
              [style]="{width: '400px', maxWidth: '90vw'}"
              [styleClass]="'call-status-dialog'"
              [draggable]="false"
              [resizable]="false"
              [closable]="false"
              *ngIf="currentCallCustomer">
      <ng-template pTemplate="header">
        <div class="flex items-center justify-between w-full px-6 py-4 border-b border-gray-200 bg-white">
          <h2 class="text-xl font-semibold text-gray-900" style="font-size: 20px; font-weight: 600; line-height: 28px;">Call Status</h2>
          <button (click)="closeCallStatus()" 
                  class="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <i class="pi pi-times text-gray-700 text-lg"></i>
          </button>
        </div>
      </ng-template>
      
      <div class="px-6 py-6">
        <!-- Customer Info -->
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="pi pi-user text-blue-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            {{ currentCallCustomer.fullName || (currentCallCustomer.firstName + ' ' + (currentCallCustomer.lastName || '')) }}
          </h3>
          <p class="text-sm text-gray-600">{{ currentCallPhone }}</p>
        </div>

        <!-- Call Status Indicator -->
        <div class="text-center mb-6">
          <!-- Initiated State -->
          <div *ngIf="callStatus === 'initiated'" class="space-y-3">
            <div class="flex items-center justify-center">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <i class="pi pi-phone text-blue-600 text-xl"></i>
              </div>
            </div>
            <p class="text-base font-medium text-gray-900">Call Initiated</p>
            <p class="text-sm text-gray-500">Initializing...</p>
          </div>

          <!-- Connecting State -->
          <div *ngIf="callStatus === 'connecting'" class="space-y-3">
            <div class="flex items-center justify-center">
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
                <i class="pi pi-phone text-yellow-600 text-xl"></i>
              </div>
            </div>
            <p class="text-base font-medium text-gray-900">Connecting</p>
            <p class="text-sm text-gray-500">Please wait...</p>
          </div>

          <!-- Connected State -->
          <div *ngIf="callStatus === 'connected'" class="space-y-3">
            <div class="flex items-center justify-center">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i class="pi pi-phone text-green-600 text-xl"></i>
              </div>
            </div>
            <p class="text-base font-medium text-gray-900">Call Connected</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCallDuration(callDuration) }}</p>
          </div>

          <!-- Disconnected State -->
          <div *ngIf="callStatus === 'disconnected'" class="space-y-3">
            <div class="flex items-center justify-center">
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <i class="pi pi-phone text-gray-600 text-xl"></i>
              </div>
            </div>
            <p class="text-base font-medium text-gray-900">Call Ended</p>
            <p class="text-sm text-gray-500">Duration: {{ formatCallDuration(callDuration) }}</p>
          </div>

          <!-- Failed State -->
          <div *ngIf="callStatus === 'failed'" class="space-y-3">
            <div class="flex items-center justify-center">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i class="pi pi-times text-red-600 text-xl"></i>
              </div>
            </div>
            <p class="text-base font-medium text-gray-900">Call Failed</p>
            <p class="text-sm text-gray-500">Unable to connect</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-2" *ngIf="callStatus === 'connected' || callStatus === 'connecting' || callStatus === 'initiated'">
          <!-- Audio ON Button -->
          <button (click)="toggleAudio()" 
                  [class.bg-blue-600]="!audioMuted"
                  [class.bg-gray-300]="audioMuted"
                  [class.text-white]="!audioMuted"
                  [class.text-gray-700]="audioMuted"
                  class="px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  style="font-size: 12px; font-weight: 500; padding: 6px 10px;">
            <i class="pi pi-microphone" style="font-size: 11px;"></i>
            <span>Audio ON</span>
          </button>
          
          <!-- Audio OFF Button -->
          <button (click)="toggleAudio()" 
                  [class.bg-blue-600]="audioMuted"
                  [class.bg-gray-300]="!audioMuted"
                  [class.text-white]="audioMuted"
                  [class.text-gray-700]="!audioMuted"
                  class="px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  style="font-size: 12px; font-weight: 500; padding: 6px 10px;">
            <div class="relative inline-flex items-center justify-center" style="width: 11px; height: 11px;">
              <i class="pi pi-microphone absolute" style="font-size: 11px;"></i>
              <svg class="absolute" style="width: 13px; height: 13px; top: -1px; left: -1px;" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="1.5" y1="11.5" x2="11.5" y2="1.5"></line>
              </svg>
            </div>
            <span>Audio OFF</span>
          </button>
          
          <!-- End Call Button -->
          <button (click)="endCall()" 
                  class="px-2.5 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  style="font-size: 12px; font-weight: 500; padding: 6px 10px;">
            <i class="pi pi-phone" style="font-size: 11px;"></i>
            <span>End Call</span>
          </button>
        </div>
      </div>
    </p-dialog>

    <!-- Background Audio for Call Status Popup -->
    <audio #backgroundAudio
           src="/assets/audio/MortgageCall.mp3"
           loop
           style="display: none;">
    </audio>
  `,
  styles: [`
    /* Custom scrollbar styling for products */
    .product-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .product-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .product-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }

    .product-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Firefox scrollbar for products */
    .product-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }

    /* Custom scrollbar styling for activity */
    .activity-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .activity-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .activity-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }

    .activity-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Firefox scrollbar for activity */
    .activity-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }
  `]
})
export class CustomerDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  customer: Customer = {};
  productTab: 'interested' | 'owned' = 'interested';
  interestedProductsTab: 'current' | 'past' = 'current';
  showLogContactResult = false;
  contactOccurred: 'outbound' | 'inbound' = 'outbound';
  contactMethod: ('phone' | 'text' | 'email')[] = [];
  callResult: 'spoke' | 'left-message' | 'no-message' | null = null;
  logContactComments = '';

  // Call status popup
  showCallStatus = false;
  callStatus: 'initiated' | 'connecting' | 'connected' | 'disconnected' | 'failed' = 'initiated';
  currentCallCustomer: Customer | null = null;
  currentCallPhone: string | null = null;
  currentCallId: string | null = null;
  callDuration = 0;
  callDurationInterval: any = null;
  callStatusSubscription: Subscription | null = null;
  callStartTime: Date | null = null;
  audioMuted = false;
  
  // Background audio for call status popup
  @ViewChild('backgroundAudio', { static: false }) backgroundAudioRef!: ElementRef<HTMLAudioElement>;
  backgroundAudioElement: HTMLAudioElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private communicationService: CommunicationService,
    private callSummaryService: CallSummaryService
  ) {}

  ngOnDestroy() {
    // Stop background audio on component destroy
    this.stopBackgroundAudio();
    // Clean up subscriptions and intervals
    if (this.callStatusSubscription) {
      this.callStatusSubscription.unsubscribe();
    }
    this.stopCallTimer();
  }

  ngAfterViewInit() {
    // Initialize background audio element reference
    setTimeout(() => {
      if (this.backgroundAudioRef && this.backgroundAudioRef.nativeElement) {
        this.backgroundAudioElement = this.backgroundAudioRef.nativeElement;
        // Set default volume (50%)
        this.backgroundAudioElement.volume = 0.5;
      }
    }, 0);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(id);
    }
  }

  loadCustomer(id: string) {
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customer = customer;
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.router.navigate(['/customers']);
      }
    });
  }

  getInitials(customer: Customer): string {
    const first = customer.firstName?.charAt(0) || '';
    const last = customer.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  }

  formatPhone(phone: number | undefined): string {
    if (!phone) return '-';
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `(${phoneStr.substring(0, 3)}) ${phoneStr.substring(3, 6)}-${phoneStr.substring(6)}`;
    }
    return phoneStr;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }

  logContactResult() {
    this.showLogContactResult = true;
    // Reset form values
    this.contactOccurred = 'outbound';
    this.contactMethod = [];
    this.callResult = null;
    this.logContactComments = '';
  }

  closeLogContactResult() {
    this.showLogContactResult = false;
    this.contactOccurred = 'outbound';
    this.contactMethod = [];
    this.callResult = null;
    this.logContactComments = '';
  }

  toggleContactMethod(method: 'phone' | 'text' | 'email') {
    const index = this.contactMethod.indexOf(method);
    if (index > -1) {
      this.contactMethod.splice(index, 1);
    } else {
      this.contactMethod.push(method);
    }
  }

  saveLogContactResult() {
    // TODO: Implement save functionality - send to backend
    console.log('Saving contact result:', {
      customer: this.customer,
      contactOccurred: this.contactOccurred,
      contactMethod: this.contactMethod,
      callResult: this.callResult,
      comments: this.logContactComments
    });
    
    // Close modal after saving
    this.closeLogContactResult();
  }

  // Call-related methods
  isOkToCall(customer: Customer): boolean {
    // Check if customer is OK to call
    // For now, assume all customers are OK to call
    // This can be enhanced to check a specific property on the customer object
    return true;
  }

  makePhoneCall(customer: Customer, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!this.isOkToCall(customer)) {
      return;
    }

    const phoneNumber = customer.phone || this.formatPhone(customer.phn1Nbr);
    if (!phoneNumber || phoneNumber === 'N/A') {
      return;
    }

    const customerName = customer.fullName || 
                        (customer.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : '') ||
                        'Customer';

    this.communicationService.initiateOutboundCall({
      phoneNumber: phoneNumber.replace(/[^0-9+]/g, ''), // Clean phone number
      customerId: customer.customerId || undefined,
      customerName: customerName
    }).subscribe({
      next: (response) => {
        if (response.status === 'initiated' || response.status === 'success') {
          // Show call status popup
          this.currentCallCustomer = customer;
          this.currentCallPhone = phoneNumber;
          this.currentCallId = response.callId || null;
          this.callStatus = 'initiated';
          this.callDuration = 0;
          this.callStartTime = new Date();
          this.showCallStatus = true;
          
          console.log('Call initiated, callId:', this.currentCallId);
          
          // Start polling for call status updates from ACS events
          if (this.currentCallId) {
            this.startCallStatusPolling(this.currentCallId);
          } else {
            console.warn('No callId returned from backend - cannot poll for status');
            // If no callId, simulate progression
            this.simulateCallProgression();
          }
        }
      },
      error: (error) => {
        console.error('Error initiating call:', error);
      }
    });
  }

  startCallStatusPolling(callId: string) {
    // Stop any existing polling
    if (this.callStatusSubscription) {
      this.callStatusSubscription.unsubscribe();
    }
    
    console.log('Starting call status polling for callId:', callId);
    
    // Always start fallback progression timers (they work even if polling fails)
    this.startFallbackProgression(callId);
    
    // Poll for call status updates every second
    this.callStatusSubscription = this.communicationService.pollCallStatus(callId).subscribe({
      next: (status) => {
        // Stop polling immediately if call is disconnected or failed
        if (status && (status.status === 'disconnected' || status.status === 'failed' || status.status === 'error')) {
          console.log('Call ended with status:', status.status, '- stopping polling immediately');
          if (this.callStatusSubscription) {
            this.callStatusSubscription.unsubscribe();
            this.callStatusSubscription = null;
          }
          // Process the final status update
          this.updateCallStatusFromEvent(status);
          return;
        }
        
        if (status && status.status) {
          console.log('Received call status update from backend:', status);
          this.updateCallStatusFromEvent(status);
        } else {
          console.warn('Received invalid status update:', status);
        }
      },
      error: (error) => {
        console.error('Error polling call status:', error);
        // Fallback progression will handle status updates if polling fails
      },
      complete: () => {
        console.log('Call status polling completed');
        // Ensure subscription is cleaned up
        if (this.callStatusSubscription) {
          this.callStatusSubscription = null;
        }
      }
    });
  }
  
  simulateCallProgression() {
    // Simulate call progression when no callId is available
    console.log('Simulating call progression (no callId)');
    setTimeout(() => {
      if (this.callStatus === 'initiated' && this.showCallStatus) {
        this.callStatus = 'connecting';
      }
    }, 2000);
    
    setTimeout(() => {
      if (this.callStatus === 'connecting' && this.showCallStatus) {
        this.callStatus = 'connected';
        this.startCallTimer();
        this.startBackgroundAudio(); // Start background audio when connected
      }
    }, 7000);
  }
  
  startFallbackProgression(callId: string) {
    // Fallback: If still on "initiated" after 3 seconds, move to "connecting"
    setTimeout(() => {
      if (this.callStatus === 'initiated' && this.showCallStatus && this.currentCallId === callId) {
        console.log('Fallback progression: Moving to connecting state');
        this.callStatus = 'connecting';
      }
    }, 3000);
    
    // Fallback: If still on "connecting" after 8 more seconds (11 total), move to "connected"
    setTimeout(() => {
      if ((this.callStatus === 'connecting' || this.callStatus === 'initiated') && 
          this.showCallStatus && 
          this.currentCallId === callId) {
        console.log('Fallback progression: Moving to connected state');
        this.callStatus = 'connected';
        this.startCallTimer();
        this.startBackgroundAudio(); // Start background audio when connected
      }
    }, 11000);
  }
  
  updateCallStatusFromEvent(status: any) {
    if (!this.showCallStatus) {
      return;
    }
    
    // Don't process updates if call is already disconnected or failed
    if (this.callStatus === 'disconnected' || this.callStatus === 'failed') {
      console.log('Ignoring status update - call already ended:', this.callStatus);
      return;
    }
    
    if (!status) {
      console.warn('Received null/undefined status update');
      return;
    }
    
    console.log('=== Updating call status from backend ===');
    console.log('Status object:', JSON.stringify(status, null, 2));
    
    // Map backend status to frontend status
    const backendStatus = (status.status || '').toLowerCase().trim();
    const previousStatus = this.callStatus;
    
    console.log('Backend status:', `"${backendStatus}"`, '| Current frontend status:', `"${previousStatus}"`);
    
    let newStatus: 'initiated' | 'connecting' | 'connected' | 'disconnected' | 'failed' = previousStatus;
    let statusChanged = false;
    
    switch (backendStatus) {
      case 'initiated':
        if (previousStatus !== 'initiated') {
          newStatus = 'initiated';
          statusChanged = true;
        }
        break;
      case 'connecting':
        newStatus = 'connecting';
        statusChanged = true;
        break;
      case 'connected':
        newStatus = 'connected';
        statusChanged = true;
        if (previousStatus !== 'connected') {
          // Just connected - start the timer and background audio
          console.log('Call connected - starting timer');
          this.startCallTimer();
          this.startBackgroundAudio(); // Start background audio when connected
        }
        // Update duration from backend
        if (status.duration !== undefined && status.duration !== null) {
          this.callDuration = Math.max(0, status.duration);
        }
        break;
      case 'disconnected':
        newStatus = 'disconnected';
        statusChanged = true;
        this.stopCallTimer();
        this.stopBackgroundAudio(); // Stop background audio when disconnected
        // Update duration from backend
        if (status.duration !== undefined && status.duration !== null) {
          this.callDuration = Math.max(0, status.duration);
        }
        // Show Call Summary after a brief delay
        setTimeout(() => {
          if (this.showCallStatus && this.callStatus === 'disconnected') {
            console.log('Showing call summary after disconnect');
            this.showCallSummaryScreen();
          }
        }, 1000);
        break;
      case 'failed':
      case 'error':
        newStatus = 'failed';
        statusChanged = true;
        this.stopCallTimer();
        this.stopBackgroundAudio(); // Stop background audio when failed
        // Show Call Summary after a brief delay even for failed calls
        setTimeout(() => {
          if (this.showCallStatus && this.callStatus === 'failed') {
            console.log('Showing call summary after failure');
            this.showCallSummaryScreen();
          }
        }, 1000);
        break;
      default:
        console.warn('Unknown backend status:', backendStatus);
        break;
    }
    
    if (statusChanged) {
      console.log('Status changed from', previousStatus, 'to', newStatus);
      this.callStatus = newStatus;
    } else {
      console.log('Status unchanged:', newStatus);
    }
  }
  
  startCallTimer() {
    if (this.callDurationInterval) {
      clearInterval(this.callDurationInterval);
    }
    this.callDurationInterval = setInterval(() => {
      if (this.showCallStatus && this.callStatus === 'connected') {
        this.callDuration++;
      } else {
        this.stopCallTimer();
      }
    }, 1000);
  }
  
  stopCallTimer() {
    if (this.callDurationInterval) {
      clearInterval(this.callDurationInterval);
      this.callDurationInterval = null;
    }
  }
  
  formatCallDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  endCall() {
    if (!this.currentCallId) {
      console.warn('No call ID available - cannot end call');
      this.closeCallStatus();
      return;
    }
    
    // Don't allow multiple end call attempts
    if (this.callStatus === 'disconnected' || this.callStatus === 'failed') {
      console.log('Call already ended - closing popup');
      this.closeCallStatus();
      return;
    }
    
    console.log('Ending call with callId:', this.currentCallId);
    
    // Stop polling immediately to prevent further status updates
    if (this.callStatusSubscription) {
      this.callStatusSubscription.unsubscribe();
      this.callStatusSubscription = null;
      console.log('Stopped polling before ending call');
    }
    
    // Stop timer
    this.stopCallTimer();
    
    // Stop background audio
    this.stopBackgroundAudio();
    
    // Update UI to show disconnected state immediately
    const previousStatus = this.callStatus;
    this.callStatus = 'disconnected';
    
    // Call backend API to actually terminate the call
    this.communicationService.endCall(this.currentCallId).subscribe({
      next: (response) => {
        console.log('Call ended successfully:', response);
        // Status already set to disconnected above
        // Show Call Summary after a brief delay
        setTimeout(() => {
          if (this.showCallStatus) {
            this.showCallSummaryScreen();
          }
        }, 1000);
      },
      error: (error) => {
        console.error('Error ending call:', error);
        // Keep status as disconnected since user clicked end call
        // Show Call Summary anyway
        setTimeout(() => {
          if (this.showCallStatus) {
            this.showCallSummaryScreen();
          }
        }, 1000);
      }
    });
  }
  
  toggleAudio() {
    this.audioMuted = !this.audioMuted;
    // TODO: Implement actual audio mute/unmute functionality with ACS
  }

  closeCallStatus() {
    this.showCallStatus = false;
    this.callStatus = 'initiated';
    this.currentCallCustomer = null;
    this.currentCallPhone = null;
    this.currentCallId = null;
    this.callDuration = 0;
    this.callStartTime = null;
    this.audioMuted = false;
    this.stopCallTimer();
    
    // Stop background audio
    this.stopBackgroundAudio();
    
    // Stop polling for status updates
    if (this.callStatusSubscription) {
      this.callStatusSubscription.unsubscribe();
      this.callStatusSubscription = null;
    }
  }

  startBackgroundAudio() {
    if (this.backgroundAudioElement) {
      try {
        // Set volume if not already set
        if (this.backgroundAudioElement.volume === 1) {
          this.backgroundAudioElement.volume = 0.5; // 50% volume
        }
        // Play the background audio
        const playPromise = this.backgroundAudioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Error playing background audio:', error);
            // Auto-play was prevented or audio failed to load
          });
        }
      } catch (error) {
        console.warn('Error starting background audio:', error);
      }
    } else {
      // Try to get the element reference if not already set
      if (this.backgroundAudioRef && this.backgroundAudioRef.nativeElement) {
        this.backgroundAudioElement = this.backgroundAudioRef.nativeElement;
        this.backgroundAudioElement.volume = 0.5;
        const playPromise = this.backgroundAudioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Error playing background audio:', error);
          });
        }
      }
    }
  }

  stopBackgroundAudio() {
    if (this.backgroundAudioElement) {
      try {
        this.backgroundAudioElement.pause();
        this.backgroundAudioElement.currentTime = 0; // Reset to beginning
      } catch (error) {
        console.warn('Error stopping background audio:', error);
      }
    } else if (this.backgroundAudioRef && this.backgroundAudioRef.nativeElement) {
      try {
        this.backgroundAudioElement = this.backgroundAudioRef.nativeElement;
        this.backgroundAudioElement.pause();
        this.backgroundAudioElement.currentTime = 0;
      } catch (error) {
        console.warn('Error stopping background audio:', error);
      }
    }
  }
  
  showCallSummaryScreen() {
    // Close call status popup
    this.showCallStatus = false;
    
    // Store call summary data in service
    if (this.currentCallCustomer) {
      this.callSummaryService.setCallSummaryData({
        customer: this.currentCallCustomer,
        phoneNumber: this.currentCallPhone,
        callId: this.currentCallId,
        callDuration: this.callDuration,
        callStartTime: this.callStartTime
      });
      
      // Navigate to call summary page
      const customerId = this.currentCallCustomer.customerId;
      if (customerId) {
        this.router.navigate(['/customers', customerId, 'call-summary']);
      } else {
        console.error('No customer ID available for navigation');
        this.closeCallStatus();
      }
    } else {
      console.error('No customer data available for call summary');
      this.closeCallStatus();
    }
  }
  
}
