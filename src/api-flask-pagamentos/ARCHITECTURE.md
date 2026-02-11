# Arquitetura - API Flask Pagamentos

## Visão Geral

Este microsserviço é responsável pelo processamento de pagamentos na aplicação de livraria digital. Implementado em **Python** utilizando o framework **Flask**, segue uma **Arquitetura em Camadas (Layered Architecture)** com princípios de **Domain-Driven Design (DDD)**.

## Padrão Arquitetural

**Arquitetura em Camadas (Layered Architecture)** com separação clara de responsabilidades:

```
┌─────────────────────────────────────┐
│   Camada de Apresentação           │
│   (Routes/Blueprints)              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Camada de Aplicação               │
│   (Services/Business Logic)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Camada de Domínio                 │
│   (Domain Entities/Value Objects)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Camada de Infraestrutura          │
│   (Database, RabbitMQ, External APIs)│
└─────────────────────────────────────┘
```

## Estrutura de Diretórios

```
api-flask-pagamentos/
├── app/                    # Módulo principal da aplicação
│   ├── __init__.py        # Application Factory Pattern
│   ├── config.py          # Configurações da aplicação
│   ├── models.py          # Modelos SQLAlchemy (Infraestrutura)
│   └── routes.py          # Blueprints e rotas (Apresentação)
├── domain/                 # Camada de Domínio (DDD)
│   └── entidades.py       # Entidades de domínio e Value Objects
├── rabbitmq/              # Integração com RabbitMQ (Infraestrutura)
│   ├── __init__.py
│   └── config.py          # Cliente RabbitMQ assíncrono
├── config/                # Configurações externas
│   └── setup.py           # Variáveis de ambiente
├── main.py                # Entry point assíncrono
├── requirements.txt       # Dependências Python
└── dockerfile             # Containerização
```

## Descrição das Camadas

### 1. Camada de Apresentação (`app/routes.py`)

**Responsabilidade**: Receber requisições HTTP e retornar respostas JSON.

**Características**:
- Utiliza **Blueprints** do Flask para organização modular
- Endpoints RESTful para operações CRUD de pessoas
- Validação básica de entrada
- Serialização JSON automática

**Endpoints**:
- `GET /api/person` - Listar pessoas
- `POST /api/person` - Criar pessoa
- `GET /api/person/<id>` - Buscar pessoa por ID
- `PUT /api/person/<id>` - Atualizar pessoa
- `DELETE /api/person/<id>` - Deletar pessoa

### 2. Camada de Aplicação (Services)

**Responsabilidade**: Orquestrar a lógica de negócio e coordenar entre camadas.

**Nota**: Atualmente a lógica está nas rotas, mas idealmente deveria estar em uma camada de serviços separada para melhor testabilidade e reutilização.

**Boas Práticas Recomendadas**:
```python
# Exemplo de estrutura recomendada:
app/
├── services/
│   └── person_service.py  # Lógica de negócio
```

### 3. Camada de Domínio (`domain/entidades.py`)

**Responsabilidade**: Representar as entidades de negócio e regras de domínio.

**Entidades**:
- **Dinheiro** (Value Object): Representa valores monetários com moeda
- **Transacao**: Representa uma transação de pagamento
- **Fatura**: Representa uma fatura com valor total e status
- **Pagamento**: Agrega Transacao e Fatura

**Princípios DDD**:
- Value Objects imutáveis (Dinheiro)
- Entidades com identidade (Transacao, Fatura)
- Agregados (Pagamento)

### 4. Camada de Infraestrutura

#### 4.1 Persistência (`app/models.py`)

**Responsabilidade**: Mapeamento objeto-relacional usando SQLAlchemy.

**Modelos**:
- `User`: Modelo de usuário
- `Post`: Modelo de post (exemplo)

**Características**:
- ORM SQLAlchemy para abstração do banco de dados
- Suporte a relacionamentos (Foreign Keys)
- Migrations automáticas

#### 4.2 Mensageria (`rabbitmq/config.py`)

**Responsabilidade**: Comunicação assíncrona com outros microsserviços via RabbitMQ.

**Classe `AsyncRabbitMQClient`**:
- Conexão assíncrona robusta (`aio_pika`)
- Publicação de mensagens em filas
- Consumo de mensagens com callbacks
- QoS configurável (prefetch_count)
- Filas duráveis para persistência

**Filas Consumidas**:
- `person_created` - Evento de criação de pessoa
- `person_updated` - Evento de atualização de pessoa
- `person_deleted` - Evento de exclusão de pessoa

## Application Factory Pattern

O projeto utiliza o padrão **Application Factory** (`app/__init__.py`):

```python
def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    # Registra blueprints
    app.register_blueprint(main_blueprint)
    return app
```

**Vantagens**:
- Facilita testes unitários
- Permite múltiplas instâncias da aplicação
- Configuração flexível por ambiente

## Fluxo de Dados

### Fluxo de Requisição HTTP

```
Cliente HTTP
    │
    ▼
[Routes/Blueprints] ──► [Services] ──► [Domain Entities]
    │                                      │
    │                                      ▼
    └─────────────────────────────────► [Database Models]
```

### Fluxo de Mensageria (RabbitMQ)

```
[RabbitMQ Queue]
    │
    ▼
[AsyncRabbitMQClient.consume()]
    │
    ▼
[Callback Handler]
    │
    ▼
[Domain Logic]
```

## Padrões de Design Utilizados

1. **Application Factory Pattern**: Criação flexível da aplicação Flask
2. **Blueprint Pattern**: Organização modular de rotas
3. **Repository Pattern**: Abstração de acesso a dados (via SQLAlchemy)
4. **Value Object Pattern**: Objetos imutáveis de valor (Dinheiro)
5. **Domain Model Pattern**: Entidades ricas de domínio
6. **Dependency Injection**: Injeção de dependências via Flask

## Boas Práticas Flask Implementadas

### ✅ Implementadas

- **Blueprints** para organização modular
- **Application Factory** para flexibilidade
- **Separação de configuração** (`config.py`)
- **Domain-Driven Design** com entidades de domínio
- **Programação assíncrona** para RabbitMQ (`aio_pika`)

### 🔄 Recomendações de Melhoria

1. **Camada de Serviços**: Criar serviços para isolar lógica de negócio
2. **Validação**: Implementar validação robusta com `marshmallow` ou `pydantic`
3. **Error Handling**: Criar handlers centralizados de exceções
4. **Logging**: Implementar logging estruturado
5. **Testes**: Adicionar testes unitários e de integração
6. **Documentação API**: Integrar Swagger/OpenAPI
7. **Type Hints**: Adicionar type hints para melhor manutenibilidade

## Decisões Arquiteturais Importantes

### 1. Uso de Blueprints
**Decisão**: Organizar rotas em blueprints modulares
**Razão**: Facilita escalabilidade e manutenção do código

### 2. Domain-Driven Design
**Decisão**: Separar entidades de domínio da infraestrutura
**Razão**: Mantém o domínio independente de frameworks e facilita testes

### 3. Programação Assíncrona para RabbitMQ
**Decisão**: Usar `aio_pika` ao invés de `pika` síncrono
**Razão**: Melhor performance e não bloqueia a aplicação durante operações I/O

### 4. Application Factory Pattern
**Decisão**: Usar factory function ao invés de instância global
**Razão**: Facilita testes e permite múltiplas instâncias

## Dependências Principais

- **Flask**: Framework web
- **SQLAlchemy**: ORM para banco de dados
- **aio_pika**: Cliente RabbitMQ assíncrono
- **python-dotenv**: Gerenciamento de variáveis de ambiente

## Escalabilidade

O microsserviço foi projetado para escalar horizontalmente:

- **Stateless**: Não mantém estado entre requisições
- **Assíncrono**: Operações I/O não bloqueantes
- **Containerizado**: Pronto para deploy em containers Docker
- **Mensageria**: Comunicação assíncrona via RabbitMQ

## Observabilidade

**Recomendações**:
- Adicionar logging estruturado (ex: `structlog`)
- Implementar métricas (ex: Prometheus)
- Adicionar tracing distribuído (ex: OpenTelemetry)
- Health checks para monitoramento

## Segurança

**Considerações**:
- Configurar `SECRET_KEY` adequadamente em produção
- Implementar autenticação/autorização (JWT, OAuth2)
- Validação e sanitização de entrada
- Rate limiting para prevenir abuso
- HTTPS em produção
