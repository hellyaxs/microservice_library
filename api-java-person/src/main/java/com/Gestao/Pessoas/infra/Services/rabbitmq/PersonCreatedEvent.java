package com.Gestao.Pessoas.Services.rabbitmq;

import java.util.List;

public record PersonCreatedEvent(
    String id,
    String firstName,
    String lastName,
    String birthdate,
    String email,
    String cargo,
    String endereco,
    List<String> phones) {
}
