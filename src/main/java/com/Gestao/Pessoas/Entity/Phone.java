package com.Gestao.Pessoas.Entity;

import com.Gestao.Pessoas.enums.TypePhone;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;

@Entity
@Table(name = "phone")
public class Phone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name ="DDD" ,length = 3,nullable = false)
    private String DDD;

    @Column(name = "numero",nullable = false,length = 9)
    private String numero;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TypePhone type;

    public Phone() {
    }

    @Autowired
    public Phone(Long id, String DDD, String numero, TypePhone type) {
        this.id = id;
        this.DDD = DDD;
        this.numero = numero;
        this.type = type;
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