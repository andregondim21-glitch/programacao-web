package fatec.web.back_petshop.dto;

import fatec.web.back_petshop.model.Cliente;

/** Dados do cliente devolvidos ao front (nunca inclui a senha). */
public record ClienteResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        String cpf,
        String cep,
        String endereco) {

    public static ClienteResponse de(Cliente c) {
        return new ClienteResponse(c.getId(), c.getNome(), c.getEmail(), c.getTelefone(),
                c.getCpf(), c.getCep(), c.getEndereco());
    }
}
