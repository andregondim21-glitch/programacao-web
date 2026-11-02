import { Component } from '@angular/core';
import { ItemCesta } from '../model/item-cesta';
import { CommonModule } from '@angular/common';


@Component({
  imports: [CommonModule],
  selector: 'app-cesta',
  styleUrl: './cesta.css',
  templateUrl: './cesta.html',
})
export class Cesta {
  mensagem: string = "";
  valorCesta:number = 0;

  itens: ItemCesta[] = [];

  ngOnInit(){
      this.carregarCesta();
  }

  carregarCesta(){
      let json = localStorage.getItem("cesta");
      if(json!=null){
        this.itens = JSON.parse(json);
        this.calculaTotal();
      } else {
        this.mensagem = "Cesta esta sem itens!";
      }
  }

  calculaTotal(){
    this.valorCesta = 0;
    for(let obj of this.itens){
      this.valorCesta+=obj.valorTotal;
    }
  }

  limparCesta(){
    localStorage.removeItem("cesta");
    this.itens = [];
    this.calculaTotal();
    this.mensagem = "Cesta esta sem itens!";
  }

  removerItem(obj:ItemCesta){
      for(let itm of this.itens){
        if(itm.produto.codigo==obj.produto.codigo){
          this.itens.pop();
          break;
        }
      }
      this.calculaTotal();
      this.mensagem = "item removido da cesta !";
      localStorage.setItem("cesta", JSON.stringify(this.itens));
  }

}
