package main.java.com.Gestao.Pessoas.domain;

import main.java.com.Gestao.Pessoas.domain.Telefone;

public class Pessoa {

    private String nome;
    private String sobrenome;
    private String cpf;
    private String rg;
    private String dataNascimento;
    private String sexo;
    private String estadoCivil;
    private Telefone telefone;

    public Pessoa(String nome, String sobrenome, String cpf, String rg, String dataNascimento, String sexo,
            String estadoCivil, Telefone telefone) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf;
        this.rg = rg;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
        this.estadoCivil = estadoCivil;
    }
    public Pessoa() {
    }





}
