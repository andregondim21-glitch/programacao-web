package fatec.web.back_petshop.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fatec.web.back_petshop.dto.ClienteResponse;
import fatec.web.back_petshop.dto.EsqueciSenhaRequest;
import fatec.web.back_petshop.dto.EsqueciSenhaResponse;
import fatec.web.back_petshop.dto.LoginRequest;
import fatec.web.back_petshop.dto.MensagemResponse;
import fatec.web.back_petshop.dto.RedefinirSenhaRequest;
import fatec.web.back_petshop.service.ClienteService;
import fatec.web.back_petshop.service.EmailService;
import fatec.web.back_petshop.service.ResetSenhaService;
import fatec.web.back_petshop.service.ResetSenhaService.ResetSolicitado;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String MSG_ESQUECI_SENHA =
            "Se o e-mail estiver cadastrado, enviaremos as instruções para redefinir a senha.";

    private final ClienteService clienteService;
    private final ResetSenhaService resetSenhaService;
    private final EmailService emailService;

    @Value("${petshop.reset-senha.expor-token:false}")
    private boolean exporToken;

    public AuthController(ClienteService clienteService, ResetSenhaService resetSenhaService,
            EmailService emailService) {
        this.clienteService = clienteService;
        this.resetSenhaService = resetSenhaService;
        this.emailService = emailService;
    }

    // POST /api/auth/login -> devolve os dados do cliente (401 se e-mail/senha estiverem errados)
    @PostMapping("/login")
    public ClienteResponse login(@RequestBody LoginRequest request) {
        return ClienteResponse.de(clienteService.autenticar(request.email(), request.senha()));
    }

    // POST /api/auth/esqueci-senha -> gera o token e envia o link de redefinição por e-mail
    @PostMapping("/esqueci-senha")
    public EsqueciSenhaResponse esqueciSenha(@RequestBody EsqueciSenhaRequest request) {
        Optional<ResetSolicitado> solicitado = resetSenhaService.solicitar(request.email());

        // Só envia se o e-mail existe, mas a resposta é a mesma nos dois casos
        solicitado.ifPresent(s -> emailService.enviarLinkRedefinicaoSenha(s.email(), s.nome(), s.token()));

        String token = exporToken ? solicitado.map(ResetSolicitado::token).orElse(null) : null;
        return new EsqueciSenhaResponse(MSG_ESQUECI_SENHA, token);
    }

    // POST /api/auth/redefinir-senha -> troca a senha usando o token
    @PostMapping("/redefinir-senha")
    public MensagemResponse redefinirSenha(@RequestBody RedefinirSenhaRequest request) {
        resetSenhaService.redefinir(request.token(), request.novaSenha());
        return new MensagemResponse("Senha redefinida com sucesso.");
    }
}
