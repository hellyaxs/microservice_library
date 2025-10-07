package com.Gestao.Pessoas.DTO;

import com.Gestao.Pessoas.Entity.Phone;
import com.Gestao.Pessoas.enums.TypePhone;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;


public class PhoneDTO{

    private UUID id;

    @NotNull
    private String DDD;

    @Size(max = 10, min = 9)
    @NotNull
    private String numero;

    private TypePhone type;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
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

    public PhoneDTO(UUID id, String DDD, String numero, TypePhone type) {
        this.id = id;
        this.DDD = DDD;
        this.numero = numero;
        this.type = type;
    }

    @Override
    public String toString() {
        return "PhoneDTO{" +
                "id=" + id +
                ", DDD='" + DDD + '\'' +
                ", numero='" + numero + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
    public static Phone ToDomain(PhoneDTO phoneDTO){
        return new Phone(UUID.randomUUID(), phoneDTO.getDDD(), phoneDTO.getNumero(), phoneDTO.getType());
    }
}
