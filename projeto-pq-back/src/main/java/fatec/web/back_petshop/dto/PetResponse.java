package fatec.web.back_petshop.dto;

import fatec.web.back_petshop.model.Pet;

public record PetResponse(Long id, String nome, String especie, Integer idade, double peso, Long clienteId) {

    public static PetResponse de(Pet p) {
        return new PetResponse(p.getId(), p.getNome(), p.getEspecie(), p.getIdade(), p.getPeso(),
                p.getCliente().getId());
    }
}
