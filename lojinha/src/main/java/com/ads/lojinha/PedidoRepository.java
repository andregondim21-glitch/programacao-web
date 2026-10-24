package com.ads.lojinha;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    @Query(value = "SELECT * FROM pedido WHERE codigo_cliente = :codigoCliente ORDER BY data_pedido DESC, codigo_pedido DESC", nativeQuery = true)
    public List<Pedido> listarPorCliente(@Param("codigoCliente") int codigoCliente);

}
