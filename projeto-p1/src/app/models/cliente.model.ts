/** Cliente logado, como devolvido pela API (a senha nunca volta do back-end). */
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string;
  cep: string;
  endereco: string;
}

/** Dados enviados no cadastro de cliente. */
export interface NovoCliente {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  endereco: string;
  senha: string;
}
