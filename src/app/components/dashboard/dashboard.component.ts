import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { DashboardService } from '../../services/dashboard.service';
import { CustomerService, Customer } from '../../services/customer.service';
import { CommunicationService } from '../../services/communication.service';
import { CallSummaryService } from '../../services/call-summary.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DialogModule, ButtonModule, InputTextModule, MessageModule, TagModule, MenuModule],
  template: `
    <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2">
            <i class="pi pi-sun text-yellow-500 text-xl"></i>
            <h1 class="text-2xl font-semibold">Good morning! Welcome back, Jane.</h1>
          </div>
          <div class="text-sm text-gray-600 flex items-center gap-1">
            <i class="pi pi-cloud text-gray-500"></i>
            <span>CRM Sync: 5min ago</span>
          </div>
        </div>

        <!-- Stats Cards - Draggable (Constrained to Home Page Area) -->
        <div class="relative mb-6" 
             style="height: 160px;"
             #cardsContainer>
          <!-- Customers Card -->
          <div class="bg-white rounded-lg p-6 shadow-sm cursor-move absolute"
               style="width: 256px; height: 160px;"
               [style.left.px]="cardPositions.customers.x"
               [style.top.px]="cardPositions.customers.y"
               (mousedown)="startCardDrag($event, 'customers')"
               [class.dragging]="draggingCard === 'customers'">
            <div class="flex items-center justify-between mb-2">
              <i class="pi pi-users text-green-500 text-2xl"></i>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">30d</span>
            </div>
            <p class="text-sm text-gray-600 mb-1">Customers</p>
            <p class="text-2xl font-bold">{{ stats.customers }}</p>
            <p class="text-xs text-green-600 mt-2 flex items-center gap-1" *ngIf="stats.customerGrowth > 0">
              <i class="pi pi-arrow-up text-xs"></i>
              +{{ stats.customerGrowth | number:'1.1-1' }}%
            </p>
            <p class="text-xs text-gray-500 mt-2" *ngIf="stats.customerGrowth === 0">-0.0%</p>
          </div>
          
          <!-- Applications Card -->
          <div class="bg-white rounded-lg p-6 shadow-sm cursor-move absolute"
               style="width: 256px; height: 160px;"
               [style.left.px]="cardPositions.applications.x"
               [style.top.px]="cardPositions.applications.y"
               (mousedown)="startCardDrag($event, 'applications')"
               [class.dragging]="draggingCard === 'applications'">
            <div class="flex items-center justify-between mb-2">
              <i class="pi pi-file text-blue-500 text-2xl"></i>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">30d</span>
            </div>
            <p class="text-sm text-gray-600 mb-1">Applications</p>
            <p class="text-2xl font-bold">{{ stats.applications }}</p>
            <p class="text-xs text-gray-500 mt-2">-0.0%</p>
          </div>
          
          <!-- Business won Card -->
          <div class="bg-white rounded-lg p-6 shadow-sm cursor-move absolute"
               style="width: 256px; height: 160px;"
               [style.left.px]="cardPositions.businessWon.x"
               [style.top.px]="cardPositions.businessWon.y"
               (mousedown)="startCardDrag($event, 'businessWon')"
               [class.dragging]="draggingCard === 'businessWon'">
            <div class="flex items-center justify-between mb-2">
              <i class="pi pi-dollar text-green-500 text-2xl"></i>
              <span></span>
            </div>
            <p class="text-sm text-gray-600 mb-1">Business won</p>
            <p class="text-2xl font-bold">{{ stats.businessWon }}</p>
            <p class="text-xs text-green-600 mt-2 flex items-center gap-1" *ngIf="stats.businessGrowth > 0">
              <i class="pi pi-arrow-up text-xs"></i>
              +{{ stats.businessGrowth | number:'1.1-1' }}%
            </p>
            <p class="text-xs text-gray-500 mt-2" *ngIf="stats.businessGrowth === 0"></p>
          </div>
          
          <!-- Win rate Card -->
          <div class="bg-white rounded-lg p-6 shadow-sm cursor-move absolute"
               style="width: 256px; height: 160px;"
               [style.left.px]="cardPositions.winRate.x"
               [style.top.px]="cardPositions.winRate.y"
               (mousedown)="startCardDrag($event, 'winRate')"
               [class.dragging]="draggingCard === 'winRate'">
            <div class="flex items-center justify-between mb-2">
              <span></span>
              <span></span>
            </div>
            <p class="text-sm text-gray-600 mb-1">Win rate</p>
            <p class="text-2xl font-bold">{{ stats.winRate }}</p>
            <p class="text-xs text-yellow-600 mt-2 flex items-center gap-1" *ngIf="stats.winRateChange < 0">
              <i class="pi pi-arrow-down text-xs"></i>
              {{ stats.winRateChange | number:'1.1-1' }}%
            </p>
            <p class="text-xs text-gray-500 mt-2" *ngIf="stats.winRateChange >= 0"></p>
          </div>
        </div>

        <!-- Today's Customers Section -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <!-- Title and Toggle Buttons -->
          <div class="border-b border-gray-200 px-4 pt-4 pb-0">
            <div class="flex items-center justify-between mb-0">
              <div class="flex items-center gap-3">
                <h2 class="text-sm font-semibold text-gray-900" style="font-size: 14px; font-weight: 600;">Today's Customers</h2>
                <div class="flex">
                  <button class="px-3 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5" 
                          [class.bg-blue-50]="viewMode === 'todo'"
                          [class.text-blue-900]="viewMode === 'todo'"
                          [class.border-blue-900]="viewMode === 'todo'"
                          [class.text-gray-600]="viewMode !== 'todo'"
                          [class.border-transparent]="viewMode !== 'todo'"
                          [class.hover:bg-gray-50]="viewMode !== 'todo'"
                          style="font-size: 13px; font-weight: 500;"
                          (click)="viewMode = 'todo'; applyFilters()">
                    <i class="pi pi-list text-xs" [class.text-blue-900]="viewMode === 'todo'" [class.text-gray-500]="viewMode !== 'todo'"></i>
                    To do ({{ getTodoCount() }})
                  </button>
                  <button class="px-3 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5"
                          [class.bg-blue-50]="viewMode === 'done'"
                          [class.text-blue-900]="viewMode === 'done'"
                          [class.border-blue-900]="viewMode === 'done'"
                          [class.text-gray-600]="viewMode !== 'done'"
                          [class.border-transparent]="viewMode !== 'done'"
                          [class.hover:bg-gray-50]="viewMode !== 'done'"
                          style="font-size: 13px; font-weight: 500;"
                          (click)="viewMode = 'done'; applyFilters()">
                    <i class="pi pi-check text-xs" [class.text-blue-900]="viewMode === 'done'" [class.text-gray-500]="viewMode !== 'done'"></i>
                    Done ({{ getDoneCount() }})
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <!-- Search Bar -->
                <div class="relative flex items-center bg-white border border-gray-200 rounded-md px-3 py-1.5" style="min-width: 200px; max-width: 300px;">
                  <input type="text" 
                         [(ngModel)]="searchQuery"
                         (input)="applyFilters()"
                         placeholder="Search..."
                         class="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-0 outline-none focus:ring-0 focus:outline-none">
                  <div class="w-px h-4 bg-gray-300 mx-2"></div>
                  <i class="pi pi-search text-gray-400 text-sm cursor-pointer"></i>
                </div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <div class="relative inline-block w-11 h-6">
                    <input type="checkbox" 
                           [(ngModel)]="okToCall" 
                           (change)="applyFilters()" 
                           class="sr-only peer"
                           id="okToCall">
                    <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 transition-colors duration-200 ease-in-out"></div>
                    <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></div>
                  </div>
                  <span class="text-xs text-gray-600 whitespace-nowrap" style="font-size: 12px; font-weight: 400;">OK to call</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <div class="relative inline-block w-11 h-6">
                    <input type="checkbox" 
                           [(ngModel)]="timeSensitive" 
                           (change)="applyFilters()" 
                           class="sr-only peer"
                           id="timeSensitive">
                    <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 transition-colors duration-200 ease-in-out"></div>
                    <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></div>
                  </div>
                  <span class="text-xs text-gray-600 whitespace-nowrap" style="font-size: 12px; font-weight: 400;">Time sensitive</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Call Status Message -->
          <div *ngIf="callMessage" class="px-4 pt-2">
            <p-message [severity]="callMessage.severity" [text]="callMessage.message"></p-message>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <div class="relative max-h-[430px] overflow-y-auto" style="scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9;">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors bg-gray-50"
                        (click)="sortByCustomerName()">
                      <div class="flex items-center gap-1">
                        <span>Customer</span>
                        <i class="pi text-xs" 
                           [class.pi-sort]="customerSortOrder === null"
                           [class.pi-sort-up]="customerSortOrder === 'asc'"
                           [class.pi-sort-down]="customerSortOrder === 'desc'"
                           [class.text-blue-600]="customerSortOrder !== null"
                           [class.text-gray-400]="customerSortOrder === null"></i>
                      </div>
                    </th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">Phone</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">New prod.</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">In progress</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">Best time</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">Time sensitive</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50">Contact by</th>
                  </tr>
                </thead>
                <tbody>
                <tr *ngFor="let customer of filteredTodayCustomers" 
                    (click)="viewCustomer(customer)"
                    [class.bg-blue-50]="selectedCustomer?.customerId === customer.customerId"
                    class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <div *ngIf="customer.phone || customer.phn1Nbr" class="relative inline-flex items-center justify-center w-5 h-5">
                        <!-- Phone icon with checkmark when Contact by is Phone -->
                        <ng-container *ngIf="getContactMethod(customer) === 'Phone'">
                          <i class="pi pi-phone text-xs text-green-400" 
                             style="filter: drop-shadow(0 0 3px rgba(74, 222, 128, 0.4)); color: #4ade80;"></i>
                          <i class="pi pi-check text-[9px] absolute -top-0.5 right-0" 
                             style="color: #4ade80; font-weight: 900; text-shadow: 0 0 2px rgba(74, 222, 128, 0.5);"></i>
                        </ng-container>
                        <!-- Phone icon with strike-through when Contact by is Email -->
                        <ng-container *ngIf="getContactMethod(customer) === 'Email'">
                          <div class="relative inline-flex items-center justify-center">
                            <i class="pi pi-phone text-xs" style="color: #ec4899;"></i>
                            <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 12 12">
                              <line x1="0.5" y1="0.5" x2="11.5" y2="11.5" 
                                    stroke="#ec4899" 
                                    stroke-width="2" 
                                    stroke-linecap="round"/>
                            </svg>
                          </div>
                        </ng-container>
                        <!-- Regular gray phone icon for other cases -->
                        <i *ngIf="getContactMethod(customer) !== 'Phone' && getContactMethod(customer) !== 'Email'" 
                           class="pi pi-phone text-xs text-gray-500"></i>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer" 
                           (click)="openCustomerDetails(customer, $event)">{{ customer.fullName || (customer.firstName + ' ' + (customer.lastName || '')) }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ customer.email || '' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm">
                    <button *ngIf="customer.phone || customer.phn1Nbr" 
                            (click)="makePhoneCall(customer, $event)"
                            [disabled]="callingPhone === (customer.phone || formatPhone(customer.phn1Nbr))"
                            class="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            [class.animate-pulse]="callingPhone === (customer.phone || formatPhone(customer.phn1Nbr))">
                      <i class="pi" 
                         [class.pi-phone]="callingPhone !== (customer.phone || formatPhone(customer.phn1Nbr))"
                         [class.pi-spin]="callingPhone === (customer.phone || formatPhone(customer.phn1Nbr))"
                         [class.pi-spinner]="callingPhone === (customer.phone || formatPhone(customer.phn1Nbr))"
                         [class.text-xs]="true"></i>
                      {{ customer.phone || formatPhone(customer.phn1Nbr) }}
                    </button>
                    <span *ngIf="!customer.phone && !customer.phn1Nbr" class="text-gray-400">N/A</span>
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900">
                    {{ getNewProducts(customer) }}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900">
                    {{ getInProgress(customer) }}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900">
                    {{ getBestTime(customer) }}
                  </td>
                  <td class="py-3 px-4">
                    <span *ngIf="getTimeSensitiveTag(customer)" class="inline-block text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-medium">
                      {{ getTimeSensitiveTag(customer) }}
                    </span>
                    <span *ngIf="!getTimeSensitiveTag(customer)" class="text-sm text-gray-400">-</span>
                  </td>
                  <td class="py-3 px-4 text-sm">
                    <span class="text-gray-900">{{ getContactMethod(customer) }}</span>
                  </td>
                </tr>
                <tr *ngIf="filteredTodayCustomers.length === 0">
                  <td colspan="7" class="py-8 px-4 text-center text-gray-500 text-sm">
                    No customers found
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>

      </div>

      <!-- Customer Details Modal -->
      <p-dialog [(visible)]="showCustomerDetails" 
                [modal]="true" 
                [style]="{width: '90vw', maxWidth: '1200px', height: '90vh'}"
                [styleClass]="'customer-details-dialog'"
                [draggable]="false"
                [resizable]="false"
                [closable]="false">
        <ng-template pTemplate="header">
          <div class="flex items-center justify-between w-full px-6 py-4 border-b border-gray-200 bg-white">
            <div class="flex items-center gap-4">
              <button (click)="navigateCustomer('prev')" 
                      [disabled]="!canNavigatePrev()"
                      class="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <i class="pi pi-chevron-left text-gray-700 text-base"></i>
              </button>
              <button (click)="navigateCustomer('next')" 
                      [disabled]="!canNavigateNext()"
                      class="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <i class="pi pi-chevron-right text-gray-700 text-base"></i>
              </button>
              <h2 class="text-2xl font-semibold text-gray-900" style="font-size: 24px; font-weight: 600; line-height: 32px;">
                {{ selectedCustomerForDetails?.fullName || (selectedCustomerForDetails?.firstName + ' ' + (selectedCustomerForDetails?.lastName || '')) }}
              </h2>
            </div>
            <button (click)="closeCustomerDetails()" 
                    class="p-2 hover:bg-gray-100 rounded transition-colors">
              <i class="pi pi-times text-gray-700 text-lg"></i>
            </button>
          </div>
        </ng-template>
        
        <div class="flex flex-col h-full overflow-hidden" *ngIf="selectedCustomerForDetails">
          <!-- Call Status Message in Modal -->
          <div *ngIf="callMessageModal" class="px-6 pt-3">
            <p-message [severity]="callMessageModal.severity" [text]="callMessageModal.message"></p-message>
          </div>
          
          <!-- Status Bar -->
          <div class="px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-4 flex-wrap">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700" style="font-size: 12px; font-weight: 500;">
              OK to call
            </span>
            <i class="pi pi-phone text-gray-700" style="font-size: 14px;"></i>
            <span class="text-sm text-gray-700" style="font-size: 14px; line-height: 20px;">{{ getCurrentTime() }} {{ selectedCustomerForDetails.timeZone || 'EST' }}</span>
            <button *ngIf="isOkToCall(selectedCustomerForDetails) && (selectedCustomerForDetails.phone || selectedCustomerForDetails.phn1Nbr)"
                    (click)="makePhoneCallFromModal(selectedCustomerForDetails)"
                    [disabled]="callingPhoneModal === (selectedCustomerForDetails.phone || formatPhone(selectedCustomerForDetails.phn1Nbr))"
                    class="text-sm text-gray-900 font-medium hover:text-blue-600 hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style="font-size: 14px; line-height: 20px;"
                    [class.animate-pulse]="callingPhoneModal === (selectedCustomerForDetails.phone || formatPhone(selectedCustomerForDetails.phn1Nbr))">
              <i class="pi"
                 [class.pi-phone]="callingPhoneModal !== (selectedCustomerForDetails.phone || formatPhone(selectedCustomerForDetails.phn1Nbr))"
                 [class.pi-spin]="callingPhoneModal === (selectedCustomerForDetails.phone || formatPhone(selectedCustomerForDetails.phn1Nbr))"
                 [class.pi-spinner]="callingPhoneModal === (selectedCustomerForDetails.phone || formatPhone(selectedCustomerForDetails.phn1Nbr))"
                 [class.text-xs]="true"></i>
              {{ selectedCustomerForDetails.phone || formatPhone(selectedCustomerForDetails.phn1Nbr) }}
            </button>
            <span *ngIf="!isOkToCall(selectedCustomerForDetails) || (!selectedCustomerForDetails.phone && !selectedCustomerForDetails.phn1Nbr)" 
                  class="text-sm text-gray-900 font-medium" 
                  style="font-size: 14px; line-height: 20px;">{{ selectedCustomerForDetails.phone || formatPhone(selectedCustomerForDetails.phn1Nbr) || 'N/A' }}</span>
            <span class="text-sm text-gray-600" style="font-size: 14px; line-height: 20px;">{{ selectedCustomerForDetails.email }}</span>
          </div>

          <!-- Content Area -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="grid grid-cols-3 gap-6">
              <!-- Left Side: Interested Products and Own Products -->
              <div class="col-span-2 space-y-6">
                <!-- Interested Products Section -->
                <div>
                  <h3 class="text-base font-semibold text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Interested Products</h3>
                  <div class="space-y-3">
                    <!-- Mortgage Product -->
                    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="pi pi-home text-blue-600" style="font-size: 20px;"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900" style="font-size: 14px; font-weight: 600; line-height: 20px;">Mortgage (30y Fixed Rate)</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700" style="font-size: 12px; font-weight: 500;">New</span>
                            </div>
                            <p class="text-sm text-gray-500 mb-2" style="font-size: 14px; line-height: 20px; color: #6b7280;">Website • 8/15/2025</p>
                            <p class="text-sm text-green-600 font-medium mb-1" style="font-size: 14px; line-height: 20px; font-weight: 500; color: #059669;">Call now</p>
                            <p class="text-xs text-gray-600" style="font-size: 12px; line-height: 16px;">Co-applicant: Jane Smith (406) 555-0120</p>
                          </div>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded transition-colors">
                          <i class="pi pi-ellipsis-v text-gray-600" style="font-size: 16px;"></i>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Checking Product -->
                    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <i class="pi pi-wallet text-gray-600" style="font-size: 20px;"></i>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h4 class="font-semibold text-gray-900" style="font-size: 14px; font-weight: 600; line-height: 20px;">Checking (Basic Checking Plus)</h4>
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700" style="font-size: 12px; font-weight: 500;">Follow Up</span>
                            </div>
                            <p class="text-sm text-gray-500 mb-2" style="font-size: 14px; line-height: 20px; color: #6b7280;">Phone • 3/12/2025</p>
                            <p class="text-sm text-gray-600" style="font-size: 14px; line-height: 20px;">Call in 5 days (3/12/2025)</p>
                          </div>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded transition-colors">
                          <i class="pi pi-ellipsis-v text-gray-600" style="font-size: 16px;"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Own Products Section -->
                <div>
                  <h3 class="text-base font-semibold text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Own Products</h3>
                  <div class="space-y-3">
                    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start gap-4 flex-1">
                          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <i class="pi pi-wallet text-gray-600" style="font-size: 20px;"></i>
                          </div>
                          <div class="flex-1">
                            <h4 class="font-semibold text-gray-900 mb-1" style="font-size: 14px; font-weight: 600; line-height: 20px;">Checking</h4>
                            <p class="text-sm text-gray-500" style="font-size: 14px; line-height: 20px; color: #6b7280;">Phone • 3/12/2025</p>
                          </div>
                        </div>
                        <button class="p-1.5 hover:bg-gray-100 rounded transition-colors">
                          <i class="pi pi-ellipsis-v text-gray-600" style="font-size: 16px;"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Side: Details Section -->
              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-4" style="font-size: 16px; font-weight: 600; line-height: 24px;">Details</h3>
                <div class="space-y-3">
                  <!-- First Box: Name, Email, Phone, Address -->
                  <div class="bg-white border border-gray-200 rounded-lg p-3">
                    <div class="space-y-0">
                      <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                        <p class="text-xs font-bold text-gray-700" style="font-size: 12px; line-height: 16px; font-weight: 700;">Name</p>
                        <p class="text-sm text-gray-900" style="font-size: 14px; line-height: 20px;">{{ selectedCustomerForDetails.fullName || (selectedCustomerForDetails.firstName + ' ' + (selectedCustomerForDetails.lastName || '')) }}</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                        <p class="text-xs font-bold text-gray-700" style="font-size: 12px; line-height: 16px; font-weight: 700;">Email</p>
                        <p class="text-sm text-gray-900" style="font-size: 14px; line-height: 20px;">{{ selectedCustomerForDetails.email || 'N/A' }}</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                        <p class="text-xs font-bold text-gray-700" style="font-size: 12px; line-height: 16px; font-weight: 700;">Phone</p>
                        <p class="text-sm text-gray-900" style="font-size: 14px; line-height: 20px;">{{ selectedCustomerForDetails.phone || formatPhone(selectedCustomerForDetails.phn1Nbr) || 'N/A' }}</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4 py-2">
                        <p class="text-xs font-bold text-gray-700" style="font-size: 12px; line-height: 16px; font-weight: 700;">Address</p>
                        <p class="text-sm text-gray-900" style="font-size: 14px; line-height: 20px;">2972 Westheimer Rd. Santa Ana, Illinois 85486</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Second Box: Other Details -->
                  <div class="bg-white border border-gray-200 rounded-lg p-3">
                    <div class="space-y-0">
                      <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                        <p class="text-xs font-bold text-gray-700" style="font-size: 12px; line-height: 16px; font-weight: 700;">Time Zone</p>
                        <p class="text-sm text-gray-900" style="font-size: 14px; line-height: 20px;">{{ selectedCustomerForDetails.timeZone || 'EST' }}</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                        <p class="text-xs font-bold text-gray-700" style="font-size: 12px; line-height: 16px; font-weight: 700;">Call window</p>
                        <p class="text-sm text-gray-900" style="font-size: 14px; line-height: 20px;">10:00am - 2:00pm</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                        <p class="text-xs font-bold text-gray-700" style="font-size: 12px; line-height: 16px; font-weight: 700;">Attempts</p>
                        <p class="text-sm text-gray-900" style="font-size: 14px; line-height: 20px;">3/5</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                        <p class="text-xs font-bold text-gray-700" style="font-size: 12px; line-height: 16px; font-weight: 700;">Contact</p>
                        <p class="text-sm text-gray-900" style="font-size: 14px; line-height: 20px;">{{ getContactMethod(selectedCustomerForDetails) }}</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4 py-2">
                        <p class="text-xs font-bold text-gray-700" style="font-size: 12px; line-height: 16px; font-weight: 700;">Created</p>
                        <p class="text-sm text-gray-900" style="font-size: 14px; line-height: 20px;">{{ formatDate(selectedCustomerForDetails.createTs) || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Buttons -->
          <div class="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
            <button (click)="logContactResult()" 
                    class="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors" 
                    style="font-size: 14px; font-weight: 500; line-height: 20px;">
              Log Contact Result
            </button>
            <button (click)="closeCustomerDetails()" 
                    class="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                    style="font-size: 14px; font-weight: 500; line-height: 20px;">
              Close
            </button>
          </div>
        </div>
      </p-dialog>

      <!-- Log Contact Results Modal -->
      <p-dialog [(visible)]="showLogContactResult" 
                [modal]="true" 
                [style]="{width: '600px', maxWidth: '90vw'}"
                [styleClass]="'log-contact-result-dialog'"
                [draggable]="false"
                [resizable]="false"
                [closable]="false"
                *ngIf="selectedCustomerForDetails">
        <ng-template pTemplate="header">
          <div class="flex items-center justify-between w-full px-6 py-4 border-b border-gray-200 bg-white">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-1" style="font-size: 20px; font-weight: 600; line-height: 28px;">Log Contact Results</h2>
              <div class="text-sm text-gray-600" style="font-size: 14px; line-height: 20px;">
                <div>{{ selectedCustomerForDetails.fullName || (selectedCustomerForDetails.firstName + ' ' + (selectedCustomerForDetails.lastName || '')) }}</div>
                <div>{{ selectedCustomerForDetails.email }}</div>
                <div>{{ selectedCustomerForDetails.phone || formatPhone(selectedCustomerForDetails.phn1Nbr) }}</div>
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

      <!-- AI Assistant Button - Draggable -->
      <button 
              [style.position]="'fixed'"
              [style.left.px]="aiAssistantPosition.x"
              [style.top.px]="aiAssistantPosition.y"
              [style.bottom]="'auto'"
              [style.right]="'auto'"
              (mousedown)="startDrag($event)"
              (click)="onAiAssistantClick($event)"
              class="w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center z-50 cursor-move"
              [class.dragging]="isDragging">
        <i class="pi pi-star text-lg"></i>
      </button>

    <!-- AI Assistant Dialog -->
    <p-dialog [(visible)]="showAiAssistant" 
              [modal]="true" 
              [style]="{width: '450px', height: '600px'}"
              [draggable]="false"
              [resizable]="false"
              [closable]="false"
              [styleClass]="'ai-assistant-dialog'">
      <ng-template pTemplate="header">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <i class="pi pi-star text-gray-700"></i>
            <span class="text-lg font-semibold text-gray-900">AI Assistant</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">Esc</span>
            <button (click)="showAiAssistant = false" 
                    class="p-1 hover:bg-gray-100 rounded transition-colors">
              <i class="pi pi-times text-gray-600"></i>
            </button>
          </div>
        </div>
      </ng-template>
      <div class="flex flex-col h-full">
        <!-- Content area with placeholders -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <!-- Light gray rectangular placeholders with dotted borders for AI responses -->
          <div class="border-2 border-dashed border-gray-300 bg-gray-50 rounded h-16 w-full"></div>
          <div class="border-2 border-dashed border-gray-300 bg-gray-50 rounded h-20 w-full"></div>
          <div class="border-2 border-dashed border-gray-300 bg-gray-50 rounded h-16 w-3/4"></div>
          <div class="border-2 border-dashed border-gray-300 bg-gray-50 rounded h-24 w-full"></div>
          <div class="border-2 border-dashed border-gray-300 bg-gray-50 rounded h-16 w-5/6"></div>
        </div>
        <!-- Input area at bottom -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex gap-2 items-center">
            <input type="text" 
                   placeholder="Ask and you shall know..." 
                   [(ngModel)]="aiQuery"
                   (keydown.enter)="sendAiQuery()"
                   class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <button 
                    (click)="sendAiQuery()"
                    class="w-10 h-10 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center shadow-sm">
              <i class="pi pi-arrow-up text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .ai-assistant-dialog {
      margin: 0;
      position: fixed;
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
      left: auto;
    }

    :host ::ng-deep .ai-assistant-dialog .p-dialog-content {
      padding: 0;
      height: calc(600px - 60px);
      display: flex;
      flex-direction: column;
    }

    :host ::ng-deep .ai-assistant-dialog .p-dialog-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    /* Card dragging styles */
    .dragging {
      opacity: 0.8;
      transform: scale(1.02);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
      z-index: 1000;
      transition: none;
    }

    /* Call Status Dialog Styles */
    :host ::ng-deep .call-status-dialog {
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    :host ::ng-deep .call-status-dialog .p-dialog-header {
      display: none;
      padding: 0;
      border: none;
    }

    :host ::ng-deep .call-status-dialog .p-dialog-content {
      padding: 0;
      border-radius: 8px;
      overflow: hidden;
    }

    :host ::ng-deep .call-status-dialog .p-dialog {
      border-radius: 8px;
    }

    :host ::ng-deep .customer-details-dialog .p-dialog-content {
      padding: 0;
      display: flex;
      flex-direction: column;
      height: calc(90vh - 80px);
      overflow: hidden;
    }

    :host ::ng-deep .customer-details-dialog .p-dialog-header {
      padding: 0;
      border-bottom: none;
      background: white;
    }

    :host ::ng-deep .customer-details-dialog {
      border-radius: 8px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    :host ::ng-deep .customer-details-dialog .p-dialog {
      border-radius: 8px;
    }

    /* Custom scrollbar styling */
    :host ::ng-deep div[class*="max-h"]::-webkit-scrollbar {
      width: 8px;
    }

    :host ::ng-deep div[class*="max-h"]::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    :host ::ng-deep div[class*="max-h"]::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    :host ::ng-deep div[class*="max-h"]::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  stats: any = {
    customers: 0,
    applications: 0,
    businessWon: '$0.00k',
    winRate: '0%',
    customerGrowth: 0,
    applicationGrowth: 0,
    businessGrowth: 0,
    winRateChange: 0
  };
  todayCustomers: Customer[] = [];
  filteredTodayCustomers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  viewMode: 'todo' | 'done' = 'todo';
  okToCall = false;
  timeSensitive = false;
  showAiAssistant = false;
  aiQuery = '';
  aiAssistantPosition = { x: 0, y: 0 };
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  hasDragged = false;
  dragStartPosition = { x: 0, y: 0 };
  
  // Card dragging properties
  draggingCard: 'customers' | 'applications' | 'businessWon' | 'winRate' | null = null;
  cardDragOffset = { x: 0, y: 0 };
  cardDragStartPosition = { x: 0, y: 0 };
  cardPositions = {
    customers: { x: 0, y: 0 },
    applications: { x: 0, y: 0 },
    businessWon: { x: 0, y: 0 },
    winRate: { x: 0, y: 0 }
  };
  
  searchQuery = '';
  customerSortOrder: 'asc' | 'desc' | null = null;
  showCustomerDetails = false;
  selectedCustomerForDetails: Customer | null = null;
  currentCustomerIndex = -1;
  showLogContactResult = false;
  contactOccurred: 'outbound' | 'inbound' = 'outbound';
  contactMethod: ('phone' | 'text' | 'email')[] = [];
  callResult: 'spoke' | 'left-message' | 'no-message' | null = null;
  logContactComments = '';

  callingPhone: string | null = null;
  callingPhoneModal: string | null = null;
  callMessage: { severity: string; message: string } | null = null;
  callMessageModal: { severity: string; message: string } | null = null;
  
  // Call status popup
  showCallStatus = false;
  callStatus: 'initiated' | 'connecting' | 'connected' | 'disconnected' | 'failed' = 'initiated';
  currentCallCustomer: Customer | null = null;
  currentCallPhone: string | null = null;
  currentCallId: string | null = null;
  callDuration = 0;
  callDurationInterval: any = null;
  callStatusSubscription: Subscription | null = null;
  audioMuted = false;
  callStartTime: Date | null = null;
  
  // Background audio for call status popup
  @ViewChild('backgroundAudio', { static: false }) backgroundAudioRef!: ElementRef<HTMLAudioElement>;
  backgroundAudioElement: HTMLAudioElement | null = null;

  constructor(
    private dashboardService: DashboardService,
    private customerService: CustomerService,
    private communicationService: CommunicationService,
    private router: Router,
    private callSummaryService: CallSummaryService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    // Initialize AI Assistant button position to bottom right corner
    this.initializeAiAssistantPosition();
    
    // Initialize card positions in a grid layout
    this.initializeCardPositions();
    
    // Handle Esc key to close AI Assistant
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.showAiAssistant) {
        this.showAiAssistant = false;
      }
    });
    
    // Set up global mouse move and mouse up listeners for dragging
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('mousemove', this.onCardMouseMove.bind(this));
    document.addEventListener('mouseup', this.onCardMouseUp.bind(this));
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
  
  ngOnDestroy() {
    // Stop background audio on component destroy
    this.stopBackgroundAudio();
    // Clean up call timer interval
    this.stopCallTimer();
    
    // Clean up status polling subscription
    if (this.callStatusSubscription) {
      this.callStatusSubscription.unsubscribe();
      this.callStatusSubscription = null;
    }
    
    // Clean up drag event listeners
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    document.removeEventListener('mousemove', this.onCardMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onCardMouseUp.bind(this));
  }
  
  initializeCardPositions() {
    // Wait for DOM to render, then calculate equal spacing
    setTimeout(() => {
      const container = document.querySelector('.relative.mb-6');
      if (!container) {
        // Retry if container not found
        setTimeout(() => this.initializeCardPositions(), 100);
        return;
      }
      
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      const cardWidth = 256; // Fixed card width (w-64)
      const numberOfCards = 4;
      const topOffset = 0; // Start from top of container
      
      // Calculate total width needed for all cards
      const totalCardsWidth = cardWidth * numberOfCards;
      
      // Calculate remaining space to distribute equally
      const remainingSpace = containerWidth - totalCardsWidth;
      
      // Calculate equal gap between cards (distribute remaining space equally)
      // We have 3 gaps between 4 cards, plus margins on left and right
      const equalGap = remainingSpace / (numberOfCards + 1);
      
      // Calculate positions with equal spacing
      // First card starts after first gap, subsequent cards have equal spacing
      this.cardPositions = {
        customers: { x: equalGap, y: topOffset },
        applications: { x: equalGap + cardWidth + equalGap, y: topOffset },
        businessWon: { x: equalGap + (cardWidth + equalGap) * 2, y: topOffset },
        winRate: { x: equalGap + (cardWidth + equalGap) * 3, y: topOffset }
      };
    }, 50);
  }
  
  initializeAiAssistantPosition() {
    // Set initial position to bottom right corner (default position)
    // Account for button size (48px) and spacing (24px = 6 * 4px)
    setTimeout(() => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      this.aiAssistantPosition = {
        x: windowWidth - 72, // 48px button + 24px margin
        y: windowHeight - 72 // 48px button + 24px margin
      };
    }, 0);
  }
  
  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.hasDragged = false;
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    this.dragStartPosition = {
      x: event.clientX,
      y: event.clientY
    };
    event.preventDefault();
    event.stopPropagation();
  }
  
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      // Check if we've moved enough to consider this a drag (more than 5px)
      const moveDistance = Math.sqrt(
        Math.pow(event.clientX - this.dragStartPosition.x, 2) + 
        Math.pow(event.clientY - this.dragStartPosition.y, 2)
      );
      
      if (moveDistance > 5) {
        this.hasDragged = true;
      }
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const buttonSize = 48; // 12 * 4px = 48px (w-12 h-12)
      const margin = 6; // Margin from edges
      
      // Calculate new position (subtract drag offset to keep cursor position relative to button)
      let newX = event.clientX - this.dragOffset.x;
      let newY = event.clientY - this.dragOffset.y;
      
      // Constrain to screen boundaries
      newX = Math.max(margin, Math.min(newX, windowWidth - buttonSize - margin));
      newY = Math.max(margin, Math.min(newY, windowHeight - buttonSize - margin));
      
      this.aiAssistantPosition = { x: newX, y: newY };
      event.preventDefault();
    }
  }
  
  onMouseUp(event: MouseEvent) {
    if (this.isDragging) {
      // Check if this was actually a drag (moved more than threshold)
      const moveDistance = Math.sqrt(
        Math.pow(event.clientX - this.dragStartPosition.x, 2) + 
        Math.pow(event.clientY - this.dragStartPosition.y, 2)
      );
      
      const wasActuallyDragged = moveDistance > 5;
      
      // Reset dragging state
      this.isDragging = false;
      
      // If it was actually dragged, prevent the click event
      if (wasActuallyDragged) {
        this.hasDragged = true;
        // Reset hasDragged after a short delay to allow click detection
        setTimeout(() => {
          this.hasDragged = false;
        }, 100);
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Not a drag, allow click to proceed
        this.hasDragged = false;
      }
    }
  }
  
  onAiAssistantClick(event: MouseEvent) {
    // Only open popup if this wasn't a drag operation
    // The hasDragged flag is set in onMouseUp if movement was detected
    if (!this.hasDragged) {
      this.showAiAssistant = true;
    }
  }

  // Card dragging methods
  startCardDrag(event: MouseEvent, cardType: 'customers' | 'applications' | 'businessWon' | 'winRate') {
    this.draggingCard = cardType;
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    this.cardDragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    this.cardDragStartPosition = {
      x: event.clientX,
      y: event.clientY
    };
    event.preventDefault();
    event.stopPropagation();
  }

  onCardMouseMove(event: MouseEvent) {
    if (this.draggingCard) {
      const cardWidth = 256; // Fixed card width
      const cardHeight = 160; // Fixed card height
      const margin = 10;
      
      // Get the cards container element to calculate relative positions
      const container = document.querySelector('.relative.mb-6');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      
      // Define the home page area boundaries within the container
      // Cards area is the space from left edge of container to right edge
      const cardsAreaLeft = 0; // Left edge of container
      const cardsAreaRight = containerRect.width; // Right edge of container
      const cardsAreaTop = 0; // Top of container
      const cardsAreaBottom = containerRect.height; // Bottom of container (160px)
      
      // Calculate new position relative to the container
      let newX = event.clientX - containerRect.left - this.cardDragOffset.x;
      let newY = event.clientY - containerRect.top - this.cardDragOffset.y;
      
      // Constrain to home page area boundaries (within the container)
      // Left boundary: at least margin from left edge
      newX = Math.max(cardsAreaLeft + margin, newX);
      // Right boundary: card should not go beyond container width
      newX = Math.min(newX, cardsAreaRight - cardWidth - margin);
      // Top boundary: at least margin from top
      newY = Math.max(cardsAreaTop + margin, newY);
      // Bottom boundary: card should stay within container height
      newY = Math.min(newY, cardsAreaBottom - cardHeight - margin);
      
      // Update position for the dragged card
      if (this.draggingCard) {
        this.cardPositions[this.draggingCard] = { x: newX, y: newY };
      }
      
      event.preventDefault();
    }
  }

  onCardMouseUp(event: MouseEvent) {
    if (this.draggingCard) {
      this.draggingCard = null;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  loadDashboardData() {
    this.dashboardService.getDashboardStats().subscribe((stats: any) => {
      this.stats = {
        customers: stats.customers || 0,
        applications: stats.applications || 0,
        businessWon: stats.businessWon || '$0.00k',
        winRate: stats.winRate || '0%',
        customerGrowth: stats.customerGrowth || 0,
        applicationGrowth: stats.applicationGrowth || 0,
        businessGrowth: stats.businessGrowth || 0,
        winRateChange: stats.winRateChange || 0
      };
    });

    this.dashboardService.getTodayCustomers().subscribe((customers: Customer[]) => {
      this.todayCustomers = customers;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredTodayCustomers = this.todayCustomers.filter(customer => {
      // Filter by view mode (todo/done) - for now, show all in todo
      if (this.viewMode === 'done') {
        // TODO: Implement done filter logic when available
        return false;
      }
      
      // Filter by search query
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        const searchTerm = this.searchQuery.toLowerCase().trim();
        const fullName = (customer.fullName || (customer.firstName + ' ' + (customer.lastName || ''))).toLowerCase();
        const email = (customer.email || '').toLowerCase();
        const phone = (customer.phone || this.formatPhone(customer.phn1Nbr) || '').toLowerCase();
        
        if (!fullName.includes(searchTerm) && !email.includes(searchTerm) && !phone.includes(searchTerm)) {
          return false;
        }
      }
      
      // Filter by time sensitive if checkbox is checked
      if (this.timeSensitive) {
        const hasTimeSensitiveTag = this.getTimeSensitiveTag(customer) !== null;
        if (!hasTimeSensitiveTag) {
          return false;
        }
      }
      
      // TODO: Apply OK to call filter when available
      
      return true;
    });
    
    // Apply sorting if sort order is set
    if (this.customerSortOrder) {
      this.filteredTodayCustomers.sort((a, b) => {
        const nameA = (a.fullName || (a.firstName + ' ' + (a.lastName || ''))).toLowerCase();
        const nameB = (b.fullName || (b.firstName + ' ' + (b.lastName || ''))).toLowerCase();
        
        if (this.customerSortOrder === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }
  }

  getTodoCount(): number {
    return this.todayCustomers.filter(customer => {
      // Apply same filters as applyFilters but for todo items
      // Exclude done items (for now, all items are todo)
      // TODO: Update when done status is implemented
      
      // Filter by search query
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        const searchTerm = this.searchQuery.toLowerCase().trim();
        const fullName = (customer.fullName || (customer.firstName + ' ' + (customer.lastName || ''))).toLowerCase();
        const email = (customer.email || '').toLowerCase();
        const phone = (customer.phone || this.formatPhone(customer.phn1Nbr) || '').toLowerCase();
        
        if (!fullName.includes(searchTerm) && !email.includes(searchTerm) && !phone.includes(searchTerm)) {
          return false;
        }
      }
      
      // Filter by time sensitive if checkbox is checked
      if (this.timeSensitive) {
        const hasTimeSensitiveTag = this.getTimeSensitiveTag(customer) !== null;
        if (!hasTimeSensitiveTag) {
          return false;
        }
      }
      
      // TODO: Apply OK to call filter when available
      
      // For now, all items are considered "todo" (done status not implemented yet)
      return true;
    }).length;
  }

  getDoneCount(): number {
    return this.todayCustomers.filter(customer => {
      // Apply same filters as applyFilters but for done items
      // For now, done logic is not implemented, so return 0
      // TODO: Update when done status is implemented
      
      // Filter by search query
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        const searchTerm = this.searchQuery.toLowerCase().trim();
        const fullName = (customer.fullName || (customer.firstName + ' ' + (customer.lastName || ''))).toLowerCase();
        const email = (customer.email || '').toLowerCase();
        const phone = (customer.phone || this.formatPhone(customer.phn1Nbr) || '').toLowerCase();
        
        if (!fullName.includes(searchTerm) && !email.includes(searchTerm) && !phone.includes(searchTerm)) {
          return false;
        }
      }
      
      // Filter by time sensitive if checkbox is checked
      if (this.timeSensitive) {
        const hasTimeSensitiveTag = this.getTimeSensitiveTag(customer) !== null;
        if (!hasTimeSensitiveTag) {
          return false;
        }
      }
      
      // TODO: Apply OK to call filter when available
      
      // TODO: Check if customer is marked as done
      // For now, return false as done status is not implemented
      return false;
    }).length;
  }

  sortByCustomerName() {
    if (this.customerSortOrder === null) {
      this.customerSortOrder = 'asc';
    } else if (this.customerSortOrder === 'asc') {
      this.customerSortOrder = 'desc';
    } else {
      this.customerSortOrder = null;
    }
    this.applyFilters();
  }

  getNewProducts(customer: Customer): number {
    // TODO: Get from transactions or backend
    // For now, return consistent mock data based on customer ID
    if (!customer.customerId) return 0;
    // Use customer ID hash to get consistent value
    const hash = customer.customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 5;
  }

  getInProgress(customer: Customer): number {
    // TODO: Get from transactions or backend
    // For now, return consistent mock data based on customer ID
    if (!customer.customerId) return 0;
    const hash = customer.customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 3;
  }

  getBestTime(customer: Customer): string {
    // Use timeZone or return default
    if (customer.timeZone) {
      // Could map timeZone to time ranges
      return 'Anytime';
    }
    // Mock data - consistent based on customer ID
    if (!customer.customerId) return 'Anytime';
    const times = ['Anytime', '9a - 12p', '12p - 4p', '4p - 8p'];
    const hash = customer.customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return times[hash % times.length];
  }

  getTimeSensitiveTag(customer: Customer): string | null {
    // TODO: Get from transaction or interaction data
    // For now, show tag for some customers consistently based on ID
    if (!customer.customerId) return null;
    const hash = customer.customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Show tag for approximately 30% of customers
    if (hash % 10 < 3) {
      const tags = ['Shopping alert', 'Expiring offer', 'Urgent follow-up'];
      return tags[hash % tags.length];
    }
    return null;
  }

  getContactMethod(customer: Customer): string {
    // Normalize methodPref to one of the three allowed values: Phone, Email, or Text
    const methodPref = customer.methodPref?.trim() || '';
    
    // Normalize common variations
    const normalized = methodPref.toLowerCase();
    
    if (normalized === 'phone' || normalized === 'call') {
      return 'Phone';
    } else if (normalized === 'email' || normalized === 'e-mail') {
      return 'Email';
    } else if (normalized === 'text' || normalized === 'sms' || normalized === 'message') {
      return 'Text';
    }
    
    // Default to Phone if not specified or doesn't match any known values
    return 'Phone';
  }

  viewCustomer(customer: Customer) {
    // Navigate to customer details page instead of opening popup
    if (customer.customerId) {
      this.router.navigate(['/customers', customer.customerId]);
    }
  }

  openCustomerDetails(customer: Customer, event: Event) {
    event.stopPropagation(); // Prevent row click
    this.selectedCustomerForDetails = customer;
    // Find the index in filtered list
    this.currentCustomerIndex = this.filteredTodayCustomers.findIndex(c => c.customerId === customer.customerId);
    this.showCustomerDetails = true;
  }

  closeCustomerDetails() {
    this.showCustomerDetails = false;
    this.selectedCustomerForDetails = null;
    this.currentCustomerIndex = -1;
  }

  canNavigatePrev(): boolean {
    return this.currentCustomerIndex > 0;
  }

  canNavigateNext(): boolean {
    return this.currentCustomerIndex >= 0 && this.currentCustomerIndex < this.filteredTodayCustomers.length - 1;
  }

  navigateCustomer(direction: 'prev' | 'next') {
    if (direction === 'prev' && this.canNavigatePrev()) {
      this.currentCustomerIndex--;
      this.selectedCustomerForDetails = this.filteredTodayCustomers[this.currentCustomerIndex];
    } else if (direction === 'next' && this.canNavigateNext()) {
      this.currentCustomerIndex++;
      this.selectedCustomerForDetails = this.filteredTodayCustomers[this.currentCustomerIndex];
    }
  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${displayHours}:${displayMinutes}${ampm}`;
  }

  logContactResult() {
    if (this.selectedCustomerForDetails) {
      this.showLogContactResult = true;
      // Reset form values
      this.contactOccurred = 'outbound';
      this.contactMethod = [];
      this.callResult = null;
      this.logContactComments = '';
    }
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
      customer: this.selectedCustomerForDetails,
      contactOccurred: this.contactOccurred,
      contactMethod: this.contactMethod,
      callResult: this.callResult,
      comments: this.logContactComments
    });
    
    // Close modal after saving
    this.closeLogContactResult();
    // Optionally close customer details modal as well
    // this.closeCustomerDetails();
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
    try {
      return new Date(date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
    } catch (e) {
      return date;
    }
  }

  openContactResult() {
    // TODO: Implement contact result dialog
    console.log('Open contact result for:', this.selectedCustomer);
  }

  sendAiQuery() {
    if (!this.aiQuery || this.aiQuery.trim() === '') {
      return;
    }
    // TODO: Implement AI query
    console.log('AI Query:', this.aiQuery);
    this.aiQuery = '';
  }

  getStage(customer: Customer): string {
    // Use stage from backend if available, otherwise default to "New Lead"
    return customer.stage || 'New Lead';
  }

  getStageBadgeClass(customer: Customer): string {
    const stage = this.getStage(customer);
    switch (stage) {
      case 'New Lead':
        return 'bg-blue-100 text-blue-700';
      case 'PreQ':
        return 'bg-green-100 text-green-700';
      case 'Follow Up':
        return 'bg-yellow-100 text-yellow-700';
      case 'Submitted':
        return 'bg-gray-100 text-gray-700';
      case 'Closed Lost':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  makePhoneCall(customer: Customer, event: Event) {
    event.stopPropagation(); // Prevent row click
    
    const phoneNumber = customer.phone || this.formatPhone(customer.phn1Nbr);
    if (!phoneNumber || phoneNumber === 'N/A') {
      return;
    }

    this.callingPhone = phoneNumber;
    this.callMessage = null;

    const customerName = customer.fullName || 
                        (customer.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : '') ||
                        'Customer';

    this.communicationService.initiateOutboundCall({
      phoneNumber: phoneNumber.replace(/[^0-9+]/g, ''), // Clean phone number
      customerId: customer.customerId || undefined,
      customerName: customerName
    }).subscribe({
      next: (response) => {
        this.callingPhone = null;
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
        } else {
          this.callMessage = {
            severity: 'error',
            message: response.message || 'Failed to initiate call'
          };
        }
      },
      error: (error) => {
        this.callingPhone = null;
        this.callMessage = {
          severity: 'error',
          message: error.error?.message || 'Error initiating call. Please try again.'
        };
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
        // Stop polling immediately when disconnected
        if (this.callStatusSubscription) {
          this.callStatusSubscription.unsubscribe();
          this.callStatusSubscription = null;
          console.log('Stopped polling - call disconnected');
        }
        // Navigate to Call Summary after a brief delay
        setTimeout(() => {
          if (this.showCallStatus && this.callStatus === 'disconnected') {
            console.log('Showing call summary after disconnect');
            this.showCallSummaryScreen();
          }
        }, 1000);
        break;
      case 'failed':
        newStatus = 'failed';
        statusChanged = true;
        this.stopCallTimer();
        this.stopBackgroundAudio(); // Stop background audio when failed
        // Stop polling immediately when failed
        if (this.callStatusSubscription) {
          this.callStatusSubscription.unsubscribe();
          this.callStatusSubscription = null;
          console.log('Stopped polling - call failed');
        }
        // Navigate to Call Summary after a brief delay even for failed calls
        setTimeout(() => {
          if (this.showCallStatus && this.callStatus === 'failed') {
            console.log('Showing call summary after failure');
            this.showCallSummaryScreen();
          }
        }, 1000);
        break;
      default:
        if (backendStatus) {
          console.warn('Unknown backend status:', backendStatus, '- keeping current status:', previousStatus);
        }
        // Don't change status if unknown or empty
        return;
    }
    
    if (statusChanged) {
      console.log(`STATUS UPDATE: "${previousStatus}" → "${newStatus}"`);
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
        // Navigate to Call Summary page
        this.showCallSummaryScreen();
      },
      error: (error) => {
        console.error('Error ending call:', error);
        // Keep status as disconnected since user clicked end call
        // Navigate to Call Summary page anyway
        this.showCallSummaryScreen();
      }
    });
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

  toggleAudio() {
    this.audioMuted = !this.audioMuted;
    // TODO: Implement actual audio mute/unmute functionality with ACS
  }

  getInitials(customer: Customer): string {
    if (customer.fullName) {
      const names = customer.fullName.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    const firstName = customer.firstName || '';
    const lastName = customer.lastName || '';
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (lastName) {
      return lastName[0].toUpperCase();
    }
    return '?';
  }

  isOkToCall(customer: Customer): boolean {
    // Check if customer is OK to call
    // For now, assume all customers shown in the modal are OK to call
    // This can be enhanced to check a specific property on the customer object
    // For example: return customer.okToCall === true || customer.status === 'OK_TO_CALL'
    return true;
  }

  makePhoneCallFromModal(customer: Customer) {
    if (!this.isOkToCall(customer)) {
      this.callMessageModal = {
        severity: 'warn',
        message: 'This customer is not OK to call at this time.'
      };
      setTimeout(() => this.callMessageModal = null, 3000);
      return;
    }

    const phoneNumber = customer.phone || this.formatPhone(customer.phn1Nbr);
    if (!phoneNumber || phoneNumber === 'N/A' || phoneNumber === '-') {
      this.callMessageModal = {
        severity: 'error',
        message: 'Phone number is not available.'
      };
      setTimeout(() => this.callMessageModal = null, 3000);
      return;
    }

    this.callingPhoneModal = phoneNumber;
    this.callMessageModal = null;

    const customerName = customer.fullName || 
                        (customer.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : '') ||
                        'Customer';

    this.communicationService.initiateOutboundCall({
      phoneNumber: phoneNumber.replace(/[^0-9+]/g, ''), // Clean phone number
      customerId: customer.customerId || undefined,
      customerName: customerName
    }).subscribe({
      next: (response) => {
        this.callingPhoneModal = null;
        if (response.status === 'initiated' || response.status === 'success') {
          // Show call status popup (same as makePhoneCall)
          this.currentCallCustomer = customer;
          this.currentCallPhone = phoneNumber;
          this.currentCallId = response.callId || null;
          this.callStatus = 'initiated';
          this.callDuration = 0;
          this.callStartTime = new Date();
          this.showCallStatus = true;
          
          console.log('Call initiated from modal, callId:', this.currentCallId);
          
          // Start polling for call status updates from ACS events
          if (this.currentCallId) {
            this.startCallStatusPolling(this.currentCallId);
          } else {
            console.warn('No callId returned from backend - cannot poll for status');
            // If no callId, simulate progression
            this.simulateCallProgression();
          }
        } else {
          this.callMessageModal = {
            severity: 'error',
            message: response.message || 'Failed to initiate call'
          };
          setTimeout(() => this.callMessageModal = null, 5000);
        }
      },
      error: (error) => {
        this.callingPhoneModal = null;
        const errorMessage = error.error?.message || 'Failed to initiate call. Please try again.';
        this.callMessageModal = {
          severity: 'error',
          message: errorMessage
        };
        setTimeout(() => this.callMessageModal = null, 5000);
        console.error('Error initiating call from modal:', error);
      }
    });
  }
}

