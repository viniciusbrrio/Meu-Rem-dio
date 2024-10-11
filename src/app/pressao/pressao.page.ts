import { Component } from '@angular/core';

@Component({
  selector: 'app-pressao',
  templateUrl: './pressao.page.html',
  styleUrls: ['./pressao.page.scss'],
})
export class PressaoPage {
  // Defina a propriedade pressao como um objeto com os campos corretos
  pressao = {
    sistolica: '',
    diastolica: '',
    dataHora: ''
  };

  constructor() {}

  // Defina o método salvarPressao
  salvarPressao() {
    console.log('Pressão Arterial Registrada:', this.pressao);
    // Aqui você pode implementar a lógica de salvar os dados, por exemplo, em um backend ou localStorage.
  }
}
