package com.Gestao.Pessoas.Controllers;

import com.Gestao.Pessoas.DTO.PersonDTO;
import com.Gestao.Pessoas.Entity.Person;
import com.Gestao.Pessoas.Exeptons.PersonNotFoundExeption;
import com.Gestao.Pessoas.Services.PersonService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


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
    @ResponseStatus(HttpStatus.OK)
    public Mono<Person> getPerson(@PathVariable Long id)  {
        return personService.findPerson(id).flatMap(person -> {
//            person.add(linkTo(methodOn(PersonController.class).getPerson(person.getId())).withSelfRel());
            return Mono.just(person);
        });
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Flux<Person> getAll()  {
        return  personService.findAllPerson().switchIfEmpty(Flux.empty()).flatMap(Flux::just);
       }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Person> CreatePerson(@RequestBody @Valid PersonDTO personDTO){
            return personService.CreatePerson(personDTO);
    }
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Mono<Person> updatePerson(@PathVariable Long id, @RequestBody @Valid PersonDTO person) throws PersonNotFoundExeption {
        return personService.UpdatePerson(id,person);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePerson(@PathVariable Long id) throws PersonNotFoundExeption {
        personService.Delete(id);
    }
}
