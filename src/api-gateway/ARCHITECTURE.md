# Arquitetura - API NestJS Gateway

## Visão Geral

Este microsserviço atua como **API Gateway** na aplicação de livraria digital, centralizando o roteamento de requisições para outros microsserviços e gerenciando comunicação assíncrona via RabbitMQ. Implementado em **TypeScript** utilizando **NestJS**, segue uma **Arquitetura Modular** com princípios de **Event-Driven Architecture**.

## Padrão Arquitetural

**Arquitetura Modular (Module-based Architecture)** com Event-Driven Architecture:

```
┌─────────────────────────────────────────────┐
│         API Gateway (NestJS)                 │
│   ┌──────────────────────────────────────┐  │
│   │         App Module                    │  │
│   │   ┌──────────────────────────────┐   │  │
│   │   │   Domain Modules             │   │  │
│   │   │  ┌──────┐ ┌──────┐ ┌──────┐  │   │  │
│   │   │  │Users │ │Books │ │Loans │  │   │  │
│   │   │  └──┬───┘ └──┬───┘ └──┬───┘  │   │  │
│   │   │     │        │        │      │   │  │
│   │   │  ┌──▼────────▼────────▼──┐  │   │  │
│   │   │  │   RabbitMQ Module     │  │   │  │
│   │   │  └──────────────────────┘  │   │  │
│   │   └──────────────────────────────┘   │  │
│   └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
           │                    │
           │                    │
    ┌──────▼──────┐    ┌────────▼────────┐
    │  HTTP API   │    │  RabbitMQ       │
    │  (Express)  │    │  (amqplib)      │
    └─────────────┘    └─────────────────┘
```

## Estrutura de Diretórios

```
api-nestjs-gateway/
├── src/
│   ├── app.module.ts              # Módulo raiz da aplicação
│   ├── main.ts                    # Entry point (bootstrap)
│   ├── usuarios/                  # Módulo de Usuários
│   │   ├── usuarios.module.ts    # Definição do módulo
│   │   ├── controller/
│   │   │   └── app.controller.ts # Controller HTTP
│   │   ├── services/
│   │   │   └── app.service.ts    # Service layer
│   │   └── events/               # Event handlers
│   │       ├── create_person.event.ts
│   │       ├── delete_person.event.ts
│   │       └── list_person.event.ts
│   ├── pagamento/                 # Módulo de Pagamentos
│   │   └── pagamento.module.ts
│   ├── livros/                    # Módulo de Livros
│   │   └── livros.module.ts
│   ├── emprestimo/                # Módulo de Empréstimos
│   │   └── emprestimo.module.ts
│   └── rabbitmq/                  # Módulo de Mensageria
│       ├── rabbitmq.module.ts    # Configuração do módulo
│       ├── rabbitmqService.ts     # Serviço RabbitMQ
│       └── provider.rabbimq.ts    # Provider/Factory
├── test/                          # Testes E2E
│   └── app.e2e-spec.ts
├── package.json                   # Dependências npm
├── tsconfig.json                  # Configuração TypeScript
└── nest-cli.json                  # Configuração NestJS CLI
```

## Descrição das Camadas

### 1. Camada de Apresentação (Controllers)

**Responsabilidade**: Receber requisições HTTP e retornar respostas.

#### `usuarios/controller/app.controller.ts`

**Características**:
- **Decorators NestJS**: `@Controller()`, `@Get()`, `@Post()`, etc.
- **Dependency Injection**: Injeção de serviços via construtor
- **DTOs**: Validação de entrada com classes TypeScript
- **Event Publishing**: Publica eventos para RabbitMQ

**Endpoints**:
- `GET /usuarios` - Health check / teste
- `POST /usuarios` - Criar pessoa (publica evento)
- `PUT /usuarios` - Atualizar pessoa (publica evento)
- `DELETE /usuarios` - Deletar pessoa (publica evento)

**Fluxo**:
```typescript
@Post()
createPerson(@Body() person: PersonCreatedEvent): string {
    const event = new CreatedPersonEvent(person);
    this.appService.handlePersonCreated(event);
    return 'message sent';
}
```

### 2. Camada de Aplicação (Services)

**Responsabilidade**: Lógica de negócio e orquestração de eventos.

#### `usuarios/services/app.service.ts`

**Características**:
- **Event-Driven**: Publica eventos para RabbitMQ
- **Queue Management**: Cria e configura filas/exchanges
- **Service Pattern**: Encapsula lógica de negócio

**Operações**:
- `handlePersonCreated()`: Publica evento de criação
- `handlePersonPut()`: Publica evento de atualização
- `handlePersondelete()`: Publica evento de exclusão
- `getHello()`: Método de teste

**Inicialização**:
```typescript
constructor(private readonly rabbitmq: RabbitMQService) {
    // Cria filas e exchanges na inicialização
    this.rabbitmq.createQueue('person_created');
    this.rabbitmq.createExchange('person', 'topic');
    this.rabbitmq.bindQueueToExchange('person_created', 'person', 'created');
}
```

### 3. Camada de Eventos (`events/`)

**Responsabilidade**: Definição de eventos e DTOs de eventos.

#### `usuarios/events/create_person.event.ts`

**Estrutura**:
- Classes TypeScript para eventos
- DTOs tipados para comunicação
- Separação entre eventos internos e externos

**Eventos**:
- `PersonCreatedEvent`: Evento de criação de pessoa
- `CreatedPersonEvent`: Wrapper interno do evento
- `DeletePersonEvent`: Evento de exclusão
- `ListPersonEvent`: Evento de listagem

### 4. Camada de Infraestrutura

#### 4.1 Mensageria (`rabbitmq/`)

**Responsabilidade**: Integração com RabbitMQ para comunicação assíncrona.

#### `rabbitmq/rabbitmqService.ts`

**Características**:
- **Connection Management**: Gerencia conexões RabbitMQ
- **Queue Operations**: Criação e configuração de filas
- **Exchange Operations**: Criação e binding de exchanges
- **Message Publishing**: Publicação de mensagens

**Operações**:
- `createQueue()`: Cria fila durável
- `createExchange()`: Cria exchange (topic, direct, etc.)
- `bindQueueToExchange()`: Liga fila a exchange
- `sendMessage()`: Envia mensagem para fila
- `sendMessageToExchange()`: Envia mensagem para exchange

**Tecnologia**: `amqplib` + `amqp-connection-manager`

#### `rabbitmq/provider.rabbimq.ts`

**Responsabilidade**: Provider/Factory para criação do serviço RabbitMQ.

**Padrão**: Provider Pattern do NestJS para injeção de dependências.

#### `rabbitmq/rabbitmq.module.ts`

**Responsabilidade**: Configuração do módulo RabbitMQ.

**Características**:
- Exporta `RabbitMQService` para outros módulos
- Configura providers
- Módulo global ou importável

### 5. Módulos de Domínio

#### 5.1 Módulo de Usuários (`usuarios/`)

**Responsabilidade**: Gerenciamento de eventos relacionados a usuários.

**Estrutura**:
- Controller para endpoints HTTP
- Service para lógica de negócio
- Events para definição de eventos
- Module para configuração

#### 5.2 Módulo de Pagamentos (`pagamento/`)

**Responsabilidade**: Roteamento de eventos de pagamento.

#### 5.3 Módulo de Livros (`livros/`)

**Responsabilidade**: Roteamento de eventos de livros.

#### 5.4 Módulo de Empréstimos (`emprestimo/`)

**Responsabilidade**: Roteamento de eventos de empréstimos.

### 6. Módulo Raiz (`app.module.ts`)

**Responsabilidade**: Configuração global da aplicação.

**Características**:
- Importa todos os módulos de domínio
- Configura módulo de configuração global (`ConfigModule`)
- Centraliza dependências compartilhadas

**Estrutura**:
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EmprestimoModule,
    UsuariosModule,
    PagamentoModule,
    LivrosModule,
  ],
})
export class AppModule {}
```

## Fluxo de Dados

### Fluxo de Requisição HTTP

```
HTTP Request
    │
    ▼
[Express Router] ──► [NestJS Controller]
    │                      │
    │                      ▼
    │              [Service Layer]
    │                      │
    │                      ▼
    └──────────────────► [RabbitMQ Service]
                              │
                              ▼
                         [RabbitMQ Queue]
```

### Fluxo de Eventos

```
[HTTP Request]
    │
    ▼
[Controller] ──► [Service] ──► [RabbitMQ Service]
    │                              │
    │                              ▼
    └──────────────────────────► [RabbitMQ Exchange]
                                        │
                                        ▼
                                   [Queue Binding]
                                        │
                                        ▼
                                   [Consumer Services]
```

## Padrões de Design Utilizados

1. **Module Pattern**: Organização em módulos por domínio
2. **Dependency Injection**: Injeção de dependências do NestJS
3. **Service Layer Pattern**: Camada de serviços para lógica de negócio
4. **Event-Driven Architecture**: Comunicação assíncrona via eventos
5. **Provider Pattern**: Providers para criação de serviços
6. **Factory Pattern**: Criação de conexões RabbitMQ
7. **DTO Pattern**: Data Transfer Objects tipados
8. **Decorator Pattern**: Decorators do NestJS (@Controller, @Injectable)

## Boas Práticas NestJS Implementadas

### ✅ Implementadas

- **Modularização**: Separação por domínios de negócio
- **Dependency Injection**: Injeção via construtores
- **TypeScript**: Type safety em todo o código
- **Configuration Module**: Externalização de configuração
- **Event-Driven**: Arquitetura baseada em eventos
- **Separation of Concerns**: Separação clara de responsabilidades
- **Service Layer**: Lógica de negócio em serviços

### 🔄 Recomendações de Melhoria

1. **Guards**: Implementar guards para autenticação/autorização
2. **Interceptors**: Adicionar interceptors para logging/monitoramento
3. **Pipes**: Validação de entrada com class-validator
4. **Filters**: Exception filters globais
5. **Swagger**: Documentação automática da API
6. **Health Checks**: Endpoints de health check
7. **Métricas**: Integração com Prometheus
8. **Tracing**: Distributed tracing (OpenTelemetry)
9. **Rate Limiting**: Implementar rate limiting
10. **Circuit Breaker**: Resilience patterns

## Decisões Arquiteturais Importantes

### 1. NestJS como Framework
**Decisão**: Usar NestJS ao invés de Express puro
**Razão**:
- Arquitetura modular nativa
- Dependency Injection built-in
- TypeScript first-class
- Padrões enterprise-ready
- Ecossistema robusto

### 2. Arquitetura Modular
**Decisão**: Organizar por módulos de domínio
**Razão**:
- Escalabilidade
- Manutenibilidade
- Testabilidade
- Reutilização

### 3. Event-Driven Architecture
**Decisão**: Comunicação assíncrona via RabbitMQ
**Razão**:
- Desacoplamento entre serviços
- Escalabilidade
- Resiliência
- Flexibilidade

### 4. API Gateway Pattern
**Decisão**: Centralizar roteamento no gateway
**Razão**:
- Ponto único de entrada
- Cross-cutting concerns (auth, logging)
- Load balancing
- API versioning

### 5. RabbitMQ para Mensageria
**Decisão**: Usar RabbitMQ ao invés de Kafka ou outros
**Razão**:
- Maturidade
- Flexibilidade (exchanges, routing)
- Confiabilidade (acknowledgments)
- Ecossistema

## Dependências Principais

- **@nestjs/common**: Core do NestJS
- **@nestjs/core**: Core do framework
- **@nestjs/config**: Gerenciamento de configuração
- **@nestjs/platform-express**: Adaptador Express
- **amqplib**: Cliente RabbitMQ
- **amqp-connection-manager**: Gerenciamento de conexões
- **rxjs**: Programação reativa (usado pelo NestJS)

## Escalabilidade

O gateway foi projetado para escalar:

- **Stateless**: Sem estado compartilhado
- **Horizontal scaling**: Múltiplas instâncias
- **Load balancing**: Distribuição de carga
- **Connection pooling**: RabbitMQ gerencia conexões
- **Async processing**: Processamento assíncrono

## Observabilidade

**Recomendações**:
- **Logging**: Structured logging (Winston, Pino)
- **Métricas**: Prometheus + Grafana
- **Tracing**: OpenTelemetry para distributed tracing
- **Health checks**: `/health` endpoint
- **APM**: New Relic, Datadog, etc.

## Segurança

**Considerações**:
- **Authentication**: JWT ou OAuth2
- **Authorization**: Guards para controle de acesso
- **Rate Limiting**: Prevenir abuso
- **Input Validation**: Validar todas as entradas
- **HTTPS**: TLS em produção
- **CORS**: Configurar CORS adequadamente
- **Secrets**: Gerenciar secrets (Vault, etc)

## Testabilidade

**Estrutura de Testes**:
```typescript
describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should create person event', () => {
    // Test implementation
  });
});
```

**Ferramentas**:
- Jest (built-in no NestJS)
- Supertest para testes E2E
- Mocks para dependências

## Performance

**Otimizações**:
- Connection pooling do RabbitMQ
- Async/await para operações não bloqueantes
- Compression de respostas HTTP
- Caching quando apropriado
- Load balancing

## Padrões de Comunicação

### 1. Síncrono (HTTP)
- Requisições HTTP diretas
- Resposta imediata
- Usado para operações que precisam de resposta rápida

### 2. Assíncrono (RabbitMQ)
- Publicação de eventos
- Processamento assíncrono
- Usado para operações que podem ser processadas depois

## Integração com Outros Microsserviços

O gateway atua como orquestrador:

```
[Frontend/Client]
    │
    ▼
[API Gateway (NestJS)]
    │
    ├──► [Person Service] (Java)
    ├──► [Payment Service] (Python)
    ├──► [Notification Service] (Go)
    └──► [Books Service] (NestJS)
```

**Vantagens**:
- Desacoplamento
- Versionamento de API
- Transformação de dados
- Agregação de respostas
