import { Especie } from './pet.model';

export type Categoria = 'racao' | 'brinquedo' | 'higiene' | 'saude' | 'acessorio';

export interface Product {
  id: string;
  nome: string;
  categoria: Categoria;
  preco: number;
  promo: number;
  quantidade: number;
  descricao: string;
  especies: Especie[];
}
