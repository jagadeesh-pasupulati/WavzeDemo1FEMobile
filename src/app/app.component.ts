import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { PlatformService } from './services/platform.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <router-outlet></router-outlet>
    </app-layout>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'Wavze';

  constructor(private platformService: PlatformService) {}

  async ngOnInit() {
    // Initialize Capacitor plugins for mobile
    if (this.platformService.isNative()) {
      await this.initializeApp();
    }
  }

  async initializeApp() {
    try {
      // Configure Status Bar
      if (this.platformService.isAndroid()) {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#1e40af' });
      }

      // Hide splash screen after app is ready
      await SplashScreen.hide();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
}
