import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { PetService } from '../../services/pet.service';
import { ProdutoService } from '../../services/produto.service';
import { mensagemDeErro } from '../../utils/erro-api';
import { PetFormComponent } from '../pet-form/pet-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PetFormComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly produtoService = inject(ProdutoService);
  readonly petService = inject(PetService);
  readonly cartService = inject(CartService);

  /** Catálogo vindo do banco de dados (via API). */
  readonly produtos = signal<Product[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  /**
   * Lista de produtos exibida na home. Enquanto não há pet cadastrado,
   * mostra todo o catálogo ("Mais vendidos"). Após o cadastro, filtra
   * apenas os produtos indicados para a espécie do pet informado; se por
   * algum motivo nenhum produto for compatível, cai de volta no catálogo
   * completo para nunca deixar a seção vazia.
   */
  readonly produtosRecomendados = computed(() => {
    const pet = this.petService.pet();
    const produtos = this.produtos();

    if (!pet) {
      return produtos;
    }

    const filtrados = produtos.filter((produto) => produto.especies.includes(pet.especie));

    return filtrados.length > 0 ? filtrados : produtos;
  });

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (lista) => {
        this.produtos.set(lista);
        this.carregando.set(false);
      },
      error: (e) => {
        this.erro.set(mensagemDeErro(e, 'Não foi possível carregar os produtos.'));
        this.carregando.set(false);
      },
    });
  }

  adicionarAoCarrinho(produto: Product): void {
    this.cartService.adicionar(produto);
  }

  verDetalhe(produto: Product): void {
    this.router.navigate(['/detalhe', produto.id]);
  }
}
