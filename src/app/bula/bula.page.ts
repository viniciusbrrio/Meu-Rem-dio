import { Component } from '@angular/core';
import { OpenFDAService } from '../services/open-fda.service'; // Alterado para o OpenFDAService
import { LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-bula',
  templateUrl: './bula.page.html',
  styleUrls: ['./bula.page.scss']
})
export class BulaPage {
  termoPesquisa: string = '';
  bula: any[] = [];  // Atualizado para usar qualquer estrutura retornada pela API
  carregando: boolean = false;
  erro: string | null = null;
  private pesquisaSubject = new Subject<string>();

  constructor(
    private openFDAService: OpenFDAService,  // Alterado para o OpenFDAService
    private loadingCtrl: LoadingController
  ) {
    this.configurarPesquisa();
  }

  configurarPesquisa() {
    this.pesquisaSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(termo => {
      if (termo) {
        this.executarPesquisa(termo);
      }
    });
  }

  onPesquisaChange(evento: any) {
    this.pesquisaSubject.next(evento.detail.value);
  }

  async executarPesquisa(termo: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Searching medications...'
    });
    await loading.present();

    this.carregando = true;
    this.erro = null;

    // Chama o método buscarMedicamento do OpenFDAService
    this.openFDAService.buscarMedicamento(termo)
      .subscribe({
        next: (resultado) => {
          this.bula = resultado.map((item: any) => ({
            name: item.openfda.brand_name ? item.openfda.brand_name[0] : 'Unknown', 
            activeIngredient: item.active_ingredient ? item.active_ingredient[0] : 'Not specified', 
            labeler: item.openfda.manufacturer_name ? item.openfda.manufacturer_name[0] : 'Unknown',
            pdfUrl: `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=${item.id}`
          }));
          loading.dismiss();
          this.carregando = false;
        },
        error: (error) => {
          console.error('Error in search:', error);
          this.erro = 'Medicamento não encontrado. Tente novamente..';
          loading.dismiss();
          this.carregando = false;
        }
      });
  }

  abrirBula(med: any) {
    if (med.pdfUrl) {
      window.open(med.pdfUrl, '_blank');
    }
  }

  async verDetalhes(med: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading details...'
    });
    await loading.present();

    this.openFDAService.buscarEfeitosColaterais(med.id)
      .subscribe({
        next: (detalhes) => {
          console.log('Detalhes:', detalhes);
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error loading details:', error);
          loading.dismiss();
        }
      });
  }
}
