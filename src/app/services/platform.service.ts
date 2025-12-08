import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  
  constructor() { }

  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  }

  isIOS(): boolean {
    return Capacitor.getPlatform() === 'ios';
  }

  isWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

  getPlatform(): string {
    return Capacitor.getPlatform();
  }
}

