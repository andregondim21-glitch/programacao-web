package fatec.web.back_petshop.service;

import static fatec.web.back_petshop.service.Validacao.texto;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fatec.web.back_petshop.dto.PetRequest;
import fatec.web.back_petshop.dto.PetResponse;
import fatec.web.back_petshop.exception.ApiException;
import fatec.web.back_petshop.model.Cliente;
import fatec.web.back_petshop.model.Pet;
import fatec.web.back_petshop.repository.ClienteRepository;
import fatec.web.back_petshop.repository.PetRepository;

@Service
public class PetService {

    // Mesmos valores do tipo Especie do front
    private static final Set<String> ESPECIES = Set.of("cachorro", "gato", "ave", "outro");

    private final PetRepository petRepository;
    private final ClienteRepository clienteRepository;

    public PetService(PetRepository petRepository, ClienteRepository clienteRepository) {
        this.petRepository = petRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public PetResponse cadastrar(Long clienteId, PetRequest r) {
        Cliente cliente = buscarCliente(clienteId);

        if (r == null) {
            throw ApiException.badRequest("Dados do pet não informados.");
        }
        String nome = texto(r.nome());
        String especie = texto(r.especie()).toLowerCase();

        if (nome.length() < 2) {
            throw ApiException.badRequest("O nome do pet precisa ter pelo menos 2 letras.");
        }
        if (!ESPECIES.contains(especie)) {
            throw ApiException.badRequest("Espécie inválida.");
        }
        if (r.idade() == null || r.idade() < 1 || r.idade() > 40) {
            throw ApiException.badRequest("Informe uma idade entre 1 e 40 anos.");
        }
        if (r.peso() == null || r.peso() <= 0 || r.peso() > 120) {
            throw ApiException.badRequest("Informe um peso entre 1 e 120 kg.");
        }

        Pet pet = new Pet();
        pet.setNome(nome);
        pet.setEspecie(especie);
        pet.setIdade(r.idade());
        pet.setPeso(r.peso());
        pet.setCliente(cliente);
        return PetResponse.de(petRepository.save(pet));
    }

    @Transactional(readOnly = true)
    public List<PetResponse> listar(Long clienteId) {
        buscarCliente(clienteId);
        return petRepository.findByClienteIdOrderByIdDesc(clienteId).stream().map(PetResponse::de).toList();
    }

    private Cliente buscarCliente(Long clienteId) {
        return clienteRepository.findById(clienteId)
                .orElseThrow(() -> ApiException.notFound("Cliente não encontrado."));
    }
}
