# 📚 Livraria Digital - Microsserviços
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

Este projeto é uma aplicação de livraria distribuída, baseada em **Microsserviços**. Ele simula um ecossistema robusto, escalável e assíncrono de uma livraria online, utilizando diferentes linguagens e tecnologias em cada serviço.


## 📌 Visão Geral

A aplicação é composta por múltiplos serviços independentes que se comunicam de forma assíncrona via **RabbitMQ**, com descoberta de serviços usando o **Consul**. A arquitetura contempla tanto **BD de escrita** (write DB) quanto **BD de leitura** (read DB), visando performance e escalabilidade.

---

## 🧱 Arquitetura

+------------------+ +------------------+ +--------------------+ | Frontend App | <---> | API Gateway | <---> | Service Discovery | +------------------+ +------------------+ +--------------------+ | | --------------------------------------------- | | | | | +--------+ +--------+ +--------+ +--------+
| Livros | | Users | | Pagamentos | Notificações ... +--------+ +--------+ +--------+ +--------+ \ \ \ / RabbitMQ RabbitMQ RabbitMQ ...


---

## 🔧 Tecnologias Utilizadas

| Serviço         | Linguagem | Framework       | Banco de Dados | Observações                        |
|----------------|-----------|------------------|----------------|------------------------------------|
| Livros         | Node.js   | NestJS           | PostgreSQL     | Gerencia livros e estoque          |
| Users          | Java      | Spring Boot      | PostgreSQL     | Autenticação e dados dos usuários  |
| Pagamentos     | Python    | FastAPI          | PostgreSQL     | Processamento de pagamentos        |
| Notificações   | Go        | Fiber            | PostgreSQL     | Envia notificações aos usuários    |
| Empréstimos    | Java      | Spring Boot      | PostgreSQL     | Controle de empréstimos de livros  |
| Discovery      | -         | Consul           | -              | Registro e descoberta de serviços  |
| Mensageria     | -         | RabbitMQ         | -              | Comunicação assíncrona             |
| Orquestração   | -         | Docker Compose   | -              | Gerenciamento dos containers       |

---

## 🗃️ Estrutura do Projeto

```tree
livraria-microsservicos/ │
 ├── livros/ # Serviço de gerenciamento de livros (NestJS) 
 ├── users/ # Serviço de usuários (Spring Boot) 
 ├── pagamentos/ # Serviço de pagamentos (FastAPI)
 ├── notificacoes/ # Serviço de notificações (Go) 
 ├── emprestimos/ # Serviço de empréstimos (Spring Boot) 
 ├── discovery/ # Configuração do Consul 
 ├── rabbitmq/ # Configuração do broker de mensagens 
 ├── docker-compose.yml # Orquestração dos serviços
 └── README.md # Este arquivo
```

---

## 📊 Modelagem dos Bancos

### Livros
```sql
CREATE TABLE livros (
  id UUID PRIMARY KEY,
  titulo VARCHAR(255),
  autor VARCHAR(255),
  isbn VARCHAR(13),
  preco DECIMAL(10,2),
  estoque INT,
  criado_em TIMESTAMP,
  atualizado_em TIMESTAMP
);
```


## diagrama da arquitetura

![Arquitetura](./diagrama.png)