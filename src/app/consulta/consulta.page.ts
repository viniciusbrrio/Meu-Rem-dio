import { Component } from '@angular/core';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage {
  consulta = {
    titulo: '',
    medico: '',
    hora: '',
    localizacao: '',
    observacoes: ''
  };

  constructor() {}

  salvarConsulta() {
    // Aqui você pode implementar a lógica de salvar as informações.
    // Por exemplo, enviar os dados para um serviço ou salvar localmente.
    console.log('Consulta salva:', this.consulta);
  }
}
