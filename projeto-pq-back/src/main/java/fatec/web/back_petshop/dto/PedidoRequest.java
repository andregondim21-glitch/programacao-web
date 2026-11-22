package fatec.web.back_petshop.dto;

import java.util.List;

public record PedidoRequest(
        Long clienteId,
        List<ItemPedidoRequest> itens,
        String cep,
        String numero,
        String endereco,
        String formaPagamento,
        Boolean presente,
        String mensagemPresente) {
}
