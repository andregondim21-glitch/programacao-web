import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, EsqueciSenhaResposta } from '../services/auth.service';
import { mensagemDeErro } from '../utils/erro-api';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-esqueci-senha',
  styleUrl: '../cadastro/cadastro.css',
  templateUrl: './esqueci-senha.html',
})
export class EsqueciSenha {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  enviado = false;
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly resposta = signal<EsqueciSenhaResposta | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email() {
    return this.form.controls.email;
  }

  solicitar(): void {
    this.enviado = true;
    this.erro.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando.set(true);

    this.auth.esqueciSenha(this.form.getRawValue().email).subscribe({
      next: (resposta) => {
        this.resposta.set(resposta);
        this.carregando.set(false);
      },
      error: (e) => {
        this.erro.set(mensagemDeErro(e, 'Não foi possível solicitar a redefinição. Tente novamente.'));
        this.carregando.set(false);
      },
    });
  }
}
