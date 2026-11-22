import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { PetService } from './services/pet.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  // Sem styleUrl: o layout usa só classes do Bootstrap + src/styles.scss
})
export class AppComponent {
  readonly cartService = inject(CartService);
  readonly auth = inject(AuthService);
  private readonly petService = inject(PetService);
  private readonly router = inject(Router);

  readonly primeiroNome = computed(() => this.auth.cliente()?.nome.split(' ')[0] ?? '');

  sair(): void {
    this.auth.logout();
    this.petService.limparPet();
    this.router.navigate(['/']);
  }
}
