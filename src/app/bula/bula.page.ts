// src/app/pages/bula/bula.page.ts
import { Component } from '@angular/core';
import { BulaService } from '../services/bula.service';
import { Bula } from '../interfaces/bula.interface';
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
  bula: Bula[] = [];
  carregando: boolean = false;
  erro: string | null = null;
  private pesquisaSubject = new Subject<string>();

  constructor(
    private bulaService: BulaService,
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

    this.bulaService.buscarBula(termo)
      .subscribe({
        next: (resultado) => {
          this.bula = resultado;
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

  abrirBula(bula: Bula) {
    if (bula.pdfUrl) {
      window.open(bula.pdfUrl, '_blank');
    }
  }

  async verDetalhes(bula: Bula) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading details...'
    });
    await loading.present();

    this.bulaService.obterDetalhes(bula.setId)
      .subscribe({
        next: (detalhes) => {
          // Aqui você pode implementar a lógica para mostrar os detalhes
          // Por exemplo, abrir um modal com as informações
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
