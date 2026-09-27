import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  // Sem styleUrl: o layout usa só classes do Bootstrap + src/styles.scss
})
export class AppComponent {
  readonly cartService = inject(CartService);
}
