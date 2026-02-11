# Arquitetura - API Golang Notificações

## Visão Geral

Este microsserviço é responsável pelo envio de notificações aos usuários da aplicação de livraria digital. Implementado em **Go** utilizando o framework **Gin**, segue uma **Clean Architecture / Hexagonal Architecture** com separação clara de responsabilidades e princípios SOLID.

## Padrão Arquitetural

**Clean Architecture / Hexagonal Architecture** (Ports & Adapters):

```
┌─────────────────────────────────────────────┐
│         Entry Points (cmd/)                 │
│  ┌─────────────┐  ┌──────────────────┐     │
│  │  API Server │  │  Message Processor│     │
│  └──────┬───────┘  └─────────┬────────┘     │
└─────────┼────────────────────┼──────────────┘
          │                    │
┌─────────▼────────────────────▼──────────────┐
│      Presentation Layer (api/)              │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │   Routes     │  │    Handlers      │    │
│  └──────┬───────┘  └─────────┬────────┘    │
└─────────┼────────────────────┼──────────────┘
          │                    │
┌─────────▼────────────────────▼──────────────┐
│      Application Layer (internal/)           │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │   Domain     │  │   Repository     │    │
│  │  Entities    │  │   Interfaces    │    │
│  └──────┬───────┘  └─────────┬────────┘    │
└─────────┼────────────────────┼──────────────┘
          │                    │
┌─────────▼────────────────────▼──────────────┐
│    Infrastructure Layer (pkg/, config/)     │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │  Database    │  │    RabbitMQ      │    │
│  │  (GORM)      │  │   Integration    │    │
│  └──────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────┘
```

## Estrutura de Diretórios

```
api-golang-notificacoes/
├── cmd/                      # Entry Points (Clean Architecture)
│   ├── api/                 # Servidor HTTP API
│   │   └── main.go          # Inicialização do servidor HTTP
│   └── processor/           # Processador de mensagens RabbitMQ
│       └── main.go          # Inicialização do consumer
├── api/                      # Camada de Apresentação
│   ├── handlers/            # Handlers HTTP (Controllers)
│   │   ├── person.controller.go
│   │   └── middiwarePerson.go
│   └── routes.go            # Definição de rotas
├── internal/                 # Código interno (não exportado)
│   ├── domain/              # Entidades de Domínio
│   │   ├── person.go
│   │   ├── phones.go
│   │   └── notification.go
│   └── respository/         # Implementação de Repositórios
│       └── person_repository.go
├── pkg/                      # Pacotes compartilhados (exportáveis)
│   ├── env/                 # Configuração de ambiente
│   │   └── setup.go
│   └── rabbbitmq/           # Cliente RabbitMQ
│       └── rabbitmq_config.go
├── config/                   # Configurações da aplicação
│   ├── database.go          # Configuração do banco de dados
│   └── http.go              # Configuração HTTP (Gin)
├── go.mod                    # Módulo Go
├── go.sum                    # Checksums das dependências
└── dockerfile               # Containerização
```

## Descrição das Camadas

### 1. Entry Points (`cmd/`)

**Responsabilidade**: Pontos de entrada da aplicação, inicialização dos serviços.

#### `cmd/api/main.go`
- Inicializa o servidor HTTP
- Configura rotas e middlewares
- Conecta ao banco de dados
- Inicia o servidor Gin na porta 8080

#### `cmd/processor/main.go`
- Inicializa o processador de mensagens RabbitMQ
- Consome eventos de outros microsserviços
- Processa notificações assíncronas

**Princípio**: Separação de responsabilidades - diferentes entry points para diferentes propósitos.

### 2. Camada de Apresentação (`api/`)

**Responsabilidade**: Receber requisições HTTP, validação de entrada, serialização de saída.

#### `api/routes.go`
- Define todas as rotas da API
- Registra handlers com dependências injetadas
- Configura middlewares globais

**Rotas**:
- `POST /person` - Criar pessoa
- `GET /person` - Listar pessoas
- `GET /person/:id` - Buscar pessoa por ID
- `PUT /person/:id` - Atualizar pessoa
- `DELETE /person/:id` - Deletar pessoa

#### `api/handlers/person.controller.go`
- **Controller Pattern**: Processa requisições HTTP
- Validação de entrada (BindJSON)
- Tratamento de erros HTTP
- Delegação para camada de aplicação (Repository)

**Características**:
- Dependency Injection via construtor
- Error handling idiomático Go
- Respostas JSON padronizadas

#### `api/handlers/middiwarePerson.go`
- Middlewares para requisições HTTP
- Autenticação/autorização (se necessário)
- Logging de requisições
- Validação de headers

### 3. Camada de Domínio (`internal/domain/`)

**Responsabilidade**: Entidades de negócio e regras de domínio puras (sem dependências externas).

#### `internal/domain/person.go`
```go
type Person struct {
    Id         int     `json:"id" gorm:"primary_key"`
    First_name string  `json:"firstName"`
    Last_name  string  `json:"lastName"`
    Birth_date string  `json:"birthdate"`
    Address    string  `json:"address"`
    Email      string  `json:"email"`
    Phone      []Phone `gorm:"foreignKey:person_id"`
}
```

**Características**:
- Structs puros (sem dependências de frameworks)
- Tags para serialização JSON e GORM
- Relacionamentos definidos

#### `internal/domain/phones.go`
- Entidade Phone relacionada a Person
- Value Object ou Entidade conforme regras de negócio

#### `internal/domain/notification.go`
- Entidade de domínio para notificações
- Regras de negócio para envio de notificações

**Princípios DDD**:
- Entidades com identidade única
- Value Objects imutáveis
- Agregados bem definidos

### 4. Camada de Aplicação (`internal/repository/`)

**Responsabilidade**: Abstração de acesso a dados, implementação do Repository Pattern.

#### `internal/respository/person_repository.go`
- **Repository Pattern**: Abstrai acesso ao banco de dados
- Métodos CRUD para Person
- Interface para desacoplamento (se implementada)

**Operações**:
- `CreatePerson()` - Criar pessoa
- `GetPerson()` - Buscar pessoa
- `GetPersonById()` - Buscar por ID
- `UpdatePerson()` - Atualizar pessoa
- `DeletePerson()` - Deletar pessoa

**Vantagens**:
- Testabilidade (mock de repositório)
- Troca de implementação de persistência
- Isolamento de lógica de acesso a dados

### 5. Camada de Infraestrutura

#### 5.1 Banco de Dados (`config/database.go`)

**Responsabilidade**: Configuração e conexão com banco de dados PostgreSQL.

**Tecnologia**: GORM (Go ORM)

**Características**:
- Migrations automáticas
- Connection pooling
- Transações
- Relacionamentos (Foreign Keys)

#### 5.2 Mensageria (`pkg/rabbbitmq/rabbitmq_config.go`)

**Responsabilidade**: Integração com RabbitMQ para comunicação assíncrona.

**Funcionalidades**:
- Conexão com RabbitMQ
- Publicação de mensagens
- Consumo de mensagens
- Gerenciamento de filas e exchanges

#### 5.3 Configuração (`pkg/env/setup.go`)

**Responsabilidade**: Carregamento de variáveis de ambiente.

**Características**:
- Validação de variáveis obrigatórias
- Valores padrão
- Type safety

#### 5.4 HTTP Server (`config/http.go`)

**Responsabilidade**: Configuração do servidor Gin.

**Função `StartServer()`**:
- Inicializa conexão com banco
- Configura router Gin
- Registra rotas
- Inicia servidor HTTP

## Fluxo de Dados

### Fluxo de Requisição HTTP

```
HTTP Request
    │
    ▼
[Gin Router] ──► [Routes] ──► [Handler/Controller]
    │                                    │
    │                                    ▼
    │                            [Repository]
    │                                    │
    │                                    ▼
    └────────────────────────────────► [GORM/Database]
```

### Fluxo de Processamento de Mensagens

```
[RabbitMQ Queue]
    │
    ▼
[Message Processor] ──► [Domain Logic]
    │                          │
    │                          ▼
    └─────────────────────► [Repository]
                                │
                                ▼
                           [Database]
```

## Padrões de Design Utilizados

1. **Clean Architecture**: Separação em camadas concêntricas
2. **Hexagonal Architecture**: Ports & Adapters
3. **Repository Pattern**: Abstração de acesso a dados
4. **Dependency Injection**: Injeção via construtores
5. **Factory Pattern**: Criação de controllers (`NewPersonController`)
6. **Controller Pattern**: Handlers HTTP organizados
7. **Middleware Pattern**: Interceptação de requisições

## Boas Práticas Go Implementadas

### ✅ Implementadas

- **Estrutura de diretórios padrão Go**: `cmd/`, `internal/`, `pkg/`
- **Separação de responsabilidades**: Camadas bem definidas
- **Dependency Injection**: Via construtores
- **Error handling idiomático**: Retorno de erros explícito
- **Interfaces para desacoplamento**: Repository abstraído
- **Naming conventions**: Seguindo padrões Go
- **Package organization**: Código interno vs exportável

### 🔄 Recomendações de Melhoria

1. **Interfaces explícitas**: Definir interfaces para Repository
2. **Context propagation**: Usar `context.Context` para cancelamento
3. **Structured logging**: Implementar logging estruturado (zap, logrus)
4. **Validação robusta**: Usar `validator` ou `go-playground/validator`
5. **Error wrapping**: Usar `fmt.Errorf` com `%w` para error wrapping
6. **Testes unitários**: Adicionar testes com `testing` package
7. **Documentação**: Adicionar godoc comments
8. **Graceful shutdown**: Implementar shutdown graceful
9. **Health checks**: Endpoint `/health` para monitoramento
10. **Métricas**: Integrar Prometheus para métricas

## Decisões Arquiteturais Importantes

### 1. Clean Architecture
**Decisão**: Seguir Clean Architecture com separação em camadas
**Razão**: 
- Testabilidade (camadas isoladas)
- Manutenibilidade (baixo acoplamento)
- Flexibilidade (troca de implementações)

### 2. Separação `cmd/api` e `cmd/processor`
**Decisão**: Dois entry points distintos
**Razão**: 
- Separação de responsabilidades
- Escalabilidade independente
- Deploy independente

### 3. Uso de `internal/` e `pkg/`
**Decisão**: Separar código interno de código exportável
**Razão**:
- `internal/`: Código específico da aplicação (não importável)
- `pkg/`: Código reutilizável (importável por outros projetos)

### 4. GORM para ORM
**Decisão**: Usar GORM ao invés de SQL puro
**Razão**:
- Produtividade
- Migrations automáticas
- Type safety

### 5. Gin Framework
**Decisão**: Usar Gin ao invés de `net/http` puro
**Razão**:
- Performance (menos overhead)
- Middleware ecosystem
- JSON binding facilitado

## Dependências Principais

- **Gin**: Framework web HTTP
- **GORM**: ORM para Go
- **PostgreSQL Driver**: Driver para PostgreSQL
- **RabbitMQ Client**: Cliente para RabbitMQ
- **godotenv**: Carregamento de variáveis de ambiente

## Escalabilidade

O microsserviço foi projetado para escalar:

- **Stateless**: Sem estado compartilhado
- **Horizontal scaling**: Múltiplas instâncias
- **Connection pooling**: GORM gerencia pool de conexões
- **Async processing**: Processador de mensagens separado
- **Containerizado**: Pronto para Kubernetes/Docker Swarm

## Observabilidade

**Recomendações**:
- **Logging**: Implementar structured logging (zap)
- **Métricas**: Prometheus + Grafana
- **Tracing**: OpenTelemetry para distributed tracing
- **Health checks**: `/health` e `/ready` endpoints
- **Error tracking**: Sentry ou similar

## Segurança

**Considerações**:
- **Autenticação**: JWT ou OAuth2
- **Autorização**: RBAC (Role-Based Access Control)
- **Validação**: Validar todas as entradas
- **SQL Injection**: GORM previne, mas validar queries customizadas
- **Rate Limiting**: Implementar rate limiting
- **HTTPS**: Usar TLS em produção
- **Secrets**: Gerenciar secrets adequadamente (Vault, etc)

## Testabilidade

**Estrutura recomendada**:
```
internal/
├── domain/
│   └── person_test.go      # Testes de domínio
└── respository/
    └── person_repository_test.go  # Testes de repositório

api/
└── handlers/
    └── person.controller_test.go  # Testes de handlers
```

**Ferramentas**:
- `testing` package (padrão Go)
- `testify` para assertions
- `gomock` para mocks
- `httptest` para testes HTTP

## Performance

**Otimizações**:
- Connection pooling do GORM
- Prepared statements
- Índices no banco de dados
- Cache quando apropriado (Redis)
- Compressão de respostas HTTP (gzip)
