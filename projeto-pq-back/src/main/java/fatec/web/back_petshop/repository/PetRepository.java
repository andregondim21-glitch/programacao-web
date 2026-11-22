package fatec.web.back_petshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import fatec.web.back_petshop.model.Pet;

@RepositoryRestResource(exported = false)
public interface PetRepository extends JpaRepository<Pet, Long> {

    List<Pet> findByClienteIdOrderByIdDesc(Long clienteId);
}
