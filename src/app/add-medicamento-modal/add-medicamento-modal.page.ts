import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicamentoService } from '../services/medicamento.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-medicamento-modal',
  templateUrl: './add-medicamento-modal.page.html',
  styleUrls: ['./add-medicamento-modal.page.scss'],
})
export class AddMedicamentoModalPage implements OnInit {
  medicamentoForm!: FormGroup;
  user!: User;
  medicamentos$: Observable<any[]> | undefined;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private medicamentoService: MedicamentoService
  ) {}

  ngOnInit() {
    this.medicamentoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      dosagem: ['', Validators.required],
      qnt: ['', [Validators.required, Validators.min(1)]],
      dias: ['', [Validators.required, Validators.min(1)]],
      dataInicio: ['', Validators.required]
    });

    if (this.user && this.user.id) {
      this.medicamentos$ = this.medicamentoService.getMedicamentos(this.user.id);
    } else {
      console.error("O usuário não está definido ou o ID está ausente.");
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  onDateTimeChange(event: any) {
    const date = new Date(event.detail.value);
    this.medicamentoForm.patchValue({ dataInicio: date });
  }

  async addMedicamento() {
    if (this.medicamentoForm.valid) {
      const medicamento = {
        ...this.medicamentoForm.value,
        userId: this.user.id
      };

      try {
        await this.medicamentoService.addMedicamento(medicamento);
        console.log('Medicamento adicionado com sucesso:', medicamento);
        this.modalController.dismiss(medicamento);
      } catch (error) {
        console.error('Erro ao adicionar medicamento:', error);
      }
    } else {
      console.log('Formulário inválido, verifique os campos.');
    }
  }
}
