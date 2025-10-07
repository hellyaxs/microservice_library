package com.Gestao.Pessoas.enums;

public enum TypePhone {

    COMERCIAL("comercial"),
    HOME("home"),
    MOBILE("celular");

    private final String type;

    TypePhone(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }


}
