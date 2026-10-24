package com.ads.lojinha;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*") 
public class ClienteController {
    @Autowired 
    ClienteRepository bd;

    @Autowired
    ClienteService servico;

    @GetMapping("/api/cliente/{codigo}")
    public Cliente retornaCliente(@PathVariable("codigo") int id){
        if(bd.existsById(id)){
            return bd.findById(id).get();
        } else {
            return new Cliente();
        }
    }

    @PostMapping("/api/cliente")
    public String gravar(@RequestBody Cliente obj){
        bd.save(obj);
        return "Cliente gravado com sucesso! "+ obj.getCodigo();
    }
   
    @PostMapping("/api/cliente/login")
    public ResponseEntity<Cliente> login(@RequestBody LoginRequest dados){
        Optional<Cliente> cliente = bd.fazerLogin(dados.email(), dados.senha());
        if(cliente.isPresent()){
            return ResponseEntity.ok(semSenha(cliente.get()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/api/cliente/recuperar-senha")
    public String recuperarSenha(@RequestBody RecuperarSenhaRequest dados){
        servico.recuperarSenha(dados.email());
        return "Se o e-mail estiver cadastrado, enviaremos uma nova senha para ele.";
    }

    // devolve uma cópia do cliente sem a senha, para não expor a senha na resposta do login
    private Cliente semSenha(Cliente c){
        Cliente copia = new Cliente();
        copia.setCodigo(c.getCodigo());
        copia.setNome(c.getNome());
        copia.setTelefone(c.getTelefone());
        copia.setDocumento(c.getDocumento());
        copia.setLogradouro(c.getLogradouro());
        copia.setEmail(c.getEmail());
        copia.setAtivo(c.getAtivo());
        return copia;
    }

    @PutMapping("/api/cliente")
    public String alterar(@RequestBody Cliente obj){
        if(bd.existsById(obj.getCodigo())){
            bd.save(obj);
            return "Cliente alterado com sucesso! "+ obj.getCodigo();
        } else {
            return "cliente não encontrado!";
        }
    }

    @DeleteMapping("/api/cliente/{codigo}")
    public String apagar(@PathVariable("codigo") int id){
        bd.deleteById(id);
        return "Cliente removido com sucesso!";
    }
    
}
