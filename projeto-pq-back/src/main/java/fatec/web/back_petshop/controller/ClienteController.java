package fatec.web.back_petshop.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fatec.web.back_petshop.dto.ClienteRequest;
import fatec.web.back_petshop.dto.ClienteResponse;
import fatec.web.back_petshop.service.ClienteService;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // POST /api/clientes -> cadastro de cliente
    @PostMapping
    public ResponseEntity<ClienteResponse> cadastrar(@RequestBody ClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ClienteResponse.de(clienteService.cadastrar(request)));
    }
}
