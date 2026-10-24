package com.ads.lojinha;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository  extends JpaRepository<Produto, Integer> {
    @Query(value = "SELECT * FROM produto WHERE destaque > 0", nativeQuery = true)
    public List<Produto> carregaVitrine();

    @Query (value = "SELECT * FROM produto WHERE nome LIKE :termo or descritivo like :termo", nativeQuery = true)
    public List<Produto> fazerBusca(String termo);

}
