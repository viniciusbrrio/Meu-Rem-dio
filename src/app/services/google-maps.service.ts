// google-maps.service.ts

import { Injectable } from '@angular/core';

// Declaração do namespace 'google' para evitar erros do TypeScript
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBZinOIYsyMmZksMmIux7NMhMX9Z0F8M70&libraries=places`; // Substitua YOUR_API_KEY pela sua chave
      script.async = true;
      script.defer = true;

      script.onload = () => {
        resolve();
      };

      script.onerror = (error: any) => {
        reject(error);
      };

      document.head.appendChild(script);
    });
  }
}
