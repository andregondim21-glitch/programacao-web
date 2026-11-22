import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProdutoService } from '../services/produto.service';
import { Product } from '../models/product.model';
import { Especie } from '../models/pet.model';

const ROTULOS_ESPECIE: Record<Especie, string> = {
  cachorro: 'Cachorros',
  gato: 'Gatos',
  ave: 'Aves',
  outro: 'Outros pets',
};

@Component({
  imports: [CommonModule],
  selector: 'app-detalhe',
  styleUrl: './detalhe.css',
  templateUrl: './detalhe.html',
})
export class Detalhe implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly produtoService = inject(ProdutoService);
  readonly cartService = inject(CartService);

  /** Produto exibido na tela, buscado na API pelo id da rota (/detalhe/:id); null se não existir. */
  readonly produto = signal<Product | null>(null);
  readonly carregando = signal(true);

  adicionado = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.carregando.set(false);
      return;
    }

    this.produtoService.buscarPorId(id).subscribe({
      next: (produto) => {
        this.produto.set(produto);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  adicionarAoCarrinho(): void {
    const produto = this.produto();
    if (!produto) return;

    this.cartService.adicionar(produto);
    this.adicionado = true;
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

  /** Converte a lista de espécies do produto em texto legível ("Cachorros, Gatos"). */
  get especiesTexto(): string {
    const produto = this.produto();
    if (!produto || produto.especies.length === 0) return '';
    return produto.especies.map((especie) => ROTULOS_ESPECIE[especie]).join(', ');
  }
}
