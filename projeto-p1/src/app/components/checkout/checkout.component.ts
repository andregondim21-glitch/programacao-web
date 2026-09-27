import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PetService } from '../../services/pet.service';
import { cepValido } from '../../validators/cep.validator';
import { cpfValido } from '../../validators/cpf.validator';
import { MascoteComponent } from '../mascote/mascote.component';

export type FormaPagamento = 'cartao' | 'pix' | 'boleto';

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

  @Output() pedidoConfirmado = new EventEmitter<void>();

  enviado = false;
  pedidoConfirmadoComSucesso = false;

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

    this.cartService.limpar();
    this.pedidoConfirmadoComSucesso = true;
    this.pedidoConfirmado.emit();
  }
}
