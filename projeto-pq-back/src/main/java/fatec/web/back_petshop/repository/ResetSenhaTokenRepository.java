package fatec.web.back_petshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import fatec.web.back_petshop.model.ResetSenhaToken;

@RepositoryRestResource(exported = false)
public interface ResetSenhaTokenRepository extends JpaRepository<ResetSenhaToken, Long> {

    Optional<ResetSenhaToken> findByToken(String token);
}
