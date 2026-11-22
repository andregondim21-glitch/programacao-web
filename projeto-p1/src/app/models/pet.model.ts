export type Especie = 'cachorro' | 'gato' | 'ave' | 'outro';

export interface Pet {
  /** Preenchido quando o pet já foi salvo no banco. */
  id?: number;
  nome: string;
  especie: Especie;
  idade: number;
  peso: number;
}
