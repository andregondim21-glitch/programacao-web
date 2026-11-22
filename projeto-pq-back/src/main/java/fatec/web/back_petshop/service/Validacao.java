package fatec.web.back_petshop.service;

/** Funções de apoio para validar e normalizar os dados recebidos do front. */
public final class Validacao {

    private Validacao() {
    }

    public static boolean vazio(String valor) {
        return valor == null || valor.isBlank();
    }

    public static String texto(String valor) {
        return valor == null ? "" : valor.trim();
    }

    public static String apenasDigitos(String valor) {
        return valor == null ? "" : valor.replaceAll("\\D", "");
    }

    public static boolean emailValido(String email) {
        return email != null && email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    }

    /** Mesma regra do validador do front: 11 dígitos, não repetidos, com os dois dígitos verificadores corretos. */
    public static boolean cpfValido(String cpf) {
        if (cpf == null || cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) {
            return false;
        }
        int digito1 = digitoVerificador(cpf.substring(0, 9), 10);
        int digito2 = digitoVerificador(cpf.substring(0, 10), 11);
        return digito1 == Character.getNumericValue(cpf.charAt(9))
                && digito2 == Character.getNumericValue(cpf.charAt(10));
    }

    private static int digitoVerificador(String parcial, int pesoInicial) {
        int soma = 0;
        for (int i = 0; i < parcial.length(); i++) {
            soma += Character.getNumericValue(parcial.charAt(i)) * (pesoInicial - i);
        }
        int resto = (soma * 10) % 11;
        return resto == 10 ? 0 : resto;
    }
}
