package com.Gestao.Pessoas.DTO;


import com.Gestao.Pessoas.Entity.Person;
import com.Gestao.Pessoas.Entity.Phone;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonDTO {

    private UUID id;

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

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
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

    public static Person ToDomain(PersonDTO personDTO){
        List<Phone> phoneStream = personDTO.phones.stream().map(PhoneDTO::ToDomain).toList();
        return new Person(UUID.randomUUID(), personDTO.firstName, personDTO.lastName, LocalDate.now(), personDTO.endereco, personDTO.cargo, phoneStream);
    }
}
