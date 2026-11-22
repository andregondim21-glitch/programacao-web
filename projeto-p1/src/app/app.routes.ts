import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomeComponent } from './components/home/home.component';
import { Detalhe } from './detalhe/detalhe';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
import { EsqueciSenha } from './esqueci-senha/esqueci-senha';
import { RedefinirSenha } from './redefinir-senha/redefinir-senha';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'carrinho', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: Login },
  { path: 'detalhe/:id', component: Detalhe },
  { path: 'cadastro', component: Cadastro },
  { path: 'esqueci-senha', component: EsqueciSenha },
  { path: 'redefinir-senha', component: RedefinirSenha },
  { path: '**', redirectTo: '' },
];
