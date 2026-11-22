package fatec.web.back_petshop.service;

import static fatec.web.back_petshop.service.Validacao.texto;
import static fatec.web.back_petshop.service.Validacao.vazio;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fatec.web.back_petshop.exception.ApiException;
import fatec.web.back_petshop.model.Cliente;
import fatec.web.back_petshop.model.ResetSenhaToken;
import fatec.web.back_petshop.repository.ClienteRepository;
import fatec.web.back_petshop.repository.ResetSenhaTokenRepository;

@Service
public class ResetSenhaService {

    private final ClienteRepository clienteRepository;
    private final ResetSenhaTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${petshop.reset-senha.validade-minutos:30}")
    private long validadeMinutos;

    public ResetSenhaService(ClienteRepository clienteRepository, ResetSenhaTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Gera um token de redefinição para o e-mail informado. Devolve vazio quando o e-mail não existe;
     * o controller responde igual nos dois casos para não revelar quais e-mails estão cadastrados.
     * O envio do e-mail é feito pelo controller, depois que esta transação já foi confirmada.
     */
    @Transactional
    public Optional<ResetSolicitado> solicitar(String email) {
        if (vazio(email)) {
            throw ApiException.badRequest("Informe o e-mail da conta.");
        }

        Optional<Cliente> encontrado = clienteRepository.findByEmailIgnoreCase(texto(email));
        if (encontrado.isEmpty()) {
            return Optional.empty();
        }

        ResetSenhaToken token = new ResetSenhaToken();
        token.setToken(UUID.randomUUID().toString().replace("-", ""));
        token.setCliente(encontrado.get());
        token.setExpiraEm(LocalDateTime.now().plusMinutes(validadeMinutos));
        token.setUsado(false);
        tokenRepository.save(token);

        Cliente cliente = encontrado.get();
        return Optional.of(new ResetSolicitado(cliente.getEmail(), cliente.getNome(), token.getToken()));
    }

    /** Dados necessários para montar o e-mail de redefinição. */
    public record ResetSolicitado(String email, String nome, String token) {
    }

    @Transactional
    public void redefinir(String tokenInformado, String novaSenha) {
        if (vazio(tokenInformado)) {
            throw ApiException.badRequest("Informe o código de redefinição.");
        }
        ClienteService.validarSenha(novaSenha);

        ResetSenhaToken token = tokenRepository.findByToken(tokenInformado.trim())
                .orElseThrow(() -> ApiException.badRequest("Código de redefinição inválido ou expirado."));

        if (token.isUsado() || token.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("Código de redefinição inválido ou expirado.");
        }

        Cliente cliente = token.getCliente();
        cliente.setSenha(passwordEncoder.encode(novaSenha));
        clienteRepository.save(cliente);

        token.setUsado(true);
        tokenRepository.save(token);
    }
}
