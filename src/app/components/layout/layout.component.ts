import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CustomerService } from '../../services/customer.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarModule, ButtonModule],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      <!-- Mobile Header -->
      <div class="mobile-header lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30 border-b border-gray-200">
        <div class="flex items-center justify-between p-4">
          <button (click)="sidebarVisible = true" class="p-2 hover:bg-gray-100 rounded-lg touch-target">
            <i class="pi pi-bars text-xl text-gray-700"></i>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-800 rounded flex items-center justify-center">
              <svg class="w-5 h-5 text-white" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8C2 8 4 6 6 6C8 6 10 8 10 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M10 8C10 8 12 6 14 6C16 6 18 8 18 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M2 8C2 8 4 10 6 10C8 10 10 8 10 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M10 8C10 8 12 10 14 10C16 10 18 8 18 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="font-bold text-lg text-black">Wavze</span>
          </div>
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            JJ
          </div>
        </div>
      </div>

      <!-- Mobile Drawer Sidebar -->
      <p-sidebar [(visible)]="sidebarVisible" 
                 [modal]="true" 
                 [dismissible]="true"
                 [showCloseIcon]="false"
                 styleClass="mobile-sidebar lg:hidden"
                 [style]="{width: '280px'}">
        <ng-template pTemplate="header">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-800 rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-white" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 8C2 8 4 6 6 6C8 6 10 8 10 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                  <path d="M10 8C10 8 12 6 14 6C16 6 18 8 18 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                  <path d="M2 8C2 8 4 10 6 10C8 10 10 8 10 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                  <path d="M10 8C10 8 12 10 14 10C16 10 18 8 18 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </div>
              <span class="font-bold text-lg text-black">Wavze</span>
            </div>
            <button (click)="sidebarVisible = false" class="p-2 hover:bg-gray-100 rounded-lg">
              <i class="pi pi-times text-gray-600"></i>
            </button>
          </div>
        </ng-template>

        <!-- Mobile Navigation -->
        <nav class="flex-1 py-4">
          <ul class="space-y-1">
            <li>
              <a [routerLink]="['/dashboard']" 
                 (click)="sidebarVisible = false"
                 routerLinkActive="bg-blue-50 text-blue-900"
                 class="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 touch-target">
                <i class="pi pi-home text-lg"></i>
                <span class="font-medium">Home</span>
              </a>
            </li>
            <li>
              <a [routerLink]="['/customers']" 
                 (click)="sidebarVisible = false"
                 routerLinkActive="bg-blue-50 text-blue-900"
                 class="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 touch-target">
                <i class="pi pi-users text-lg"></i>
                <span class="font-medium">Customers</span>
                <span class="ml-auto bg-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">{{ customerCount }}</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 touch-target">
                <i class="pi pi-comments text-lg"></i>
                <span class="font-medium">Conversations</span>
              </a>
            </li>
          </ul>

          <div class="border-t border-gray-300 my-4"></div>

          <ul class="space-y-1">
            <li>
              <a href="#" class="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 touch-target">
                <i class="pi pi-cog text-lg"></i>
                <span class="font-medium">Settings</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 touch-target">
                <i class="pi pi-question-circle text-lg"></i>
                <span class="font-medium">Help</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 touch-target">
                <i class="pi pi-send text-lg"></i>
                <span class="font-medium">Send feedback</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Mobile User Profile -->
        <div class="border-t border-gray-300 p-4 mt-auto">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              JJ
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">Jane Jones</p>
              <p class="text-xs text-gray-600">j.jones&#64;taranginc.com</p>
            </div>
            <i class="pi pi-ellipsis-v text-gray-600"></i>
          </div>
        </div>
      </p-sidebar>

      <!-- Desktop Sidebar -->
      <aside class="hidden lg:flex w-64 bg-gray-100 flex-col">
        <!-- Logo -->
        <div class="p-4 bg-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-800 rounded flex items-center justify-center relative overflow-hidden" style="background-color: #1e3a8a;">
              <svg class="w-5 h-5 text-white" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8C2 8 4 6 6 6C8 6 10 8 10 8" 
                      stroke="white" 
                      stroke-width="2.5" 
                      stroke-linecap="round"/>
                <path d="M10 8C10 8 12 6 14 6C16 6 18 8 18 8" 
                      stroke="white" 
                      stroke-width="2.5" 
                      stroke-linecap="round"/>
                <path d="M2 8C2 8 4 10 6 10C8 10 10 8 10 8" 
                      stroke="white" 
                      stroke-width="2.5" 
                      stroke-linecap="round"/>
                <path d="M10 8C10 8 12 10 14 10C16 10 18 8 18 8" 
                      stroke="white" 
                      stroke-width="2.5" 
                      stroke-linecap="round"/>
              </svg>
            </div>
            <span class="font-bold text-lg text-black">Wavze</span>
          </div>
          <i class="pi pi-th-large text-gray-600 cursor-pointer hover:text-gray-900"></i>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4">
          <ul class="space-y-2">
            <li>
              <a [routerLink]="['/dashboard']" 
                 routerLinkActive="bg-blue-50 text-blue-900"
                 class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors text-gray-700">
                <i class="pi pi-home"></i>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a [routerLink]="['/customers']" 
                 routerLinkActive="bg-blue-50 text-blue-900"
                 class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors text-gray-700">
                <i class="pi pi-users"></i>
                <span>Customers</span>
                <span class="ml-auto bg-gray-300 text-gray-600 text-xs px-2 py-0.5 rounded-full font-normal">{{ customerCount }}</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors text-gray-700">
                <i class="pi pi-comments"></i>
                <span>Conversations</span>
              </a>
            </li>
          </ul>

          <div class="border-t border-gray-300 my-4"></div>

          <ul class="space-y-2">
            <li>
              <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors text-gray-700">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors text-gray-700">
                <i class="pi pi-question-circle"></i>
                <span>Help</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors text-gray-700">
                <i class="pi pi-send"></i>
                <span>Send feedback</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Welcome Popup -->
        <div class="p-4" *ngIf="showWelcome">
          <div class="bg-blue-50 rounded-lg p-3 relative border border-blue-100">
            <button (click)="showWelcome = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <i class="pi pi-times text-xs"></i>
            </button>
            <div class="flex items-start gap-3 pr-6">
              <div class="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i class="pi pi-lightbulb text-black" style="font-size: 0.875rem; line-height: 1;"></i>
              </div>
              <div class="text-sm">
                <p class="font-semibold mb-1 text-gray-900">Welcome to Wavze early release.</p>
                <p class="text-gray-700 text-xs leading-relaxed">We hope you find it useful. Do let us know how we can make it better for you.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Profile -->
        <div class="p-4 border-t border-gray-300">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              JJ
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">Jane Jones</p>
              <p class="text-xs text-gray-600">j.jones&#64;taranginc.com</p>
            </div>
            <i class="pi pi-ellipsis-v text-gray-600"></i>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto mobile-main-content lg:ml-0">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [`
    .mobile-header {
      height: 64px;
    }

    .mobile-main-content {
      padding-top: 64px;
    }

    @media (min-width: 1024px) {
      .mobile-main-content {
        padding-top: 0;
      }
    }

    .touch-target {
      min-height: 44px;
      min-width: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    ::ng-deep .mobile-sidebar .p-sidebar {
      height: 100vh;
    }

    ::ng-deep .mobile-sidebar .p-sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    ::ng-deep .mobile-sidebar .p-sidebar-content {
      padding: 0 1rem;
      display: flex;
      flex-direction: column;
      height: calc(100% - 60px);
    }

    .dragging {
      opacity: 0.8;
      cursor: grabbing !important;
      z-index: 1000;
    }
  `]
})
export class LayoutComponent implements OnInit {
  showWelcome = true;
  customerCount = 0;
  sidebarVisible = false;
  isMobile = false;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    this.loadCustomerCount();
    this.isMobile = this.platformService.isNative();
  }

  loadCustomerCount() {
    this.customerService.getAllCustomers().subscribe((customers) => {
      this.customerCount = customers.length;
    });
  }
}

