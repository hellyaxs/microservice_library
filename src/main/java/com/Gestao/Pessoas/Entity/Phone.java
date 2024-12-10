package com.Gestao.Pessoas.Entity;

import com.Gestao.Pessoas.enums.TypePhone;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;


@Table(name = "phone")
public class Phone {


    @Id
    private Long id;

    @Column("DDD")
    private String DDD;

    @Column("numero")
    private String numero;

    @Column("tipo")
    private TypePhone type;

    @Column("person_id")
    private Long personId;

    public Phone() {
    }

    public Phone(Long id, String DDD, String numero, TypePhone type, Long personId) {
        this.id = id;
        this.DDD = DDD;
        this.numero = numero;
        this.type = type;
        this.personId = personId;
    }

    public Phone(Long id, String DDD, String numero, TypePhone type) {
        this.id = id;
        this.DDD = DDD;
        this.numero = numero;
        this.type = type;
    }

    public Long getPersonId() {
        return personId;
    }

    public void setPersonId(Long personId) {
        this.personId = personId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDDD() {
        return DDD;
    }

    public void setDDD(String DDD) {
        this.DDD = DDD;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public TypePhone getType() {
        return type;
    }

    public void setType(TypePhone type) {
        this.type = type;
    }


    @Override
    public String toString() {
        return "Phone{" +
                "id=" + id +
                ", DDD='" + DDD + '\'' +
                ", numero='" + numero + '\'' +
                ", type=" + type +
                '}';
    }
}