import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PetService } from '../services/pet.service';
import { cepValido } from '../validators/cep.validator';
import { cpfValido } from '../validators/cpf.validator';
import { mensagemDeErro } from '../utils/erro-api';

/** Confere se "Confirmar senha" é igual a "Senha" (validação do grupo todo). */
function senhasIguais(grupo: AbstractControl): ValidationErrors | null {
  const senha = grupo.get('senha')?.value;
  const confirmar = grupo.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhasDiferentes: true };
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-cadastro',
  styleUrl: './cadastro.css',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly petService = inject(PetService);
  private readonly router = inject(Router);

  enviado = false;
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  form = this.fb.nonNullable.group(
    {
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      cpf: ['', [Validators.required, cpfValido]],
      cep: ['', [Validators.required, cepValido]],
      endereco: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      termos: [false, Validators.requiredTrue],
    },
    { validators: senhasIguais }
  );

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
  get endereco() {
    return this.form.controls.endereco;
  }
  get senha() {
    return this.form.controls.senha;
  }
  get confirmarSenha() {
    return this.form.controls.confirmarSenha;
  }
  get termos() {
    return this.form.controls.termos;
  }

  cadastrar(): void {
    this.enviado = true;
    this.erro.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { confirmarSenha, termos, ...dados } = this.form.getRawValue();
    this.carregando.set(true);

    this.auth.cadastrar(dados).subscribe({
      next: (cliente) => {
        // Já fica logado; se havia um pet só em memória, ele é gravado na conta nova
        this.petService.aoAutenticar(cliente.id);
        this.carregando.set(false);
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.erro.set(mensagemDeErro(e, 'Não foi possível concluir o cadastro. Tente novamente.'));
        this.carregando.set(false);
      },
    });
  }
}
