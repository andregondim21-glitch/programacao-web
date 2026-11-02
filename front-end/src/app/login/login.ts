import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  email:string = "";
  senha:string = "";
  mensagem:string = "";

  fazerLogin(){
      if(this.email=="norton@norton.net.br" && this.senha=="123456"){
        this.mensagem = "Seja bem vindo !!";
      }   else {
        this.mensagem = "Senha ou usuário invalido!";
      }
  }

}
