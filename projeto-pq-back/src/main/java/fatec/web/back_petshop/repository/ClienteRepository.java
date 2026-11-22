package fatec.web.back_petshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import fatec.web.back_petshop.model.Cliente;

// exported = false: o acesso é feito só pelos controllers (evita expor senha/CPF pelo Spring Data REST)
@RepositoryRestResource(exported = false)
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByCpf(String cpf);
}
