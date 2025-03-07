package com.Gestao.Pessoas.Repositorys;

import com.Gestao.Pessoas.Entity.Phone;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface PhoneRepository extends ReactiveCrudRepository<Phone, UUID> {

    Flux<Phone> findByPersonId(UUID id);
}
