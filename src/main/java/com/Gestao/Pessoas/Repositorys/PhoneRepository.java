package com.Gestao.Pessoas.Repositorys;

import com.Gestao.Pessoas.Entity.Phone;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface PhoneRepository extends ReactiveCrudRepository<Phone, Long> {

    Flux<Phone> findByPersonId(Long id);
}
