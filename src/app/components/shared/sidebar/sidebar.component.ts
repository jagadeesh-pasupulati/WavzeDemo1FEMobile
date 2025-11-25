import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-gray-100 min-h-screen fixed left-0 top-0 flex flex-col">
      <!-- Logo -->
      <div class="bg-gray-100 p-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
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
            <a routerLink="/" routerLinkActive="bg-blue-100 text-blue-900" 
               class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-200 transition">
              <i class="pi pi-home"></i>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a routerLink="/customers" routerLinkActive="bg-blue-100 text-blue-900"
               class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-200 transition">
              <i class="pi pi-users"></i>
              <span>Customers</span>
              <span class="ml-auto bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">20</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-200 transition">
              <i class="pi pi-comments"></i>
              <span>Conversations</span>
            </a>
          </li>
        </ul>

        <hr class="my-4 border-gray-300">

        <ul class="space-y-2">
          <li>
            <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-200 transition">
              <i class="pi pi-cog"></i>
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-200 transition">
              <i class="pi pi-question-circle"></i>
              <span>Help</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-200 transition">
              <i class="pi pi-send"></i>
              <span>Send feedback</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Welcome Popup -->
      <div class="mx-4 mb-4 bg-blue-50 p-4 rounded-lg relative">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <i class="pi pi-times"></i>
        </button>
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <i class="pi pi-lightbulb text-black" style="font-size: 0.875rem; line-height: 1;"></i>
          </div>
          <div class="text-sm text-gray-700">
            <p class="font-semibold mb-1">Welcome to Wavze early release.</p>
            <p>We hope you find it useful. Do let us know how we can make it better for you.</p>
          </div>
        </div>
      </div>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-300">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">
            <i class="pi pi-user"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-sm">Jane Jones</p>
            <p class="text-xs text-gray-600">j.jones&#64;taranginc.com</p>
          </div>
          <i class="pi pi-ellipsis-v text-gray-500"></i>
        </div>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {}

