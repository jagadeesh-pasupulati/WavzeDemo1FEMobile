import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DashboardService } from '../../services/dashboard.service';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DialogModule, ButtonModule, InputTextModule],
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

        <!-- Stats Cards -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg p-6 shadow-sm">
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
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <i class="pi pi-file text-blue-500 text-2xl"></i>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">30d</span>
            </div>
            <p class="text-sm text-gray-600 mb-1">Applications</p>
            <p class="text-2xl font-bold">{{ stats.applications }}</p>
            <p class="text-xs text-gray-500 mt-2">-0.0%</p>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <i class="pi pi-dollar text-green-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-600 mb-1">Business won</p>
            <p class="text-2xl font-bold">{{ stats.businessWon }}</p>
            <p class="text-xs text-green-600 mt-2 flex items-center gap-1" *ngIf="stats.businessGrowth > 0">
              <i class="pi pi-arrow-up text-xs"></i>
              +{{ stats.businessGrowth | number:'1.1-1' }}%
            </p>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <i class="pi pi-trophy text-yellow-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-600 mb-1">Win rate</p>
            <p class="text-2xl font-bold">{{ stats.winRate }}</p>
            <p class="text-xs text-yellow-600 mt-2 flex items-center gap-1" *ngIf="stats.winRateChange < 0">
              <i class="pi pi-arrow-down text-xs"></i>
              {{ stats.winRateChange | number:'1.1-1' }}%
            </p>
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
                    To do
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
                    Done
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-4">
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

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
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
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Phone</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">New prod.</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">In progress</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Best time</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time sensitive</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact by</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let customer of filteredTodayCustomers" 
                    (click)="viewCustomer(customer)"
                    [class.bg-blue-50]="selectedCustomer?.customerId === customer.customerId"
                    class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                  <td class="py-3 px-4">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ customer.fullName || (customer.firstName + ' ' + (customer.lastName || '')) }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ customer.email || '' }}</p>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900">
                    {{ customer.phone || formatPhone(customer.phn1Nbr) || 'N/A' }}
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
                  <td class="py-3 px-4 text-sm text-gray-900">
                    {{ getContactMethod(customer) }}
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
          
          <!-- AI Assistant Button -->
          <div class="relative p-4 min-h-[60px]">
            <button (click)="showAiAssistant = true" 
                    class="absolute bottom-4 right-4 w-10 h-10 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-colors flex items-center justify-center">
              <i class="pi pi-star text-sm"></i>
            </button>
          </div>
        </div>

      </div>

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
          <!-- Light gray rectangular placeholders for AI responses -->
          <div class="bg-gray-100 rounded h-16 w-full"></div>
          <div class="bg-gray-100 rounded h-20 w-full"></div>
          <div class="bg-gray-100 rounded h-16 w-3/4"></div>
          <div class="bg-gray-100 rounded h-24 w-full"></div>
          <div class="bg-gray-100 rounded h-16 w-5/6"></div>
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
  `]
})
export class DashboardComponent implements OnInit {
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
  customerSortOrder: 'asc' | 'desc' | null = null;

  constructor(
    private dashboardService: DashboardService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    // Handle Esc key to close AI Assistant
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.showAiAssistant) {
        this.showAiAssistant = false;
      }
    });
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
    // Use methodPref field
    if (customer.methodPref) {
      const methodMap: { [key: string]: string } = {
        'Phone': 'Phone',
        'Text': 'Text',
        'Email': 'Email',
        'SMS': 'Text'
      };
      return methodMap[customer.methodPref] || customer.methodPref;
    }
    // Default to Phone if not specified
    return 'Phone';
  }

  viewCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    if (customer.customerId) {
      // Navigate to customer details page
      // this.router.navigate(['/customers', customer.customerId]);
    }
  }

  formatPhone(phone: number | undefined): string {
    if (!phone) return '-';
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `(${phoneStr.substring(0, 3)}) ${phoneStr.substring(3, 6)}-${phoneStr.substring(6)}`;
    }
    return phoneStr;
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
}

