import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Pedido, PedidoRequest } from '../models/pedido.model';

/** Envia os pedidos para o back-end gravar no MySQL. */
@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);

  criar(pedido: PedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(`${API_URL}/pedidos`, pedido);
  }

  listarDoCliente(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${API_URL}/clientes/${clienteId}/pedidos`);
  }
}
