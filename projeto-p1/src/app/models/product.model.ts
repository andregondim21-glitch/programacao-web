import { Especie } from './pet.model';

export type Categoria = 'racao' | 'brinquedo' | 'higiene' | 'saude' | 'acessorio';

/** Produto como vem da API (tabela produto do MySQL). */
export interface Product {
  /** Id numérico do banco; é o que o pedido usa para referenciar o produto. */
  id: number;
  /** Slug do produto (ex.: "racao-premium"); também é o nome do arquivo da imagem (racao-premium.jpg). */
  identificador: string;
  nome: string;
  categoria: Categoria;
  preco: number;
  promo: number;
  quantidade: number;
  descricao: string;
  especies: Especie[];
}

/** Preço que o cliente realmente paga: o promocional quando existe, senão o normal. */
export function precoFinal(produto: Product): number {
  return produto.promo > 0 ? produto.promo : produto.preco;
}
