# API RESTful para gestão de pessoas com Spring Framework

#### ENDPOINT's
- [POST](https://person-api-projecto.herokuapp.com/api/v1/Person)
- [GET ALL](https://person-api-projecto.herokuapp.com/api/v1/Person)
- [GET ONE](https://person-api-projecto.herokuapp.com/api/v1/Person/1)
- [PUT](https://person-api-projecto.herokuapp.com/api/v1/Person/1)
- [DELETE](https://person-api-projecto.herokuapp.com/api/v1/Person/1)
>Nesta API foram utilizadas das pricipais ferramentas disponibilizadas pelo Spring Framework
>- spring Data JPA
>- Spring Boot 

Com esse projeto fui capaz de consolidar 
conceitos como
inversão de controle e
injeção de dependecias,
notações do Spring Boot,
HTTP Methods, Request & Response,
EndPoints, Core Container,
DTO's,
Entidades, JpaRepository, etc.

***Arquivo JSON***

    "firstName":"Name",
    "lastName":"lastname",
    "birthdate":"06-10-2002",
    "endereco":"NEW YORK",
    "cargo":"Administração",
    "phones":[
        {
            "DDD":"081",
            "numero":"991426794",
            "type":"HOME"
        }
    ]

