import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule],
  template: `
    <div class="p-6">
        <div class="grid grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="col-span-2">
            <!-- Customer Profile Header -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div class="flex items-start gap-4">
                <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {{ getInitials(customer) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <p-tag value="Follow Up" severity="warning"></p-tag>
                    <h1 class="text-3xl font-bold">{{ customer.fullName || (customer.firstName + ' ' + customer.lastName) }}</h1>
                  </div>
                  <div class="space-y-1 text-gray-600">
                    <p><i class="pi pi-envelope mr-2"></i>{{ customer.email }}</p>
                    <p><i class="pi pi-phone mr-2"></i>{{ customer.phone || formatPhone(customer.phn1Nbr) }}</p>
                    <p><i class="pi pi-map-marker mr-2"></i>{{ getAddress() }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Customer Details Table -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-semibold mb-4">Customer Details</h2>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Name</p>
                  <p class="font-medium">{{ customer.fullName || (customer.firstName + ' ' + customer.lastName) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Email</p>
                  <p class="font-medium">{{ customer.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Phone</p>
                  <p class="font-medium">{{ customer.phone || formatPhone(customer.phn1Nbr) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Address</p>
                  <p class="font-medium">{{ getAddress() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Time Zone</p>
                  <p class="font-medium">{{ customer.timeZone || 'EST' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Call window</p>
                  <p class="font-medium">10:00am - 2:00pm</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Attempts</p>
                  <p class="font-medium">3/5</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Contact</p>
                  <p class="font-medium">{{ customer.methodPref || 'Phone' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Created</p>
                  <p class="font-medium">{{ formatDate(customer.createTs) }}</p>
                </div>
              </div>
            </div>

            <!-- Products Section -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Products</h2>
              <div class="space-y-4">
                <div class="border rounded-lg p-4 flex items-start gap-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i class="pi pi-wallet text-purple-600 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <div>
                        <h3 class="font-semibold">Savings</h3>
                        <p class="text-sm text-gray-500">Website • {{ formatDate(customer.createTs) }}</p>
                      </div>
                      <p-tag value="Follow Up" severity="warning"></p-tag>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">Saving premium, with great interest rates and free debit card</p>
                    <div class="flex gap-2">
                      <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm"></button>
                      <button pButton icon="pi pi-trash" class="p-button-text p-button-sm"></button>
                    </div>
                  </div>
                </div>
                <div class="border rounded-lg p-4 flex items-start gap-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i class="pi pi-wallet text-purple-600 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <div>
                        <h3 class="font-semibold">Checking</h3>
                        <p class="text-sm text-gray-500">Website • 3/12/2023</p>
                      </div>
                      <p-tag value="Closed Won" severity="success"></p-tag>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">Checking premium, with great interest rates and free debit card</p>
                    <div class="flex gap-2">
                      <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm"></button>
                      <button pButton icon="pi pi-trash" class="p-button-text p-button-sm"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Panel -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Activity</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-semibold text-gray-700 mb-2">Yesterday</p>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <i class="pi pi-phone text-green-500 mt-1"></i>
                    <div>
                      <p class="text-sm font-medium">Phone Call</p>
                      <p class="text-xs text-gray-500">Follow-up on load application</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <i class="pi pi-video text-blue-500 mt-1"></i>
                    <div>
                      <p class="text-sm font-medium">Zoom Call</p>
                      <p class="text-xs text-gray-500">Discuss refinancing options</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-700 mb-2">3 days ago (Nov 16, 2025)</p>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <i class="pi pi-send text-blue-500 mt-1"></i>
                    <div>
                      <p class="text-sm font-medium">Email send</p>
                      <p class="text-xs text-gray-500">Follow-up on load application</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <i class="pi pi-inbox text-blue-500 mt-1"></i>
                    <div>
                      <p class="text-sm font-medium">Email received</p>
                      <p class="text-xs text-gray-500">Discuss refinancing options</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-700 mb-2">4 days ago (Nov 15, 2025)</p>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <i class="pi pi-phone text-green-500 mt-1"></i>
                    <div>
                      <p class="text-sm font-medium">Phone Call</p>
                      <p class="text-xs text-gray-500">Discuss refinancing options</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-700 mb-2">19 days ago (Nov 1, 2025)</p>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <i class="pi pi-phone text-green-500 mt-1"></i>
                    <div>
                      <p class="text-sm font-medium">Phone Call</p>
                      <p class="text-xs text-gray-500">Discuss refinancing options</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  `,
  styles: []
})
export class CustomerDetailsComponent implements OnInit {
  customer: Customer = {};

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

  getAddress(): string {
    // TODO: Get address from property relation
    return '2972 Westheimer Rd. Santa Ana, Illinois 85486';
  }
}
