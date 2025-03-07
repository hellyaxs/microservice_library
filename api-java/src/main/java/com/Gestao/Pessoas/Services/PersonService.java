package com.Gestao.Pessoas.Services;

import com.Gestao.Pessoas.DTO.PersonDTO;
import com.Gestao.Pessoas.DTO.response.MessageResponseDTO;
import com.Gestao.Pessoas.Entity.Person;
import com.Gestao.Pessoas.Entity.Phone;
import com.Gestao.Pessoas.Exeptons.PersonNotFoundExeption;
import com.Gestao.Pessoas.Repositorys.PersonRepository;
import com.Gestao.Pessoas.Repositorys.PhoneRepository;
import com.Gestao.Pessoas.mapper.MapperPerson;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PersonService {

     private final MapperPerson mapperPerson;
     private final PersonRepository personRepository;
     private final PhoneRepository phoneRepository;
     private final R2dbcEntityTemplate r2dbcEntityTemplate;

    public PersonService(MapperPerson mapperPerson, PersonRepository personRepository, PhoneRepository phoneRepository, R2dbcEntityTemplate r2dbcEntityTemplate) {
        this.mapperPerson = mapperPerson;
        this.personRepository = personRepository;
        this.phoneRepository = phoneRepository;
        this.r2dbcEntityTemplate = r2dbcEntityTemplate;
    }

    public Mono<Person> CreatePerson(PersonDTO personDTO) {

        Person persontoSave = PersonDTO.ToDomain(personDTO);
        UUID id = persontoSave.getId();

        // Prepara a lista de telefones com o ID da pessoa
        List<Phone> listphones = persontoSave.getPhones().stream()
                .peek(phone -> phone.setPersonId(id))
                .toList();

         return r2dbcEntityTemplate.insert(persontoSave)
                .publishOn(Schedulers.boundedElastic())
                .map(person -> {
                    phoneRepository.saveAll(listphones).subscribe();
                    return person;
                })
                .then(Mono.just(persontoSave));
    }

    public Mono<Person> UpdatePerson(UUID id, PersonDTO person) throws PersonNotFoundExeption {
        return existeIfID(id).switchIfEmpty(Mono.error(new PersonNotFoundExeption(id)))
                .flatMap(person1 -> {
            Person personUpdate = PersonDTO.ToDomain(person);
            personUpdate.setId(id);
            return personRepository.save(personUpdate);
        });
    }

    public Mono<Person> findPerson(UUID id)  {
        return existeIfID(id);
    }

    public Mono<Void> deleteById(UUID id)  {
      return personRepository.deleteById(id);
    }

    public Flux<Person> findAllPerson(){
      return personRepository.findAll().flatMap(person -> {
          return phoneRepository.findByPersonId(person.getId())
                  .defaultIfEmpty(new Phone()).defaultIfEmpty(new Phone()) // Retorna um Phone vazio, se não houver resultados
                  .collectList()
                  .flatMapMany(phone -> {
                    person.setPhones(phone);
                    return Flux.just(person);
                 });
          });
    }

    private Mono<Person> existeIfID(UUID id) {
        return personRepository.findById(id).switchIfEmpty(Mono.error(new PersonNotFoundExeption(id)));
    }

   private MessageResponseDTO createMessageResponse(Person person){
        String messageCon = "New Person created sucess with ID" +" "+person.getId();
        return new MessageResponseDTO(messageCon);

    }
}
