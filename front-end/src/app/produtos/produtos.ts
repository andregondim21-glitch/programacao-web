import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { Produto } from '../model/produto';
import { ProdutoService } from '../service/produto-service';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-produtos',
  templateUrl: './produtos.html',
})
export class Produtos implements OnInit {
  private servico = inject(ProdutoService);
  private plataforma = inject(PLATFORM_ID);

  lista = signal<Produto[]>([]);
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
        this.erro.set('Não foi possível carregar os produtos. Verifique se o back-end está rodando na porta 8081.');
        this.carregando.set(false);
      },
    });
  }
}
