import { Injectable, computed, signal } from '@angular/core';
import { Pet } from '../models/pet.model';

/**
 * Guarda o pet cadastrado pelo usuário em memória (via Angular Signals)
 * e é injetado em qualquer componente que precise personalizar a loja
 * com base no pet (home, carrinho, checkout, mascote etc).
 */
@Injectable({ providedIn: 'root' })
export class PetService {
  private readonly _pet = signal<Pet | null>(null);

  /** Pet atualmente cadastrado (somente leitura fora do serviço). */
  readonly pet = this._pet.asReadonly();

  /** Facilita usar *ngIf em templates sem checar "!== null" toda hora. */
  readonly temPetCadastrado = computed(() => this._pet() !== null);

  cadastrarPet(pet: Pet): void {
    this._pet.set(pet);
  }

  limparPet(): void {
    this._pet.set(null);
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
