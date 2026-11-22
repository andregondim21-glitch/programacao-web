package fatec.web.back_petshop.service;

import static fatec.web.back_petshop.service.Validacao.apenasDigitos;
import static fatec.web.back_petshop.service.Validacao.cpfValido;
import static fatec.web.back_petshop.service.Validacao.emailValido;
import static fatec.web.back_petshop.service.Validacao.texto;
import static fatec.web.back_petshop.service.Validacao.vazio;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fatec.web.back_petshop.dto.ClienteRequest;
import fatec.web.back_petshop.exception.ApiException;
import fatec.web.back_petshop.model.Cliente;
import fatec.web.back_petshop.repository.ClienteRepository;

@Service
public class ClienteService {

    static final int TAMANHO_MINIMO_SENHA = 6;
    private static final String MSG_LOGIN_INVALIDO = "E-mail ou senha inválidos.";

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(ClienteRepository clienteRepository, PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Cliente cadastrar(ClienteRequest r) {
        if (r == null) {
            throw ApiException.badRequest("Dados do cliente não informados.");
        }

        String nome = texto(r.nome());
        String email = texto(r.email()).toLowerCase();
        String cpf = apenasDigitos(r.cpf());
        String cep = apenasDigitos(r.cep());
        String endereco = texto(r.endereco());

        if (nome.length() < 2) {
            throw ApiException.badRequest("Informe seu nome completo.");
        }
        if (!emailValido(email)) {
            throw ApiException.badRequest("Informe um e-mail válido.");
        }
        if (!cpfValido(cpf)) {
            throw ApiException.badRequest("CPF inválido.");
        }
        if (cep.length() != 8) {
            throw ApiException.badRequest("CEP inválido.");
        }
        if (vazio(endereco)) {
            throw ApiException.badRequest("Informe o endereço.");
        }
        validarSenha(r.senha());

        if (clienteRepository.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("Já existe uma conta com este e-mail.");
        }
        if (clienteRepository.existsByCpf(cpf)) {
            throw ApiException.conflict("Já existe uma conta com este CPF.");
        }

        Cliente cliente = new Cliente();
        cliente.setNome(nome);
        cliente.setEmail(email);
        cliente.setTelefone(vazio(r.telefone()) ? null : r.telefone().trim());
        cliente.setCpf(cpf);
        cliente.setCep(cep);
        cliente.setEndereco(endereco);
        cliente.setSenha(passwordEncoder.encode(r.senha()));
        return clienteRepository.save(cliente);
    }

    @Transactional(readOnly = true)
    public Cliente autenticar(String email, String senha) {
        if (vazio(email) || vazio(senha)) {
            throw ApiException.badRequest("Informe e-mail e senha.");
        }

        Cliente cliente = clienteRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> ApiException.unauthorized(MSG_LOGIN_INVALIDO));

        if (!passwordEncoder.matches(senha, cliente.getSenha())) {
            throw ApiException.unauthorized(MSG_LOGIN_INVALIDO);
        }
        return cliente;
    }

    static void validarSenha(String senha) {
        if (senha == null || senha.length() < TAMANHO_MINIMO_SENHA) {
            throw ApiException.badRequest("A senha deve ter pelo menos " + TAMANHO_MINIMO_SENHA + " caracteres.");
        }
    }
}
