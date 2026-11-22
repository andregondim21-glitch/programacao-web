package fatec.web.back_petshop.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fatec.web.back_petshop.exception.ApiException;
import fatec.web.back_petshop.model.Produto;
import fatec.web.back_petshop.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @Transactional(readOnly = true)
    public List<Produto> listar(String especie) {
        if (Validacao.vazio(especie)) {
            return produtoRepository.findAllByOrderByIdAsc();
        }
        return produtoRepository.buscarPorEspecie(especie.trim().toLowerCase());
    }

    @Transactional(readOnly = true)
    public Produto buscar(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Produto não encontrado."));
    }
}
