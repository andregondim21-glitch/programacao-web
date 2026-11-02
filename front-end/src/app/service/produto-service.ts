import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../model/produto';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${API_URL}/api/produtos`);
  }

  vitrine(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${API_URL}/api/produto/vitrine`);
  }
}
