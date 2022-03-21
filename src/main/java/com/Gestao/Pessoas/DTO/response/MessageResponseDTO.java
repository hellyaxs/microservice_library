package com.Gestao.Pessoas.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class MessageResponseDTO {

    public MessageResponseDTO(String messagem) {
        Messagem = messagem;
    }

    private String Messagem;
}
