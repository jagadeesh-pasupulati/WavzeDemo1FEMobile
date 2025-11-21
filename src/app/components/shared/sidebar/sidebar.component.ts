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
      <div class="bg-blue-900 text-white p-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span class="text-blue-900 font-bold text-xl">W</span>
          </div>
          <span class="font-semibold text-lg">Wavze</span>
        </div>
        <i class="pi pi-th-large text-white cursor-pointer"></i>
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
          <i class="pi pi-lightbulb text-blue-600 mt-1"></i>
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

