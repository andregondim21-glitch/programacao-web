package fatec.web.back_petshop.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fatec.web.back_petshop.model.Produto;
import fatec.web.back_petshop.service.ProdutoService;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // GET /api/produtos            -> todos os produtos
    // GET /api/produtos?especie=gato -> só os indicados para a espécie
    @GetMapping
    public List<Produto> listar(@RequestParam(name = "especie", required = false) String especie) {
        return produtoService.listar(especie);
    }

    @GetMapping("/{id}")
    public Produto buscar(@PathVariable("id") Long id) {
        return produtoService.buscar(id);
    }
}
