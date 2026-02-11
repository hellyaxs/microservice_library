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

## 🔧 Tecnologias Utilizadas

| Serviço        | Linguagem | Framework        | Banco de Dados | Observações                        |
|----------------|-----------|------------------|----------------|------------------------------------|
| Livros         | Java      | Spring Boot      | PostgreSQL     | Gerencia livros e estoque          |
| Users          | Node.js   |  NestJS          | PostgreSQL     | Autenticação e dados dos usuários  |
| Pagamentos     | Java      | Spring Boot      | PostgreSQL     | Processamento de pagamentos        |
| Empréstimos    | GO        | gin              | PostgreSQL     | Controle de empréstimos de livros  |
| Notificações   | Python    | FastAPI          | PostgreSQL     | Envia notificações aos usuários    |
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


## diagrama da arquitetura

![Arquitetura](./diagrama.png)

Arquitetura de Microsserviços Proposta
1. Catálogo de Livros (Java/Spring Boot)

Gerenciamento de livros, autores, editoras, categorias
Busca e filtragem avançada de acervo
ISBN, metadados bibliográficos
Integração com APIs externas (Google Books, Open Library)
Java é excelente aqui pela robustez e ecossistema Spring

2. Gestão de Empréstimos (Go)

Controle de empréstimos e devoluções
Cálculo de multas e renovações
Reservas de livros
Regras de negócio de prazos
Go oferece alta performance e concorrência ideal para operações críticas

3. Gestão de Usuários/Membros (Node.js/Express)

Cadastro e autenticação de usuários
Perfis (estudante, professor, comunidade)
Histórico pessoal de leituras
Preferências e recomendações
Node.js é ágil para APIs REST e integração com frontend

4. Notificações e Comunicação (Python/FastAPI)

Envio de emails (vencimentos, reservas disponíveis)
Notificações push
Lembretes automáticos
Geração de relatórios
Python facilita integrações com serviços externos e agendamento

Contextos Adicionais (Opcional)
5. Relatórios e Analytics (Python/Django)

Dashboards gerenciais
Estatísticas de uso
Análise de popularidade de livros
Python com pandas/numpy para análise de dados

6. Pagamentos/Multas (Node.js ou Java)

Processamento de multas
Integração com gateways de pagamento
Histórico financeiro

Comunicação Entre Serviços

Síncrona: REST APIs ou gRPC
Assíncrona: RabbitMQ, Kafka ou Redis para eventos
Event Sourcing: Para auditoria de empréstimos