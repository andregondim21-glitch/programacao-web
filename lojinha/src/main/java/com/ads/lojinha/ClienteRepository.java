package com.ads.lojinha;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository 
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    @Query(value = "SELECT * FROM cliente WHERE email = :email AND senha = :senha LIMIT 1", nativeQuery = true)
    public Optional<Cliente> fazerLogin(@Param("email") String email, @Param("senha") String senha);

    @Query(value = "SELECT * FROM cliente WHERE email = :email LIMIT 1", nativeQuery = true)
    public Optional<Cliente> buscarPorEmail(@Param("email") String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE cliente SET senha = :senha WHERE codigo = :codigo", nativeQuery = true)
    public int atualizarSenha(@Param("codigo") int codigo, @Param("senha") String senha);

}
