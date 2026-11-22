package fatec.web.back_petshop.exception;

import org.springframework.http.HttpStatus;

/** Erro de regra de negócio: vira uma resposta JSON {"mensagem": "..."} com o status informado. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String mensagem) {
        super(mensagem);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static ApiException badRequest(String mensagem) {
        return new ApiException(HttpStatus.BAD_REQUEST, mensagem);
    }

    public static ApiException notFound(String mensagem) {
        return new ApiException(HttpStatus.NOT_FOUND, mensagem);
    }

    public static ApiException conflict(String mensagem) {
        return new ApiException(HttpStatus.CONFLICT, mensagem);
    }

    public static ApiException unauthorized(String mensagem) {
        return new ApiException(HttpStatus.UNAUTHORIZED, mensagem);
    }
}
