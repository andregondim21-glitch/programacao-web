export type FormaPagamento = 'cartao' | 'pix' | 'boleto';

export interface ItemPedidoRequest {
  produtoId: number;
  quantidade: number;
}

/** Corpo do POST /api/pedidos. */
export interface PedidoRequest {
  clienteId: number;
  itens: ItemPedidoRequest[];
  cep: string;
  numero: string;
  endereco: string;
  formaPagamento: FormaPagamento;
  presente: boolean;
  mensagemPresente: string;
}

export interface ItemPedidoResponse {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  itens: ItemPedidoResponse[];
  valorTotal: number;
  status: string;
  dataPedido: string;
  formaPagamento: FormaPagamento;
  presente: boolean;
  mensagemPresente: string | null;
  cep: string;
  numero: string;
  endereco: string;
}
