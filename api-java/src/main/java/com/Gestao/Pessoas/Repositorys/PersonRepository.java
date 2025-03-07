package com.Gestao.Pessoas.Repositorys;

import com.Gestao.Pessoas.Entity.Person;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PersonRepository extends ReactiveCrudRepository<Person, UUID> {
}