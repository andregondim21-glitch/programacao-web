package fatec.web.back_petshop.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fatec.web.back_petshop.dto.PedidoRequest;
import fatec.web.back_petshop.dto.PedidoResponse;
import fatec.web.back_petshop.service.PedidoService;

@RestController
@RequestMapping("/api")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // POST /api/pedidos -> finaliza a compra (grava o pedido e baixa o estoque)
    @PostMapping("/pedidos")
    public ResponseEntity<PedidoResponse> criar(@RequestBody PedidoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.criar(request));
    }

    // GET /api/clientes/{clienteId}/pedidos -> histórico de pedidos do cliente
    @GetMapping("/clientes/{clienteId}/pedidos")
    public List<PedidoResponse> listarPorCliente(@PathVariable("clienteId") Long clienteId) {
        return pedidoService.listarPorCliente(clienteId);
    }
}
