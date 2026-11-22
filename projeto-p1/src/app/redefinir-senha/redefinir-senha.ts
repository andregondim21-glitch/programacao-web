import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { mensagemDeErro } from '../utils/erro-api';

function senhasIguais(grupo: AbstractControl): ValidationErrors | null {
  const senha = grupo.get('novaSenha')?.value;
  const confirmar = grupo.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhasDiferentes: true };
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-redefinir-senha',
  styleUrl: '../cadastro/cadastro.css',
  templateUrl: './redefinir-senha.html',
})
export class RedefinirSenha {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  enviado = false;
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly concluido = signal(false);

  /** O link de redefinição traz o código em ?token=...; se vier sem ele, a pessoa cola o código. */
  readonly tokenNoLink = (this.route.snapshot.queryParamMap.get('token') ?? '').trim();

  form = this.fb.nonNullable.group(
    {
      token: [this.tokenNoLink, Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
    },
    { validators: senhasIguais }
  );

  get token() {
    return this.form.controls.token;
  }
  get novaSenha() {
    return this.form.controls.novaSenha;
  }
  get confirmarSenha() {
    return this.form.controls.confirmarSenha;
  }

  redefinir(): void {
    this.enviado = true;
    this.erro.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { token, novaSenha } = this.form.getRawValue();
    this.carregando.set(true);

    this.auth.redefinirSenha(token, novaSenha).subscribe({
      next: () => {
        this.concluido.set(true);
        this.carregando.set(false);
      },
      error: (e) => {
        this.erro.set(mensagemDeErro(e, 'Não foi possível redefinir a senha. Tente novamente.'));
        this.carregando.set(false);
      },
    });
  }
}
