import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TagModule, ButtonModule, InputTextModule, DialogModule, MenuModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Top Right Action Buttons -->
      <div class="flex justify-end gap-3 mb-6">
        <button (click)="logContactResult()" 
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
          Log Contact Result
          <span class="text-xs bg-blue-700 px-1.5 py-0.5 rounded">L</span>
        </button>
        <button class="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors border border-gray-300 flex items-center gap-2">
          Options
          <span class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">O</span>
        </button>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="col-span-2 space-y-6">
          <!-- Customer Profile Header -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-start gap-6">
              <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {{ getInitials(customer) }}
              </div>
              <div class="flex-1">
                <h1 class="text-2xl font-semibold text-gray-900 mb-3">{{ customer.fullName || (customer.firstName + ' ' + customer.lastName) }}</h1>
                <div class="space-y-2 text-gray-600">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-envelope text-gray-500"></i>
                    <span>{{ customer.email || 'No email' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-phone text-gray-500"></i>
                    <span>{{ customer.phone || formatPhone(customer.phn1Nbr) || 'No phone' }}</span>
                  </div>
                </div>
                <a href="#" class="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">View all details</a>
              </div>
            </div>
          </div>

          <!-- Product Interest Section with Tabs -->
          <div class="bg-white rounded-lg shadow-sm">
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
            <div class="p-6">
              <!-- Interested Products Tab -->
              <div *ngIf="productTab === 'interested'">
                <!-- Current/Past Sub-tabs -->
                <div class="border-b border-gray-200 mb-4">
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
                <div *ngIf="interestedProductsTab === 'current'" class="max-h-[350px] overflow-y-auto product-scrollbar">
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
                <div *ngIf="interestedProductsTab === 'past'" class="max-h-[350px] overflow-y-auto product-scrollbar">
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
              <div *ngIf="productTab === 'owned'">
                <div class="max-h-[450px] overflow-y-auto product-scrollbar">
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

        <!-- Activity Panel -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
          <div class="max-h-[600px] overflow-y-auto activity-scrollbar">
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
export class CustomerDetailsComponent implements OnInit {
  customer: Customer = {};
  productTab: 'interested' | 'owned' = 'interested';
  interestedProductsTab: 'current' | 'past' = 'current';
  showLogContactResult = false;
  contactOccurred: 'outbound' | 'inbound' = 'outbound';
  contactMethod: ('phone' | 'text' | 'email')[] = [];
  callResult: 'spoke' | 'left-message' | 'no-message' | null = null;
  logContactComments = '';

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router
  ) {}

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
}
