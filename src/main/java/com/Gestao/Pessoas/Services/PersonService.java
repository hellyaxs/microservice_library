package com.Gestao.Pessoas.Services;

import com.Gestao.Pessoas.DTO.PersonDTO;
import com.Gestao.Pessoas.DTO.response.MessageResponseDTO;
import com.Gestao.Pessoas.Entity.Person;
import com.Gestao.Pessoas.Entity.Phone;
import com.Gestao.Pessoas.Exeptons.PersonNotFoundExeption;
import com.Gestao.Pessoas.Repositorys.PersonRepository;
import com.Gestao.Pessoas.Repositorys.PhoneRepository;
import com.Gestao.Pessoas.mapper.MapperPerson;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class PersonService {


     private final MapperPerson mapperPerson;

     private final PersonRepository personRepository;
     private final PhoneRepository phoneRepository;

    public PersonService(MapperPerson mapperPerson, PersonRepository personRepository, PhoneRepository phoneRepository) {
        this.mapperPerson = mapperPerson;
        this.personRepository = personRepository;
        this.phoneRepository = phoneRepository;
    }

    public Mono<Person> CreatePerson(PersonDTO personDTO){
           return Mono.just(PersonDTO.ToDomain(personDTO)).flatMap(personRepository::save);


//        return personRepository.save(persontoSave)
//                .flatMap(savedPerson -> {
//                    // Salvar os telefones após a pessoa ser salva
//                    List<Phone> phones = personDTO.getPhones().stream()
//                            .map(phoneDTO -> new Phone(personDTO.getId(), phoneDTO.getDDD(), phoneDTO.getNumero(), phoneDTO.getType()))
//                            .collect(Collectors.toList());
//                    return phoneRepository.saveAll(phones).collectList().map(savedPhones -> savedPerson);
//                });
        //createMessageResponse(persontoSave).getMessagem();
    }

    public Mono<Person> UpdatePerson(Long id, PersonDTO person) throws PersonNotFoundExeption {
        Mono<Person> existPerson = existeIfID(id);
        Person personUpdate = PersonDTO.ToDomain(person);
        if(existPerson.equals(Person.class)){
            personUpdate.setId(id);
            personRepository.delete(existPerson.block());
        }
        return personRepository.save(personUpdate);

    }

    public Mono<Person> findPerson(Long id)  {
        return existeIfID(id);
    }

    public void Delete(Long id)  {
         existeIfID(id);
         personRepository.deleteById(id);
    }

    public Flux<Person> findAllPerson(){
      return personRepository.findAll();
    }

    private Mono<Person> existeIfID(Long id) {
        return personRepository.findById(id);
    }

   private MessageResponseDTO createMessageResponse(Person person){
        String messageCon = "New Person created sucess with ID" +" "+person.getId();
        return new MessageResponseDTO(messageCon);

    }
}
