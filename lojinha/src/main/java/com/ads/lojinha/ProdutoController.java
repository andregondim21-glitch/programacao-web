package com.ads.lojinha;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ProdutoController {
    @GetMapping("/api/produto/{codigo}")
    public Produto retornaProduto(@PathVariable("codigo") int id) {
        
        var obj = new Produto();
        obj.setCodigo(id);
        obj.setDescricao("martelo de borracha");
        obj.setDestaque(1);
        obj.setNome("Martelo");
        obj.setQuantidade(100);
        obj.setValor(30);
        obj.setValorPromo(24);
        return obj;
    }

    @PostMapping("/api/produto") 
    public String gravar(@RequestBody Produto obj){
        //TO DO gravar no banco de dados
        return "Produto gravado com sucesso! " + obj.getNome();
    }

    @PutMapping("/api/produto") 
    public String alterar(@RequestBody Produto obj){
        //TO DO gravar no banco de dados
        return "Produto alterado com sucesso! " + obj.getNome();
    }

}
