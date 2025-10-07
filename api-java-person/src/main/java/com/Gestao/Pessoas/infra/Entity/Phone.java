package com.Gestao.Pessoas.Entity;

import com.Gestao.Pessoas.enums.TypePhone;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;


@Table(name = "phone")
public class Phone {

    @Column("id")
    private UUID id;

    @Column("ddd")
    private String ddd;

    @Column("numero")
    private String numero;

    @Column("tipo")
    private TypePhone type;

    @Column("person_id")
    @JsonIgnore
    private UUID personId;

    public Phone() {
    }

    public Phone(UUID id, String ddd, String numero, TypePhone type, UUID personId) {
        this.id = id;
        this.ddd = ddd;
        this.numero = numero;
        this.type = type;
        this.personId = personId;
    }

    public Phone(UUID id, String ddd, String numero, TypePhone type) {
        this.id = id;
        this.ddd = ddd;
        this.numero = numero;
        this.type = type;
    }

    public UUID getPersonId() {
        return personId;
    }

    public void setPersonId(UUID personId) {
        this.personId = personId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDdd() {
        return ddd;
    }

    public void setDdd(String DDD) {
        this.ddd = DDD;
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
                ", DDD='" + ddd + '\'' +
                ", numero='" + numero + '\'' +
                ", type=" + type +
                '}';
    }
}