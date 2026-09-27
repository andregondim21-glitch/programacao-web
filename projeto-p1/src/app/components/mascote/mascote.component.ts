import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Especie } from '../../models/pet.model';

export type EstadoMascote = 'feliz' | 'triste' | 'alerta' | 'neutro';

/**
 * Bolt, o mascote da loja. É reutilizado em toda a aplicação (home,
 * carrinho, checkout, mensagens de erro) trocando apenas @Input()s,
 * o que mantém a identidade visual padronizada em todas as telas.
 */
@Component({
  selector: 'app-mascote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mascote.component.html',
  styleUrl: './mascote.component.css',
})
export class MascoteComponent {
  @Input() mensagem = '';
  @Input() estado: EstadoMascote = 'neutro';
  @Input() especie: Especie | null = null;

  get especieTexto(): string {
    switch (this.especie) {
      case 'gato':
        return 'gato';
      case 'ave':
        return 'ave';
      case 'outro':
        return 'outro';
      default:
        return 'cachorro'; 
    }
  }

  get expressao(): string {
    switch (this.estado) {
      case 'feliz':
        return '😊';
      case 'triste':
        return '😢';
      case 'alerta':
        return '❗';
      default:
        return '';
    }
  }
}
