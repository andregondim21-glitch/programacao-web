import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Cliente, NovoCliente } from '../models/cliente.model';

const CHAVE_SESSAO = 'petshop.cliente';

export interface EsqueciSenhaResposta {
  mensagem: string;
  /** Só vem preenchido em desenvolvimento (back-end com petshop.reset-senha.expor-token=true). */
  token: string | null;
}

/**
 * Cuida de cadastro, login, logout e redefinição de senha.
 * O cliente logado fica num signal e é guardado no navegador para sobreviver ao F5:
 * em localStorage quando marcam "Lembrar de mim", senão em sessionStorage.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _cliente = signal<Cliente | null>(this.lerSessao());

  readonly cliente = this._cliente.asReadonly();
  readonly logado = computed(() => this._cliente() !== null);

  login(email: string, senha: string, lembrar: boolean): Observable<Cliente> {
    return this.http
      .post<Cliente>(`${API_URL}/auth/login`, { email, senha })
      .pipe(tap((cliente) => this.iniciarSessao(cliente, lembrar)));
  }

  /** Cadastra o cliente e já deixa a pessoa logada. */
  cadastrar(dados: NovoCliente): Observable<Cliente> {
    return this.http
      .post<Cliente>(`${API_URL}/clientes`, dados)
      .pipe(tap((cliente) => this.iniciarSessao(cliente, false)));
  }

  logout(): void {
    this.limparArmazenamento();
    this._cliente.set(null);
  }

  esqueciSenha(email: string): Observable<EsqueciSenhaResposta> {
    return this.http.post<EsqueciSenhaResposta>(`${API_URL}/auth/esqueci-senha`, { email });
  }

  redefinirSenha(token: string, novaSenha: string): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${API_URL}/auth/redefinir-senha`, {
      token,
      novaSenha,
    });
  }

  private iniciarSessao(cliente: Cliente, lembrar: boolean): void {
    this.limparArmazenamento();
    try {
      (lembrar ? localStorage : sessionStorage).setItem(CHAVE_SESSAO, JSON.stringify(cliente));
    } catch {
      // Armazenamento indisponível (modo privado, por exemplo): a sessão vale só até recarregar.
    }
    this._cliente.set(cliente);
  }

  private lerSessao(): Cliente | null {
    try {
      const bruto = localStorage.getItem(CHAVE_SESSAO) ?? sessionStorage.getItem(CHAVE_SESSAO);
      return bruto ? (JSON.parse(bruto) as Cliente) : null;
    } catch {
      return null;
    }
  }

  private limparArmazenamento(): void {
    try {
      localStorage.removeItem(CHAVE_SESSAO);
      sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {
      // ignora
    }
  }
}
