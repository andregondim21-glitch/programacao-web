package fatec.web.back_petshop.dto;

/** "token" só vem preenchido em desenvolvimento (petshop.reset-senha.expor-token=true). */
public record EsqueciSenhaResponse(String mensagem, String token) {
}
