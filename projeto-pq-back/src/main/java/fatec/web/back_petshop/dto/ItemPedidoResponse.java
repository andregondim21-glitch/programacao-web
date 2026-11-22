package fatec.web.back_petshop.dto;

import fatec.web.back_petshop.model.ItemPedido;

public record ItemPedidoResponse(Long produtoId, String nome, Integer quantidade, double precoUnitario, double subtotal) {

    public static ItemPedidoResponse de(ItemPedido i) {
        double subtotal = Math.round(i.getPrecoUnitario() * i.getQuantidade() * 100.0) / 100.0;
        return new ItemPedidoResponse(i.getProduto().getId(), i.getProduto().getNome(), i.getQuantidade(),
                i.getPrecoUnitario(), subtotal);
    }
}
