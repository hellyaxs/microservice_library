package com.Gestao.Pessoas.Entity;

import lombok.*;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.util.List;

@Builder
@Table(name = "person")
@Setter
@NoArgsConstructor
@Getter
public class Person  {

    @Column("ID")
    @Id
    private Long id;

    @Column("FRIST_NAME")
    private String firstName;

    @Column("LAST_NAME")
    private String lastName;

    @Column("birthdate")
    private LocalDate birthdate;

    @Column("endereco")
    private String endereco;

    @Column("cargo")
    private String cargo;


    private List<Phone> phones;


    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", birthdate=" + birthdate +
                ", endereco='" + endereco + '\'' +
                ", cargo='" + cargo + '\'' +
                ", phones=" + phones +
                '}';
    }

    public Person(Long id, String firstName, String lastName, LocalDate birthdate, String endereco, String cargo, List<Phone> phones) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
        this.endereco = endereco;
        this.cargo = cargo;
        this.phones = phones;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public List<Phone> getPhones() {
        return phones;
    }

    public void setPhones(List<Phone> phones) {
        this.phones = phones;
    }
}