package com.Gestao.Pessoas.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Data
@Builder
@NoArgsConstructor
public class MessageResponseDTO {

    @Autowired
    public MessageResponseDTO(String messagem) {
        Messagem = messagem;
    }

    private String Messagem;

    public String getMessagem() {
        return Messagem;
    }

    public void setMessagem(String messagem) {
        Messagem = messagem;
    }
}
