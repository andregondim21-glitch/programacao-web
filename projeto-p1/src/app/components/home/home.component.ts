import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PRODUTOS } from '../../data/products.data';
import { CartService } from '../../services/cart.service';
import { PetService } from '../../services/pet.service';
import { PetFormComponent } from '../pet-form/pet-form.component';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PetFormComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private router: Router) {}
  readonly petService = inject(PetService);
  readonly cartService = inject(CartService);

  readonly produtos = PRODUTOS;

  /**
   * Lista de produtos exibida na home. Enquanto não há pet cadastrado,
   * mostra todo o catálogo ("Mais vendidos"). Após o cadastro, filtra
   * apenas os produtos indicados para a espécie do pet informado; se por
   * algum motivo nenhum produto for compatível, cai de volta no catálogo
   * completo para nunca deixar a seção vazia.
   */
  readonly produtosRecomendados = computed(() => {
    const pet = this.petService.pet();

    if (!pet) {
      return this.produtos;
    }

    const filtrados = this.produtos.filter((produto) =>
      produto.especies.includes(pet.especie)
    );

    return filtrados.length > 0 ? filtrados : this.produtos;
  });

  adicionarAoCarrinho(produtoId: string): void {
    const produto = this.produtos.find((p) => p.id === produtoId);
    if (produto) {
      this.cartService.adicionar(produto);
    }
  }

  verDetalhe(obj: Product) {
    localStorage.setItem("products.data", JSON.stringify(obj));
    this.router.navigate(['/detalhe']);
  }
}
