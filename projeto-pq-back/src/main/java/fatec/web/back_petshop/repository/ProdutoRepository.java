package fatec.web.back_petshop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import fatec.web.back_petshop.model.Produto;
import jakarta.persistence.LockModeType;

@RepositoryRestResource(exported = false)
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findAllByOrderByIdAsc();

    @Query("select distinct p from Produto p join p.especies e where e = :especie order by p.id")
    List<Produto> buscarPorEspecie(@Param("especie") String especie);

    // Trava a linha do produto enquanto o pedido baixa o estoque (evita vender o mesmo item duas vezes)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Produto p where p.id = :id")
    Optional<Produto> buscarParaAtualizar(@Param("id") Long id);
}
