import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Aceita "00000-000" ou "00000000"; exige exatamente 8 dígitos. */
export function cepValido(control: AbstractControl): ValidationErrors | null {
  const valor = (control.value || '').replace(/\D/g, '');
  if (!valor) return null;
  return valor.length === 8 ? null : { cepInvalido: true };
}
