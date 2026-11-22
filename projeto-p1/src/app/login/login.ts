import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PetService } from '../services/pet.service';
import { mensagemDeErro } from '../utils/erro-api';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly petService = inject(PetService);
  private readonly router = inject(Router);

  enviado = false;
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
    lembrar: [false],
  });

  get email() {
    return this.form.controls.email;
  }
  get senha() {
    return this.form.controls.senha;
  }

  entrar(): void {
    this.enviado = true;
    this.erro.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, senha, lembrar } = this.form.getRawValue();
    this.carregando.set(true);

    this.auth.login(email, senha, lembrar).subscribe({
      next: (cliente) => {
        this.petService.aoAutenticar(cliente.id);
        this.carregando.set(false);
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.erro.set(mensagemDeErro(e, 'Não foi possível entrar. Tente novamente.'));
        this.carregando.set(false);
      },
    });
  }
}
