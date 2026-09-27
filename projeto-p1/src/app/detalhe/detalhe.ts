import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';
import { Especie } from '../models/pet.model';

const ROTULOS_ESPECIE: Record<Especie, string> = {
  cachorro: 'Cachorros',
  gato: 'Gatos',
  ave: 'Aves',
  outro: 'Outros pets',
};

/** Chave usada pela Home para guardar o produto escolhido em "Ver mais". */
const CHAVE_PRODUTO_SELECIONADO = 'products.data';

@Component({
  imports: [CommonModule],
  selector: 'app-detalhe',
  styleUrl: './detalhe.css',
  templateUrl: './detalhe.html',
})
export class Detalhe implements OnInit {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  /** Produto exibido na tela; null se o usuário chegar aqui sem ter clicado em "Ver mais". */
  produto: Product | null = null;

  adicionado = false;

  ngOnInit(): void {
    const armazenado = localStorage.getItem(CHAVE_PRODUTO_SELECIONADO);
    this.produto = armazenado ? (JSON.parse(armazenado) as Product) : null;
  }

  adicionarAoCarrinho(): void {
    if (!this.produto) return;

    this.cartService.adicionar(this.produto);
    this.adicionado = true;
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

  /** Converte a lista de espécies do produto em texto legível ("Cachorros, Gatos"). */
  get especiesTexto(): string {
    if (!this.produto || this.produto.especies.length === 0) return '';
    return this.produto.especies.map((especie) => ROTULOS_ESPECIE[especie]).join(', ');
  }
}
