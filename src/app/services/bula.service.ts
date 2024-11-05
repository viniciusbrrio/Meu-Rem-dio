import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bula } from '../interfaces/bula.interface';

@Injectable({
  providedIn: 'root'
})
export class BulaService {
  private apiUrl = 'https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames.json';
  
  constructor(private http: HttpClient) {}
  
  buscarBula(nome: string): Observable<Bula[]> {
    const params = {
      drug_name: nome,
      exact_match: 'false',
      response_type: 'json'
    };

    return this.http.get<any>(this.apiUrl, { params })
  .pipe(
    map((response: any) => {
      console.log('Response da API:', response); // Verifique o que é retornado
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      // Mapeamento dos dados
      return response.data.map((item: any) => ({
        setId: item.setid,
        title: item.title,
        name: item.drug_name,
        labeler: item.labeler || 'Não informado',
        activeIngredient: item.active_ingredient || 'Não informado',
        pdfUrl: `https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=${item.setid}&output=pdf`
      }));
    })
  );

  }

  obterDetalhes(setId: string): Observable<any> {
    return this.http.get(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setId}.json`);
  }
}