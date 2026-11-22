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

import fatec.web.back_petshop.dto.PetRequest;
import fatec.web.back_petshop.dto.PetResponse;
import fatec.web.back_petshop.service.PetService;

@RestController
@RequestMapping("/api/clientes/{clienteId}/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    // GET /api/clientes/{clienteId}/pets -> pets do cliente (mais recente primeiro)
    @GetMapping
    public List<PetResponse> listar(@PathVariable("clienteId") Long clienteId) {
        return petService.listar(clienteId);
    }

    // POST /api/clientes/{clienteId}/pets -> cadastro de pet
    @PostMapping
    public ResponseEntity<PetResponse> cadastrar(@PathVariable("clienteId") Long clienteId,
            @RequestBody PetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(petService.cadastrar(clienteId, request));
    }
}
