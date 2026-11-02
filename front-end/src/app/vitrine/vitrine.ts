import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { Produto } from '../model/produto';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ItemCesta } from '../model/item-cesta';
import { ProdutoService } from '../service/produto-service';

@Component({
  imports: [CommonModule],
  selector: 'app-vitrine',
  styleUrl: './vitrine.css',
  templateUrl: './vitrine.html',
})
export class Vitrine {
  private servico = inject(ProdutoService);
  private plataforma = inject(PLATFORM_ID);

  lista = signal<Produto[]>([]);
  carregando = signal(true);
  erro = signal('');

  ngOnInit(){
    // só consulta o back-end no navegador (a página é pré-renderizada no build)
    if(isPlatformBrowser(this.plataforma)) this.carregar();
  }

  carregar(){
    this.carregando.set(true);
    this.erro.set('');
    this.servico.vitrine().subscribe({
      next: (dados) => {
        this.lista.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar a vitrine. Verifique se o back-end está rodando na porta 8081.');
        this.carregando.set(false);
      }
    });
  }

  verDetalhe(obj:Produto){
    localStorage.setItem("produto", JSON.stringify(obj));  
    location.href = "detalhe";
  }

  adicionarItem(obj:Produto){
    let cesta : ItemCesta[] = [];
    let achou : boolean = false;

    let json = localStorage.getItem("cesta");
    if(json!=null) {
      cesta = JSON.parse(json);
      for(let itm of cesta){
        if(itm.produto.codigo == obj.codigo) {
            itm.quantidade++;
            itm.valorTotal = itm.valorVenda * itm.quantidade;  
            achou = true;
        }    
      }
    } 
    if(!achou) cesta.push(new ItemCesta(obj));
    
    localStorage.setItem("cesta", JSON.stringify(cesta));
    location.href="cesta";
  }

}
