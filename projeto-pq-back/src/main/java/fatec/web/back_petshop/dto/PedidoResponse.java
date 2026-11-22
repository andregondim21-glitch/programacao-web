package fatec.web.back_petshop.dto;

import java.time.LocalDateTime;
import java.util.List;

import fatec.web.back_petshop.model.Pedido;

public record PedidoResponse(
        Long id,
        Long clienteId,
        List<ItemPedidoResponse> itens,
        double valorTotal,
        String status,
        LocalDateTime dataPedido,
        String formaPagamento,
        Boolean presente,
        String mensagemPresente,
        String cep,
        String numero,
        String endereco) {

    public static PedidoResponse de(Pedido p) {
        return new PedidoResponse(p.getId(), p.getCliente().getId(),
                p.getItens().stream().map(ItemPedidoResponse::de).toList(),
                p.getValorTotal(), p.getStatus(), p.getDataPedido(), p.getFormaPagamento(),
                p.getPresente(), p.getMensagemPresente(), p.getCep(), p.getNumero(), p.getEndereco());
    }
}
