import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { precoFinal } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { MascoteComponent } from '../mascote/mascote.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, MascoteComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  readonly cartService = inject(CartService);
  readonly precoFinal = precoFinal;
}
