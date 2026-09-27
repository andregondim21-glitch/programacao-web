import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantidade: number;
}

/**
 * Guarda os itens do carrinho em memória (Angular Signals). É injetado
 * pela Home (para adicionar produtos), pelo Carrinho (para listar/alterar)
 * e pelo Checkout (para mostrar o resumo do pedido e limpar ao confirmar).
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _itens = signal<CartItem[]>([]);

  readonly itens = this._itens.asReadonly();

  readonly totalItens = computed(() =>
    this._itens().reduce((soma, item) => soma + item.quantidade, 0)
  );

  readonly totalPreco = computed(() =>
    this._itens().reduce((soma, item) => soma + item.quantidade * item.product.preco, 0)
  );

  adicionar(product: Product): void {
    const itens = this._itens();
    const existente = itens.find((item) => item.product.id === product.id);

    if (existente) {
      this.alterarQuantidade(product.id, 1);
      return;
    }

    this._itens.set([...itens, { product, quantidade: 1 }]);
  }

  alterarQuantidade(productId: string, delta: number): void {
    this._itens.update((itens) =>
      itens
        .map((item) =>
          item.product.id === productId ? { ...item, quantidade: item.quantidade + delta } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  remover(productId: string): void {
    this._itens.update((itens) => itens.filter((item) => item.product.id !== productId));
  }

  limpar(): void {
    this._itens.set([]);
  }
}
