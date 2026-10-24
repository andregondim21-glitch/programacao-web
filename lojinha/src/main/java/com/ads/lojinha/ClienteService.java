package com.ads.lojinha;

import java.security.SecureRandom;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClienteService {
    private static final String CARACTERES = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    private final SecureRandom random = new SecureRandom();

    @Autowired
    ClienteRepository bd;

    @Autowired
    JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    String remetente;

    // Se o envio do e-mail falhar, a transação sofre rollback e a senha antiga continua valendo.
    @Transactional
    public void recuperarSenha(String email){
        Optional<Cliente> encontrado = bd.buscarPorEmail(email);
        if(encontrado.isEmpty()){
            return; // não revela se o e-mail existe ou não
        }
        Cliente cliente = encontrado.get();
        String novaSenha = gerarSenhaTemporaria(8);
        bd.atualizarSenha(cliente.getCodigo(), novaSenha);

        SimpleMailMessage msg = new SimpleMailMessage();
        if(!remetente.isBlank()){
            msg.setFrom(remetente);
        }
        msg.setTo(cliente.getEmail());
        msg.setSubject("Recuperação de senha - Lojinha");
        msg.setText("Olá, " + cliente.getNome() + "!\n\n"
                + "Sua nova senha de acesso é: " + novaSenha + "\n\n"
                + "Recomendamos alterá-la após o login.");
        mailSender.send(msg);
    }

    private String gerarSenhaTemporaria(int tamanho){
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < tamanho; i++){
            sb.append(CARACTERES.charAt(random.nextInt(CARACTERES.length())));
        }
        return sb.toString();
    }
}
