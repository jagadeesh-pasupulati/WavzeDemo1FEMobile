import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    DialogModule,
    TagModule,
    MenuModule
  ],
  template: `
    <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold flex items-center gap-2 text-gray-900">
            <i class="pi pi-users text-gray-600"></i>
            Customers
          </h1>
          <button 
                  class="bg-purple-600 hover:bg-purple-700 border-0 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                  (click)="showAddDialog = true">
            Add new customer
          </button>
        </div>

        <!-- Filters and Search -->
        <div class="flex items-center gap-3 mb-4">
          <button class="p-2 text-gray-600 hover:bg-gray-100 rounded">
            <i class="pi pi-filter text-lg"></i>
          </button>
          <div class="flex gap-2 flex-wrap flex-1">
            <span class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-normal">
              Stage: New Lead
              <i class="pi pi-times text-xs cursor-pointer hover:text-gray-900" (click)="removeFilter('stage')"></i>
            </span>
            <span class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-normal">
              Contact window: 10:00-15:00
              <i class="pi pi-times text-xs cursor-pointer hover:text-gray-900" (click)="removeFilter('window')"></i>
            </span>
          </div>
          <div class="relative">
            <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input type="text" 
                   placeholder="Search..." 
                   [(ngModel)]="searchQuery"
                   (input)="filterCustomers()"
                   class="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
        </div>

        <!-- Customers Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <div class="relative max-h-[600px] overflow-y-auto customers-table-scrollbar">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 bg-gray-50">
                      Customer <i class="pi pi-sort text-xs ml-1 text-gray-400"></i>
                    </th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                      <i class="pi pi-home text-gray-600"></i>
                    </th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">Phone</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">Contact window</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">Last attempt</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">Last action</th>
                    <th class="text-left py-3 px-4 bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let customer of filteredCustomers; let i = index" 
                      class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                    <td class="py-3 px-4" (click)="viewCustomer(customer)">
                      <div>
                        <p class="font-medium text-gray-900">{{ customer.fullName || (customer.firstName + ' ' + customer.lastName) }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ customer.email || 'ccalvin@email.org' }}</p>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-gray-600" (click)="viewCustomer(customer)">{{ getHomeCount(customer) }}</td>
                    <td class="py-3 px-4 text-gray-700" (click)="viewCustomer(customer)">{{ customer.phone || formatPhone(customer.phn1Nbr) || '(307) 555-0133' }}</td>
                    <td class="py-3 px-4 text-gray-700" (click)="viewCustomer(customer)">10:00-15:00</td>
                    <td class="py-3 px-4 text-gray-600 text-xs" (click)="viewCustomer(customer)">{{ formatDate(customer.createTs) || '3/4/16' }}</td>
                    <td class="py-3 px-4 text-gray-600 text-xs" (click)="viewCustomer(customer)">{{ getLastAction(customer) }}</td>
                    <td class="py-3 px-4">
                      <button class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" 
                              (click)="showMenu($event, customer, menu); $event.stopPropagation()">
                        <i class="pi pi-ellipsis-v"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    <!-- Add Customer Dialog -->
    <p-dialog [(visible)]="showAddDialog" 
              [modal]="true" 
              [style]="{width: '500px'}"
              header="Add new customer"
              [closable]="true">
      <div class="p-4">
        <p class="text-gray-600 mb-4 text-sm">Provide key customer information. You can add details later.</p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-900">First Name</label>
            <input type="text" 
                   [(ngModel)]="newCustomer.firstName"
                   placeholder="Enter first name"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-900">Last Name</label>
            <input type="text" 
                   [(ngModel)]="newCustomer.lastName"
                   placeholder="Enter last name"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-900">Email</label>
            <input type="email" 
                   [(ngModel)]="newCustomer.email"
                   placeholder="Enter email address"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-900">Phone</label>
            <input type="tel" 
                   [(ngModel)]="phoneInput"
                   placeholder="(123) 456-7890"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" 
                   id="writeToCrm"
                   [(ngModel)]="writeToCrm"
                   class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
            <label for="writeToCrm" class="text-sm text-gray-700 cursor-pointer">Will write to CRM</label>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
          <button 
                  type="button"
                  (click)="showAddDialog = false; resetForm()"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button 
                  type="button"
                  (click)="saveCustomer(false)"
                  class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Save and close
          </button>
          <button 
                  type="button"
                  (click)="saveCustomer(true)"
                  class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
            Save and add more details
          </button>
        </div>
      </div>
    </p-dialog>

    <!-- Context Menu -->
    <p-menu #menu [model]="menuItems" [popup]="true" [style]="{width: '200px'}" styleClass="custom-menu">
      <ng-template let-item pTemplate="item">
        <div class="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
          <div class="flex items-center gap-2">
            <i [class]="item.icon" class="text-sm text-gray-600"></i>
            <span>{{ item.label }}</span>
            <i *ngIf="item.items && item.items.length > 0" class="pi pi-chevron-right text-xs text-gray-400 ml-auto"></i>
          </div>
          <span class="text-xs text-gray-400 ml-4" *ngIf="!item.items">{{ getShortcut(item.label) }}</span>
        </div>
      </ng-template>
    </p-menu>
  `,
  styles: [`
    :host ::ng-deep .custom-menu {
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    :host ::ng-deep .custom-menu .p-menu-list {
      padding: 0.25rem 0;
    }
    
    :host ::ng-deep .custom-menu .p-menuitem-link {
      padding: 0;
      border: none;
    }
    
    :host ::ng-deep .custom-menu .p-menuitem-link:hover {
      background: #f9fafb;
    }

    :host ::ng-deep .p-dialog .p-dialog-header {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    :host ::ng-deep .p-dialog .p-dialog-header .p-dialog-title {
      font-weight: 600;
      font-size: 1.125rem;
      color: #111827;
    }

    :host ::ng-deep .p-dialog .p-dialog-header .p-dialog-header-icon {
      color: #6b7280;
    }

    :host ::ng-deep .p-dialog .p-dialog-header .p-dialog-header-icon:hover {
      color: #111827;
      background-color: #f3f4f6;
    }

    /* Custom scrollbar styling for customers table */
    .customers-table-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .customers-table-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .customers-table-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }

    .customers-table-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Firefox scrollbar */
    .customers-table-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }
  `]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchQuery = '';
  showAddDialog = false;
  newCustomer: Partial<Customer> = {};
  phoneInput = '';
  writeToCrm = false;
  menuItems: any[] = [];
  selectedCustomer: Customer | null = null;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCustomers();
    this.setupMenuItems();
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe(customers => {
      this.customers = customers;
      this.filteredCustomers = customers;
    });
  }

  filterCustomers() {
    if (!this.searchQuery) {
      this.filteredCustomers = this.customers;
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredCustomers = this.customers.filter(c => 
      (c.fullName || (c.firstName + ' ' + c.lastName)).toLowerCase().includes(query) ||
      (c.email || '').toLowerCase().includes(query) ||
      (c.phone || '').includes(query)
    );
  }

  removeFilter(type: string) {
    // TODO: Implement filter removal
    console.log('Remove filter:', type);
  }

  viewCustomer(customer: Customer) {
    this.router.navigate(['/customers', customer.customerId]);
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

  showMenu(event: Event, customer: Customer, menu: any) {
    event.stopPropagation();
    this.selectedCustomer = customer;
    menu.toggle(event);
  }

  setupMenuItems() {
    this.menuItems = [
      {
        label: 'View details',
        icon: 'pi pi-eye',
        command: () => {
          if (this.selectedCustomer) {
            this.viewCustomer(this.selectedCustomer);
          }
        }
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          // TODO: Implement edit
          console.log('Edit customer:', this.selectedCustomer);
        }
      },
      {
        label: 'Duplicate',
        icon: 'pi pi-copy',
        command: () => {
          // TODO: Implement duplicate
          console.log('Duplicate customer:', this.selectedCustomer);
        }
      },
      {
        label: 'Move to stage',
        icon: 'pi pi-arrow-right',
        items: [],
        command: () => {
          // TODO: Implement move to stage submenu
          console.log('Move to stage:', this.selectedCustomer);
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedCustomer && confirm('Are you sure you want to delete this customer?')) {
            this.deleteCustomer(this.selectedCustomer);
          }
        }
      }
    ];
  }

  getShortcut(label: string): string {
    const shortcuts: {[key: string]: string} = {
      'View details': 'V',
      'Edit': 'E',
      'Duplicate': 'C',
      'Delete': 'D'
    };
    return shortcuts[label] || '';
  }

  getStage(customer: Customer): string {
    // Mock stages - in real app, this would come from customer data
    const stages = ['New Lead', 'PreQ', 'Follow Up', 'Submitted', 'Closed Lost'];
    const index = this.customers.indexOf(customer);
    return stages[index % stages.length];
  }

  getStageBadgeClass(customer: Customer): string {
    const stage = this.getStage(customer);
    switch(stage) {
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

  getLastAction(customer: Customer): string {
    // Mock actions - in real app, this would come from interaction data
    const actions = ['Call', 'Zoom Call', 'Email sent', 'Email received', 'Voicemail', '', ''];
    const index = this.customers.indexOf(customer);
    return actions[index % actions.length] || '';
  }

  getHomeCount(customer: Customer): number {
    // Mock home count - in real app, this would come from customer data or interaction count
    // Returns a number between 1-3 based on customer index
    const index = this.customers.indexOf(customer);
    return (index % 3) + 1;
  }

  saveCustomer(addMore: boolean) {
    // Validate required fields
    if (!this.newCustomer.firstName || this.newCustomer.firstName.trim() === '') {
      alert('Please enter a first name.');
      return;
    }

    // Parse phone number
    if (this.phoneInput) {
      const phoneDigits = this.phoneInput.replace(/\D/g, '');
      if (phoneDigits.length >= 10) {
        // Phone number is stored as BigDecimal (number) in the database
        // Extract 10 digits and convert to number
        const phoneNumber = parseInt(phoneDigits.substring(0, 10), 10);
        if (!isNaN(phoneNumber)) {
          this.newCustomer.phn1Nbr = phoneNumber;
          this.newCustomer.phn1Type = 'Mobile';
        }
      }
    }

    // Create customer DTO
    const customerToCreate: Customer = {
      firstName: this.newCustomer.firstName?.trim() || '',
      lastName: this.newCustomer.lastName?.trim() || '',
      email: this.newCustomer.email?.trim() || undefined,
      phn1Nbr: this.newCustomer.phn1Nbr,
      phn1Type: this.newCustomer.phn1Type || 'Mobile'
    };

    this.customerService.createCustomer(customerToCreate).subscribe({
      next: (customer) => {
        this.resetForm();
        this.showAddDialog = false;
        this.loadCustomers();
        if (addMore) {
          // Navigate to customer details page after a short delay to ensure save is complete
          setTimeout(() => {
            if (customer.customerId) {
              this.router.navigate(['/customers', customer.customerId]);
            }
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error creating customer:', error);
        alert('Failed to create customer. Please try again.');
      }
    });
  }

  resetForm() {
    this.newCustomer = {};
    this.phoneInput = '';
    this.writeToCrm = false;
  }

  deleteCustomer(customer: Customer) {
    if (customer.customerId) {
      this.customerService.deleteCustomer(customer.customerId).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          alert('Failed to delete customer. Please try again.');
        }
      });
    }
  }
}
