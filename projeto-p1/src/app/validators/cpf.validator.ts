import { AbstractControl, ValidationErrors } from '@angular/forms';

function apenasDigitos(valor: string): string {
  return (valor || '').replace(/\D/g, '');
}

function calcularDigitoVerificador(cpfParcial: string, pesoInicial: number): number {
  let soma = 0;
  for (let i = 0; i < cpfParcial.length; i++) {
    soma += Number(cpfParcial[i]) * (pesoInicial - i);
  }
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

/**
 * Valida CPF de verdade (dígitos verificadores), não só a quantidade de
 * caracteres. Aceita com ou sem pontuação (ex: "123.456.789-09" ou
 * "12345678909").
 */
export function cpfValido(control: AbstractControl): ValidationErrors | null {
  const cpf = apenasDigitos(control.value);

  if (!cpf) return null; // campo vazio é responsabilidade do Validators.required

  // Rejeita sequências repetidas (000..., 111..., etc), que passariam
  // no cálculo do dígito verificador mas não são CPFs válidos.
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return { cpfInvalido: true };
  }

  const digito1 = calcularDigitoVerificador(cpf.substring(0, 9), 10);
  const digito2 = calcularDigitoVerificador(cpf.substring(0, 10), 11);

  const valido = digito1 === Number(cpf[9]) && digito2 === Number(cpf[10]);
  return valido ? null : { cpfInvalido: true };
}
