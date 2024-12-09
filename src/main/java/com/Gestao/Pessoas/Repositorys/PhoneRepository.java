package com.Gestao.Pessoas.Repositorys;

import com.Gestao.Pessoas.Entity.Phone;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhoneRepository extends ReactiveCrudRepository<Phone, Long> {
}
