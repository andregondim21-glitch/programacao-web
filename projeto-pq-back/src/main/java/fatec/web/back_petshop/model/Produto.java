package fatec.web.back_petshop.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

@Entity 
public class Produto {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    // Slug do produto (ex.: "racao-premium"); o front usa como nome da imagem (racao-premium.jpg)
    @Column(nullable = false, unique = true, length = 100)
    private String identificador;
    @Column(nullable = false, length = 150)
    private String nome;
    @Column(nullable = false, length = 30)
    private String categoria;
    private double preco;
    // Preço promocional; 0 significa "sem promoção"
    private double promo;
    // Quantidade em estoque
    private Integer quantidade;
    @Column(length = 1000)
    private String descricao;
    // Espécies para as quais o produto é indicado (tabela produto_especies)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "produto_especies", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "especie", length = 20)
    private List<String> especies = new ArrayList<>();
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getIdentificador() {
        return identificador;
    }
    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    public double getPreco() {
        return preco;
    }
    public void setPreco(double preco) {
        this.preco = preco;
    }
    public double getPromo() {
        return promo;
    }
    public void setPromo(double promo) {
        this.promo = promo;
    }
    public Integer getQuantidade() {
        return quantidade;
    }
    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public List<String> getEspecies() {
        return especies;
    }
    public void setEspecies(List<String> especies) {
        this.especies = especies;
    }

    public Produto() {
        
    }

    

}
