import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss'],
})
export class PainelPage implements OnInit {
  user: User | undefined; // A variável pode ser indefinida se o utilizador não for encontrado

  items = [
    { title: 'Remédios' },
    { title: 'Pressão' },
    { title: 'Glicose' },
    { title: 'Receitas' },
    { title: 'Anotações' },
    { title: 'Consulta' }
  ];

  constructor(
    private route: ActivatedRoute, 
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obter o ID a partir da rota
    const userId: string | null = this.route.snapshot.paramMap.get('id');
    
    // Usar o serviço para obter os dados do utilizador com base no ID
    if (userId) {
      // Subscrição ao Observable para obter o utilizador
      this.userService.getUserById(userId).subscribe((user) => {
        this.user = user;

        // Verificar se o utilizador foi encontrado
        if (!this.user) {
          console.error(`Utilizador com ID ${userId} não foi encontrado.`);
        }
      });
    } else {
      console.error('Nenhum ID de utilizador foi fornecido na rota.');
    }
  }

}
