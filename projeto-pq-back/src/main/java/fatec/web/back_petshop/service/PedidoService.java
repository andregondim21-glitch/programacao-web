package fatec.web.back_petshop.service;

import static fatec.web.back_petshop.service.Validacao.apenasDigitos;
import static fatec.web.back_petshop.service.Validacao.texto;
import static fatec.web.back_petshop.service.Validacao.vazio;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fatec.web.back_petshop.dto.ItemPedidoRequest;
import fatec.web.back_petshop.dto.PedidoRequest;
import fatec.web.back_petshop.dto.PedidoResponse;
import fatec.web.back_petshop.exception.ApiException;
import fatec.web.back_petshop.model.Cliente;
import fatec.web.back_petshop.model.ItemPedido;
import fatec.web.back_petshop.model.Pedido;
import fatec.web.back_petshop.model.Produto;
import fatec.web.back_petshop.repository.ClienteRepository;
import fatec.web.back_petshop.repository.PedidoRepository;
import fatec.web.back_petshop.repository.ProdutoRepository;

@Service
public class PedidoService {

    // Mesmos valores do tipo FormaPagamento do front
    private static final Set<String> FORMAS_PAGAMENTO = Set.of("cartao", "pix", "boleto");
    private static final String STATUS_INICIAL = "PENDENTE";

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository,
            ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    /**
     * Grava o pedido, calcula o total com os preços do banco (usando o preço promocional quando
     * existe) e baixa o estoque. Tudo na mesma transação: se faltar estoque de qualquer item,
     * nada é gravado.
     */
    @Transactional
    public PedidoResponse criar(PedidoRequest r) {
        if (r == null || r.clienteId() == null) {
            throw ApiException.badRequest("Informe o cliente do pedido.");
        }
        if (r.itens() == null || r.itens().isEmpty()) {
            throw ApiException.badRequest("O pedido precisa ter pelo menos um item.");
        }

        String formaPagamento = texto(r.formaPagamento()).toLowerCase();
        if (!FORMAS_PAGAMENTO.contains(formaPagamento)) {
            throw ApiException.badRequest("Forma de pagamento inválida.");
        }

        String cep = apenasDigitos(r.cep());
        if (cep.length() != 8) {
            throw ApiException.badRequest("CEP de entrega inválido.");
        }
        if (vazio(r.numero())) {
            throw ApiException.badRequest("Informe o número do endereço de entrega.");
        }
        if (vazio(r.endereco())) {
            throw ApiException.badRequest("Informe o endereço de entrega.");
        }

        boolean presente = Boolean.TRUE.equals(r.presente());
        String mensagemPresente = presente ? texto(r.mensagemPresente()) : null;
        if (presente && vazio(mensagemPresente)) {
            throw ApiException.badRequest("Escreva a mensagem do presente ou desmarque a opção de presente.");
        }

        Cliente cliente = clienteRepository.findById(r.clienteId())
                .orElseThrow(() -> ApiException.notFound("Cliente não encontrado."));

        // Soma as quantidades de um mesmo produto e ordena por id (evita deadlock entre pedidos simultâneos)
        Map<Long, Integer> quantidades = new TreeMap<>();
        for (ItemPedidoRequest item : r.itens()) {
            if (item == null || item.produtoId() == null || item.quantidade() == null || item.quantidade() <= 0) {
                throw ApiException.badRequest("Item de pedido inválido.");
            }
            quantidades.merge(item.produtoId(), item.quantidade(), Integer::sum);
        }

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setStatus(STATUS_INICIAL);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setFormaPagamento(formaPagamento);
        pedido.setPresente(presente);
        pedido.setMensagemPresente(mensagemPresente);
        pedido.setCep(cep);
        pedido.setNumero(r.numero().trim());
        pedido.setEndereco(r.endereco().trim());

        double total = 0;
        for (Map.Entry<Long, Integer> entrada : quantidades.entrySet()) {
            Produto produto = produtoRepository.buscarParaAtualizar(entrada.getKey())
                    .orElseThrow(() -> ApiException.notFound("Produto não encontrado (id " + entrada.getKey() + ")."));

            int quantidade = entrada.getValue();
            int disponivel = produto.getQuantidade() == null ? 0 : produto.getQuantidade();
            if (quantidade > disponivel) {
                throw ApiException.conflict("Estoque insuficiente para \"" + produto.getNome()
                        + "\" (disponível: " + disponivel + ").");
            }
            produto.setQuantidade(disponivel - quantidade);

            double precoUnitario = produto.getPromo() > 0 ? produto.getPromo() : produto.getPreco();

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(quantidade);
            item.setPrecoUnitario(precoUnitario);
            pedido.getItens().add(item);

            total += precoUnitario * quantidade;
        }
        pedido.setValorTotal(Math.round(total * 100.0) / 100.0);

        return PedidoResponse.de(pedidoRepository.save(pedido));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPorCliente(Long clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw ApiException.notFound("Cliente não encontrado.");
        }
        return pedidoRepository.findByClienteIdOrderByDataPedidoDesc(clienteId).stream()
                .map(PedidoResponse::de).toList();
    }
}
