package fatec.web.back_petshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import jakarta.mail.internet.MimeMessage;

/** Envia os e-mails do petshop (hoje, apenas o de recuperação de senha). */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String usuarioSmtp;

    @Value("${petshop.mail.from:}")
    private String remetente;

    @Value("${petshop.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${petshop.reset-senha.validade-minutos:30}")
    private long validadeMinutos;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envia o link para o cliente criar uma nova senha. Nunca lança exceção: se o SMTP falhar,
     * o erro vai para o log e a resposta da API continua igual (não revela se o e-mail existe).
     */
    public void enviarLinkRedefinicaoSenha(String destinatario, String nome, String token) {
        String link = frontendUrl + "/redefinir-senha?token=" + token;

        // SMTP ainda não configurado (MAIL_USERNAME vazio): útil em desenvolvimento, o link vai para o console
        if (usuarioSmtp == null || usuarioSmtp.isBlank()) {
            log.warn("SMTP não configurado (defina MAIL_USERNAME e MAIL_PASSWORD). "
                    + "Link de redefinição para {}: {}", destinatario, link);
            return;
        }

        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");
            helper.setFrom(remetente == null || remetente.isBlank() ? usuarioSmtp : remetente, "PetShop+");
            helper.setTo(destinatario);
            helper.setSubject("PetShop+ | Redefinição de senha");
            helper.setText(montarTexto(nome, link), montarHtml(nome, link));
            mailSender.send(mensagem);
            log.info("E-mail de redefinição de senha enviado para {}", destinatario);
        } catch (Exception e) {
            log.error("Falha ao enviar o e-mail de redefinição de senha para {}", destinatario, e);
        }
    }

    private String primeiroNome(String nome) {
        String limpo = nome == null ? "" : nome.trim();
        int espaco = limpo.indexOf(' ');
        return espaco > 0 ? limpo.substring(0, espaco) : limpo;
    }

    private String montarTexto(String nome, String link) {
        return "Olá, " + primeiroNome(nome) + "!\n\n"
                + "Recebemos um pedido para redefinir a senha da sua conta no PetShop+.\n"
                + "Para criar uma nova senha, acesse o link abaixo (válido por " + validadeMinutos + " minutos):\n\n"
                + link + "\n\n"
                + "Se você não fez esse pedido, pode ignorar este e-mail: sua senha continua a mesma.";
    }

    private String montarHtml(String nome, String link) {
        String nomeSeguro = HtmlUtils.htmlEscape(primeiroNome(nome));
        return "<div style=\"font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#333\">"
                + "<h2 style=\"color:#2d5a4a\">Redefinição de senha</h2>"
                + "<p>Olá, " + nomeSeguro + "!</p>"
                + "<p>Recebemos um pedido para redefinir a senha da sua conta no PetShop+. "
                + "Clique no botão abaixo para criar uma nova senha. O link vale por " + validadeMinutos + " minutos.</p>"
                + "<p style=\"text-align:center;margin:28px 0\">"
                + "<a href=\"" + link + "\" style=\"background:#2d5a4a;color:#fff;padding:12px 24px;"
                + "border-radius:6px;text-decoration:none;font-weight:bold\">Criar nova senha</a></p>"
                + "<p style=\"font-size:13px;color:#666\">Se o botão não funcionar, copie e cole este endereço no navegador:<br>"
                + link + "</p>"
                + "<p style=\"font-size:13px;color:#666\">Se você não fez esse pedido, ignore este e-mail: "
                + "sua senha continua a mesma.</p></div>";
    }
}
