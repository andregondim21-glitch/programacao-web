import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extrai uma mensagem amigável de um erro de chamada à API.
 * O back-end responde erros no formato {"mensagem": "..."}.
 */
export function mensagemDeErro(erro: unknown, padrao: string): string {
  if (erro instanceof HttpErrorResponse) {
    if (erro.status === 0) {
      return 'Não foi possível conectar ao servidor. Verifique se o back-end está rodando.';
    }
    const mensagem = erro.error?.mensagem;
    if (typeof mensagem === 'string' && mensagem.length > 0) {
      return mensagem;
    }
  }
  return padrao;
}
