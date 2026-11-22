import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { API_URL } from '../config/api.config';
import { Pet } from '../models/pet.model';
import { mensagemDeErro } from '../utils/erro-api';
import { AuthService } from './auth.service';

/**
 * Guarda o pet atual em memória (via Angular Signals) para personalizar a loja
 * (home, carrinho, checkout, mascote etc).
 *
 * Com o cliente logado, o pet também é gravado no banco (tabela pet, ligada ao cliente).
 * Sem login ele fica só em memória e é gravado assim que a pessoa entrar ou se cadastrar.
 */
@Injectable({ providedIn: 'root' })
export class PetService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private readonly _pet = signal<Pet | null>(null);

  /** Pet atualmente cadastrado (somente leitura fora do serviço). */
  readonly pet = this._pet.asReadonly();

  /** Facilita usar *ngIf em templates sem checar "!== null" toda hora. */
  readonly temPetCadastrado = computed(() => this._pet() !== null);

  /** Mensagem de erro ao gravar o pet no banco (null quando está tudo certo). */
  readonly erro = signal<string | null>(null);

  cadastrarPet(pet: Pet): void {
    this._pet.set(pet); // personaliza a loja na hora, sem esperar a API
    this.erro.set(null);
    this.persistir(pet);
  }

  /** Chamado logo depois de login/cadastro: grava o pet que estava só em memória ou carrega os pets da conta. */
  aoAutenticar(clienteId: number): void {
    const local = this._pet();

    if (local && local.id === undefined) {
      this.persistir(local);
      return;
    }

    this.http.get<Pet[]>(`${API_URL}/clientes/${clienteId}/pets`).subscribe({
      next: (pets) => {
        // A API devolve do mais recente para o mais antigo
        if (pets.length > 0) {
          this._pet.set(pets[0]);
        }
      },
      error: () => {
        // Sem pets carregados a loja continua funcionando normalmente
      },
    });
  }

  limparPet(): void {
    this._pet.set(null);
    this.erro.set(null);
  }

  private persistir(pet: Pet): void {
    const cliente = this.auth.cliente();
    if (!cliente) {
      return;
    }

    this.http.post<Pet>(`${API_URL}/clientes/${cliente.id}/pets`, pet).subscribe({
      next: (salvo) => this._pet.set(salvo),
      error: (e) =>
        this.erro.set(mensagemDeErro(e, 'Não foi possível salvar o pet no servidor.')),
    });
  }

  /** Mensagem que o mascote (Bolt) exibe, com ou sem pet cadastrado. */
  saudacaoPersonalizada(): string {
    const pet = this._pet();

    if (!pet) {
      return 'Olá! Antes de começar, me conta mais sobre o seu pet...';
    }

    return `Preparamos ofertas especiais para o seu pet ${pet.nome}`;
  }
}
