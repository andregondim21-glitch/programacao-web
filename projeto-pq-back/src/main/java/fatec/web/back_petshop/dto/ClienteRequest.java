package fatec.web.back_petshop.dto;

public record ClienteRequest(
        String nome,
        String email,
        String telefone,
        String cpf,
        String cep,
        String endereco,
        String senha) {
}
