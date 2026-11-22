package fatec.web.back_petshop.config;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import fatec.web.back_petshop.model.Produto;
import fatec.web.back_petshop.repository.ProdutoRepository;

/**
 * Cadastra o catálogo inicial de produtos (os mesmos que antes ficavam fixos no front)
 * na primeira vez que a aplicação sobe com a tabela de produtos vazia.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ProdutoRepository produtoRepository;

    public DataInitializer(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @Override
    public void run(String... args) {
        if (produtoRepository.count() > 0) {
            return;
        }

        List<Produto> produtos = new ArrayList<>();

        produtos.add(produto("racao-premium", "Ração Premium Cães 15kg", "racao", 189.9, 139.99, 10,
                "Ração super premium para cães adultos, rica em proteínas de alta qualidade, com ômega 3 e 6 para pele e pelagem saudáveis. Pacote de 15kg.",
                "cachorro"));
        produtos.add(produto("areia-higienica", "Areia Higiênica Gatos 4kg", "higiene", 39.9, 0, 15,
                "Areia sanitária aglomerante com excelente poder de absorção e controle de odores, ideal para caixas de areia de gatos de todos os portes.",
                "gato"));
        produtos.add(produto("brinquedo-mordedor", "Brinquedo Mordedor", "brinquedo", 24.9, 15.99, 5,
                "Mordedor em borracha atóxica e resistente, perfeito para aliviar a ansiedade e ajudar na limpeza dos dentes de cães de pequeno e médio porte.",
                "cachorro"));
        produtos.add(produto("sementes-aves", "Mistura de Sementes Aves", "racao", 19.9, 0, 3,
                "Mistura balanceada de sementes, cereais e frutas desidratadas, desenvolvida para fornecer energia e nutrientes essenciais para aves domésticas.",
                "ave"));
        produtos.add(produto("petisco-natural", "Petisco Natural", "racao", 14.9, 10.99, 19,
                "Petisco 100% natural, sem conservantes artificiais, indicado para recompensar e reforçar o vínculo com cães e gatos de qualquer idade.",
                "cachorro", "gato"));
        produtos.add(produto("comedouro-inox", "Comedouro Inox", "higiene", 29.9, 0, 2,
                "Comedouro em aço inoxidável, antiderrapante, fácil de higienizar e resistente a ferrugem, indicado para qualquer tipo de pet.",
                "cachorro", "gato", "ave", "outro"));
        produtos.add(produto("coleira-ajustavel", "Coleira Ajustável", "brinquedo", 32.9, 30, 1,
                "Coleira ajustável em nylon reforçado, com fivela de segurança, confortável e disponível para diferentes tamanhos de pescoço.",
                "cachorro", "gato"));
        produtos.add(produto("feno-pressionado-mini-pig", "Feno de Alfafa Premium para Porcos", "racao", 29.9, 0, 15,
                "Alimento rico em fibras e cálcio, essencial para o bom funcionamento do trato digestivo e desgaste natural dos dentes de porcos e minipigs.",
                "outro"));
        produtos.add(produto("mordedor-madeira-roedores", "Brinquedo Mordedor de Madeira", "brinquedo", 12.5, 0, 30,
                "Mordedor atóxico de madeira natural, ideal para entreter hamsters e auxiliar na saúde bucal, prevenindo o crescimento excessivo dos dentes.",
                "outro"));
        produtos.add(produto("rede-suspensa-furao", "Rede Suspensa Dupla para Furão", "brinquedo", 45.0, 0, 10,
                "Rede em tecido macio e resistente para descanso e exploração dentro da gaiola, perfeita para atender o comportamento ativo do furão.",
                "outro"));
        produtos.add(produto("cama-cachorro", "Cama para Cachorro", "acessorio", 39.9, 0, 2,
                "Cama confortável e resistente para cachorros de pequeno porte, ideal para o descanso e o bem-estar do seu animal de estimação.",
                "cachorro"));
        produtos.add(produto("gaiola-passaros-2-andares", "Gaiola para Pássaros com 2 Andares", "acessorio", 39.9, 0, 2,
                "Gaiola para Pássaros com 2 Andares",
                "ave"));

        produtoRepository.saveAll(produtos);
        log.info("Catálogo inicial cadastrado: {} produtos.", produtos.size());
    }

    private Produto produto(String identificador, String nome, String categoria, double preco, double promo,
            int quantidade, String descricao, String... especies) {
        Produto p = new Produto();
        p.setIdentificador(identificador);
        p.setNome(nome);
        p.setCategoria(categoria);
        p.setPreco(preco);
        p.setPromo(promo);
        p.setQuantidade(quantidade);
        p.setDescricao(descricao);
        p.setEspecies(new ArrayList<>(List.of(especies)));
        return p;
    }
}
