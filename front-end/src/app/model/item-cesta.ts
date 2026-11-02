import { Produto } from "./produto";

export class ItemCesta {
    produto : Produto = new Produto();
    quantidade: number = 0;
    valorVenda: number = 0;
    valorTotal: number = 0;

    constructor(obj:Produto){
        this.produto = obj;
        this.quantidade = 1;
        if(obj.valorPromo>0){
            this.valorVenda =  obj.valorPromo;
        } else {
            this.valorVenda =  obj.valor;
        }
        this.valorTotal = this.valorVenda * this.quantidade;
    }
}
