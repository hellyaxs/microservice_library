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

    public Mono<Person> CreatePerson(PersonDTO personDTO) {
        Person persontoSave = PersonDTO.ToDomain(personDTO);
        persontoSave.setId(null);
        return personRepository.save(persontoSave) // Salva a pessoa
                .flatMap(savedPerson -> {
                   return Flux.fromIterable(persontoSave.getPhones())
                            .flatMap(phone -> {
                                phone.setId(null);
                                phone.setPersonId(savedPerson.getId());
                                return phoneRepository.save(phone); // Salva os telefones
                            })
                            .then(Mono.just(savedPerson));
                });
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

    private Mono<Person> existeIfID(Long id) {
        return personRepository.findById(id);
    }

   private MessageResponseDTO createMessageResponse(Person person){
        String messageCon = "New Person created sucess with ID" +" "+person.getId();
        return new MessageResponseDTO(messageCon);

    }
}
