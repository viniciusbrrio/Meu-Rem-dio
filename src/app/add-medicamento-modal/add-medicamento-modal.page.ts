import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicamentoService } from '../services/medicamento.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-add-medicamento-modal',
  templateUrl: './add-medicamento-modal.page.html',
  styleUrls: ['./add-medicamento-modal.page.scss'],
})

export class AddMedicamentoModalPage implements OnInit {
  medicamentoForm!: FormGroup;
  user!: User; // Certifique-se que o user está corretamente inicializado
  medicamentos: any[] = []; // Variável para armazenar os medicamentos

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private medicamentoService: MedicamentoService
  ) {}

  async ngOnInit() {
    this.medicamentoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      dosagem: ['', Validators.required],
      qnt: ['', Validators.required],
      dias: ['', [Validators.required, Validators.min(1)]],
      horario: ['', Validators.required]
    });

    // Verifique se o `user` foi inicializado corretamente antes de buscar os medicamentos
    if (this.user && this.user.id) {
      // Atualiza a lista com os medicamentos salvos
      this.medicamentos = await this.medicamentoService.getMedicamentos(this.user.id);
    } else {
      console.error("O usuário não está definido ou o ID está ausente.");
    }
  }

  // Fechar o modal sem adicionar
  dismissModal() {
    this.modalController.dismiss();
  }

  // Adicionar o medicamento e fechar o modal
  async addMedicamento() {
    if (this.medicamentoForm.valid) {
      const medicamento = {
        ...this.medicamentoForm.value,
        userId: this.user.id // Adiciona o userId ao medicamento
      };

      // Tenta adicionar o medicamento via serviço
      try {
        await this.medicamentoService.addMedicamento(medicamento);
        console.log('Medicamento adicionado com sucesso:', medicamento);
        
        // Atualiza a lista local de medicamentos
        this.medicamentos.push(medicamento);
        
        // Fechar o modal e passar os dados do novo medicamento
        this.modalController.dismiss(medicamento);
      } catch (error) {
        console.error('Erro ao adicionar medicamento:', error);
      }
    } else {
      console.log('Formulário inválido, verifique os campos.');
    }
  }
}




