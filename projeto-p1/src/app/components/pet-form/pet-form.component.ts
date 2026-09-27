import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Pet } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';
import { MascoteComponent } from '../mascote/mascote.component';

/** Idade plausível para a maioria dos pets domésticos. */
function idadeValida(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (valor === null || valor === '') return null;
  return valor > 0 && valor <= 40 ? null : { idadeInvalida: true };
}

/** Peso plausível cobrindo de aves/roedores até cães de grande porte. */
function pesoValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (valor === null || valor === '') return null;
  return valor > 0 && valor <= 120 ? null : { pesoInvalido: true };
}

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MascoteComponent],
  templateUrl: './pet-form.component.html',
  // Sem styleUrl: o layout usa só classes do Bootstrap + src/styles.scss
})
export class PetFormComponent {
  private readonly fb = inject(FormBuilder);

  /** Público de propósito: o template usa petService.temPetCadastrado() e afins. */
  readonly petService = inject(PetService);

  @Output() petCadastrado = new EventEmitter<Pet>();

  enviado = false;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    especie: ['cachorro' as Pet['especie'], Validators.required],
    idade: [null as number | null, [Validators.required, idadeValida]],
    peso: [null as number | null, [Validators.required, pesoValido]],
  });

  get nome() {
    return this.form.controls.nome;
  }
  get especie() {
    return this.form.controls.especie;
  }
  get idade() {
    return this.form.controls.idade;
  }
  get peso() {
    return this.form.controls.peso;
  }

  salvar(): void {
    this.enviado = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const pet = this.form.getRawValue() as Pet;
    this.petService.cadastrarPet(pet);
    this.petCadastrado.emit(pet);
  }
}
