import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpenFDAService {
  private baseUrl = 'https://api.fda.gov/drug';

  constructor(private http: HttpClient) {}

  buscarMedicamento(nome: string): Observable<any> {
    const url = `${this.baseUrl}/label.json`;
    const params = {
      search: `brand_name:"${nome}" OR generic_name:"${nome}"`,
      limit: '10'
    };

    return this.http.get(url, { params }).pipe(
      map((response: any) => response.results)
    );
  }

  buscarEfeitosColaterais(medicamentoId: string): Observable<any> {
    const url = `${this.baseUrl}/event.json`;
    const params = {
      search: `drug.openfda.product_ndc:"${medicamentoId}"`,
      limit: '100'
    };

    return this.http.get(url, { params });
  }

  buscarRecalls(medicamentoId: string): Observable<any> {
    const url = `${this.baseUrl}/enforcement.json`;
    const params = {
      search: `openfda.product_ndc:"${medicamentoId}"`,
      limit: '10'
    };

    return this.http.get(url, { params });
  }
}