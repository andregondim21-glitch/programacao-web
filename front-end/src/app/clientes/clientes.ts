import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../service/cliente-service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.html',
})
export class Clientes implements OnInit {
  private servico = inject(ClienteService);
  private plataforma = inject(PLATFORM_ID);

  lista = signal<Cliente[]>([]);
  carregando = signal(true);
  erro = signal('');

  ngOnInit() {
    // só consulta o back-end no navegador (a página é pré-renderizada no build)
    if (isPlatformBrowser(this.plataforma)) this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.erro.set('');
    this.servico.listar().subscribe({
      next: (dados) => {
        this.lista.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os clientes. Verifique se o back-end está rodando na porta 8081.');
        this.carregando.set(false);
      },
    });
  }
}
