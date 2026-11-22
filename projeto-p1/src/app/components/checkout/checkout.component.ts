import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PedidoRequest } from '../../models/pedido.model';
import { precoFinal } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { PedidoService } from '../../services/pedido.service';
import { PetService } from '../../services/pet.service';
import { mensagemDeErro } from '../../utils/erro-api';
import { cepValido } from '../../validators/cep.validator';
import { cpfValido } from '../../validators/cpf.validator';
import { MascoteComponent } from '../mascote/mascote.component';

import { FormaPagamento } from '../../models/pedido.model';

export type { FormaPagamento };

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MascoteComponent],
  templateUrl: './checkout.component.html',
  // Sem styleUrl: o layout usa só classes do Bootstrap + src/styles.scss
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  readonly petService = inject(PetService);
  readonly cartService = inject(CartService);
  readonly auth = inject(AuthService);
  private readonly pedidoService = inject(PedidoService);

  readonly precoFinal = precoFinal;

  @Output() pedidoConfirmado = new EventEmitter<void>();

  enviado = false;
  readonly pedidoConfirmadoComSucesso = signal(false);
  readonly enviando = signal(false);
  readonly erroApi = signal<string | null>(null);

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, cpfValido]],
    cep: ['', [Validators.required, cepValido]],
    numero: ['', Validators.required],
    endereco: ['', Validators.required],
    formaPagamento: ['cartao' as FormaPagamento, Validators.required],
    presente: [false],
    mensagemPresente: [''],
  });

  constructor() {
    // Com o cliente logado, os dados pessoais e o endereço já vêm preenchidos
    const cliente = this.auth.cliente();
    if (cliente) {
      this.form.patchValue({
        nome: cliente.nome,
        email: cliente.email,
        cpf: cliente.cpf,
        cep: cliente.cep,
        endereco: cliente.endereco,
      });
    }

    // Validação condicional: só exige a mensagem de presente se a caixa
    // "é presente" estiver marcada. Isso é adicionado/removido em tempo
    // real, não é só um "required" fixo no campo.
    this.form.controls.presente.valueChanges.subscribe((ehPresente) => {
      const mensagem = this.form.controls.mensagemPresente;

      if (ehPresente) {
        mensagem.addValidators(Validators.required);
      } else {
        mensagem.clearValidators();
        mensagem.setValue('');
      }

      mensagem.updateValueAndValidity();
    });
  }

  get nome() {
    return this.form.controls.nome;
  }
  get email() {
    return this.form.controls.email;
  }
  get cpf() {
    return this.form.controls.cpf;
  }
  get cep() {
    return this.form.controls.cep;
  }
  get numero() {
    return this.form.controls.numero;
  }
  get endereco() {
    return this.form.controls.endereco;
  }
  get presente() {
    return this.form.controls.presente;
  }
  get mensagemPresente() {
    return this.form.controls.mensagemPresente;
  }

  get nomePet(): string | undefined {
    return this.petService.pet()?.nome;
  }

  confirmar(): void {
    this.enviado = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cliente = this.auth.cliente();
    if (!cliente) {
      this.erroApi.set('Entre na sua conta para finalizar a compra.');
      return;
    }

    const itens = this.cartService.itens();
    if (itens.length === 0) {
      this.erroApi.set('Seu carrinho está vazio.');
      return;
    }

    const dados = this.form.getRawValue();
    const pedido: PedidoRequest = {
      clienteId: cliente.id,
      itens: itens.map((item) => ({ produtoId: item.product.id, quantidade: item.quantidade })),
      cep: dados.cep ?? '',
      numero: dados.numero ?? '',
      endereco: dados.endereco ?? '',
      formaPagamento: dados.formaPagamento ?? 'cartao',
      presente: dados.presente ?? false,
      mensagemPresente: dados.mensagemPresente ?? '',
    };

    this.enviando.set(true);
    this.erroApi.set(null);

    this.pedidoService.criar(pedido).subscribe({
      next: () => {
        this.cartService.limpar();
        this.enviando.set(false);
        this.pedidoConfirmadoComSucesso.set(true);
        this.pedidoConfirmado.emit();
      },
      error: (e) => {
        this.enviando.set(false);
        this.erroApi.set(mensagemDeErro(e, 'Não foi possível confirmar o pedido. Tente novamente.'));
      },
    });
  }
}
