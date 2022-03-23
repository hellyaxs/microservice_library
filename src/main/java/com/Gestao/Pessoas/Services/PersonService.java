package com.Gestao.Pessoas.Services;

import com.Gestao.Pessoas.DTO.PersonDTO;
import com.Gestao.Pessoas.DTO.response.MessageResponseDTO;
import com.Gestao.Pessoas.Entity.Person;
import com.Gestao.Pessoas.Exeptons.PersonNotFoundExeption;
import com.Gestao.Pessoas.Repositorys.PersonRepository;
import com.Gestao.Pessoas.mapper.MapperPerson;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@NoArgsConstructor
@AllArgsConstructor
public class PersonService {

     @Autowired
     private MapperPerson mapperPerson;
     @Autowired
     private PersonRepository personRepository;

    public Person CreatePerson(PersonDTO personDTO){
        Person persontoSave = mapperPerson.PersonDtoToPerson(personDTO);
        System.out.println(personDTO);
        System.out.println(persontoSave);
        return personRepository.save(persontoSave);
        //createMessageResponse(persontoSave).getMessagem();
    }

    public Person UpdatePerson(Long id,PersonDTO person) throws PersonNotFoundExeption {
        Person existPerson = existeIfID(id);
        Person personUpdate = MapperPerson.INSTACE.PersonDtoToPerson(person);
        if(existPerson.equals(Person.class)){
            personUpdate.setId(id);
            personRepository.delete(existPerson);
        }
        return personRepository.save(personUpdate);

    }

    public Person findPerson(Long id) throws PersonNotFoundExeption {
        return existeIfID(id);
    }

    public void Delete(Long id) throws PersonNotFoundExeption {
         existeIfID(id);
         personRepository.deleteById(id);
    }

    public List<Person> findAllPerson(){
      return personRepository.findAll();
    }

    private Person existeIfID(Long id) throws PersonNotFoundExeption {
        return personRepository.findById(id).orElseThrow(()->new PersonNotFoundExeption(id));
    }

   private MessageResponseDTO createMessageResponse(Person person){
        String messageCon = "New Person created sucess with ID" +" "+person.getId();
        return new MessageResponseDTO(messageCon);

    }
}
