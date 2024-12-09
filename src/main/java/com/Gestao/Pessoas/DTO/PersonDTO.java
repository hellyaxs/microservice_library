package com.Gestao.Pessoas.DTO;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;


@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonDTO {

    private Long id;

    @Size(min = 2 ,max= 50)
    private String firstName;

    @Size(min= 2, max = 50)
    private String lastName;

    @Size(max = 13)
    private String birthdate;

    @Size(max = 100)
    private String endereco;

    private String cargo;

    @Valid
    @NotNull
    private List<PhoneDTO> phones;

    @Override
    public String toString() {
        return "PersonDTO{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", birthdate='" + birthdate + '\'' +
                ", endereco='" + endereco + '\'' +
                ", cargo='" + cargo + '\'' +
                ", phones=" + phones +
                '}';
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

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
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

    public List<PhoneDTO> getPhones() {
        return phones;
    }
    public void setPhones(List<PhoneDTO> phones) {
        this.phones = phones;
    }
}
