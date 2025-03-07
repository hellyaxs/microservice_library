package com.Gestao.Pessoas.DTO.response;


import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

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
