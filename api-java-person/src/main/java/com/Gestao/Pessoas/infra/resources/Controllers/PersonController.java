package com.Gestao.Pessoas.resources.Controllers;

import com.Gestao.Pessoas.DTO.PersonDTO;
import com.Gestao.Pessoas.Entity.Person;
import com.Gestao.Pessoas.Exeptons.PersonNotFoundExeption;
import com.Gestao.Pessoas.Services.PersonService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("api/v1/Person")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Person>> getPerson(@PathVariable UUID id)  {
        return personService.findPerson(id).flatMap(person -> {
//            person.add(linkTo(methodOn(PersonController.class).getPerson(person.getId())).withSelfRel());
            return Mono.just(ResponseEntity.ok(person));
        });
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Flux<Person> getAll()  {
        return personService.findAllPerson().switchIfEmpty(Flux.empty()).flatMap(Flux::just);
       }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Person> CreatePerson(@RequestBody @Valid PersonDTO personDTO){
            return personService.CreatePerson(personDTO);
    }
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Mono<Person> updatePerson(@PathVariable UUID id, @RequestBody @Valid PersonDTO person) throws PersonNotFoundExeption {
        return personService.UpdatePerson(id,person);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deletePerson(@PathVariable UUID id) throws PersonNotFoundExeption {
        return personService.deleteById(id);
    }
}
