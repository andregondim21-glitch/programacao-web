package com.ads.lojinha;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor
public class Produto {
    private int codigo;
    private String nome;
    private String descricao;
    private double valor;
    private double valorPromo;
    private int quantidade;
    private int destaque;


}
