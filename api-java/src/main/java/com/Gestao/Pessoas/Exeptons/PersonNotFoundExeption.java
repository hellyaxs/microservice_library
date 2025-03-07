package com.Gestao.Pessoas.Exeptons;

import com.Gestao.Pessoas.Entity.Person;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PersonNotFoundExeption extends Exception {

    public PersonNotFoundExeption(UUID id) {
        super("no exiten Person with ID: "+id);
    }
}
