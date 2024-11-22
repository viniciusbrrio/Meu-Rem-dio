declare const google: any;

import { Component, OnInit } from '@angular/core';
import { GoogleMapsService } from '../services/google-maps.service';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-farmacias-proximas',
  templateUrl: './farmacias-proximas.page.html',
  styleUrls: ['./farmacias-proximas.page.scss'],
})
export class FarmaciasProximasPage implements OnInit {
  farmacias: any[] = [];
  hasPermission: boolean = false;

  constructor(private googleMapsService: GoogleMapsService) {}

  async ngOnInit() {
    await this.checkGeolocationPermission();
  }

  async checkGeolocationPermission() {
    if (Capacitor.isNativePlatform()) {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        this.hasPermission = true;
        await this.googleMapsService.loadGoogleMaps();
        this.atualizarLocalizacao();
      } else {
        console.error('Permissão de localização negada.');
        this.hasPermission = false;
      }
    } else {
      if (navigator.geolocation) {
        this.hasPermission = true;
        await this.googleMapsService.loadGoogleMaps();
        this.atualizarLocalizacao();
      } else {
        console.error('Geolocalização não é suportada no navegador.');
        this.hasPermission = false;
      }
    }
  }

  async atualizarLocalizacao() {
    if (this.hasPermission) {
      if (Capacitor.isNativePlatform()) {
        try {
          const position = await Geolocation.getCurrentPosition();
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;
          console.log('Localização obtida:', position);
          await this.googleMapsService.loadGoogleMaps();
          this.buscarFarmaciasProximas(userLatitude, userLongitude);
        } catch (error) {
          console.error('Erro ao obter localização:', error);
        }
      } else {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;
            console.log('Localização obtida:', position);
            await this.googleMapsService.loadGoogleMaps(); // Aguarde o carregamento do Google Maps
            this.buscarFarmaciasProximas(userLatitude, userLongitude);
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
          }
        );
      }
    } else {
      console.error('Permissão de localização não concedida.');
    }
  }

  async buscarFarmaciasProximas(latitude: number, longitude: number) {
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      location: new google.maps.LatLng(latitude, longitude),
      radius: 5000, // Busca dentro de 5 km
      type: ['pharmacy']
    };

    service.nearbySearch(request, async (results: any[], status: any) => {
      console.log('Resultados da busca:', results, 'Status:', status); // Log aqui
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Mapeia as farmácias, mas sem o telefone por enquanto
        const farmaciasDetalhadas = await Promise.all(results.map(farmacia => this.obterDetalhesFarmacia(service, farmacia.place_id)));
        
        this.farmacias = farmaciasDetalhadas.map(farmacia => ({
          nome: farmacia.name,
          telefone: farmacia.formatted_phone_number || 'Não disponível',
          endereco: farmacia.vicinity
        }));

        console.log('Farmácias encontradas:', this.farmacias); 
      } else {
        console.error('Erro ao buscar farmácias:', status);
      }
    });
  }

  obterDetalhesFarmacia(service: any, placeId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      service.getDetails({ placeId: placeId }, (details: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(details);
        } else {
          console.error('Erro ao obter detalhes da farmácia:', status);
          resolve({}); // Retorna um objeto vazio em caso de erro
        }
      });
    });
  }
}
