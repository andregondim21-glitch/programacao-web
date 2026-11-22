import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Especie } from '../models/pet.model';
import { Product } from '../models/product.model';

/** Consulta o catálogo de produtos no back-end (MySQL). */
@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);

  /** Todos os produtos; se informar a espécie, só os indicados para ela. */
  listar(especie?: Especie): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/produtos`, especie ? { params: { especie } } : {});
  }

  buscarPorId(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/produtos/${id}`);
  }
}
