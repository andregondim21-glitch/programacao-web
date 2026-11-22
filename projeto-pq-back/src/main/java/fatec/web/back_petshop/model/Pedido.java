package fatec.web.back_petshop.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity 
public class Pedido {
    @Id 
    @GeneratedValue (strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    // Um pedido pode ter vários produtos (os itens do carrinho)
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();
    private double valorTotal;
    @Column(nullable = false, length = 30)
    private String status;
    private LocalDateTime dataPedido;
    @Column(nullable = false, length = 20)
    private String formaPagamento;
    // É presente? (no front: caixa "É um presente?")
    private Boolean presente;
    @Column(length = 500)
    private String mensagemPresente;
    // Endereço de entrega informado no checkout
    @Column(length = 8)
    private String cep;
    @Column(length = 20)
    private String numero;
    @Column(length = 255)
    private String endereco;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Cliente getCliente() {
        return cliente;
    }
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    public List<ItemPedido> getItens() {
        return itens;
    }
    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
    }
    public double getValorTotal() {
        return valorTotal;
    }
    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDateTime getDataPedido() {
        return dataPedido;
    }
    public void setDataPedido(LocalDateTime dataPedido) {
        this.dataPedido = dataPedido;
    }
    public String getFormaPagamento() {
        return formaPagamento;
    }
    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }
    public Boolean getPresente() {
        return presente;
    }
    public void setPresente(Boolean presente) {
        this.presente = presente;
    }
    public String getMensagemPresente() {
        return mensagemPresente;
    }
    public void setMensagemPresente(String mensagemPresente) {
        this.mensagemPresente = mensagemPresente;
    }
    public String getCep() {
        return cep;
    }
    public void setCep(String cep) {
        this.cep = cep;
    }
    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }
    public String getEndereco() {
        return endereco;
    }
    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Pedido() {
        
    }

    
}
