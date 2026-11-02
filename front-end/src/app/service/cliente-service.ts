import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../model/cliente';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${API_URL}/api/clientes`);
  }
}
