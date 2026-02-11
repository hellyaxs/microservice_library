# 📐 Documentação Estratégica DDD - Livraria Digital

## Visão Geral

Este documento define a estratégia de **Domain-Driven Design (DDD)** para a aplicação de Livraria Digital baseada em microsserviços. Ele estabelece os **Bounded Contexts**, **Domínios**, **Responsabilidades** e **Eventos de Domínio** para cada microsserviço do ecossistema.

---

## 🎯 Bounded Contexts e Domínios

### Mapa de Contextos

```
┌─────────────────────────────────────────────────────────────┐
│                    Livraria Digital                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Usuários   │  │   Pagamentos │  │ Notificações │     │
│  │   (Java)     │  │   (Python)   │  │    (Go)      │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│  ┌──────▼─────────────────▼─────────────────▼───────┐     │
│  │            API Gateway (NestJS)                  │     │
│  │         (Orquestração/Coordenação)                │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │    Livros    │  │  Empréstimos │                       │
│  │   (NestJS)   │  │   (NestJS)   │                       │
│  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. 🧑 Bounded Context: Gestão de Usuários (Person Service)

**Microsserviço**: `api-java-person`  
**Linguagem**: Java  
**Framework**: Spring Boot (WebFlux + R2DBC)

### Domínio

**Subdomínio Core**: Gestão de Pessoas e Usuários

### Responsabilidades

1. **Gestão de Identidade de Usuários**
   - Cadastro de pessoas físicas
   - Atualização de dados pessoais
   - Exclusão de contas
   - Validação de dados pessoais

2. **Gestão de Informações de Contato**
   - Cadastro e gestão de telefones
   - Validação de formatos de telefone
   - Tipos de telefone (HOME, MOBILE, WORK)

3. **Publicação de Eventos de Domínio**
   - `PersonCreated` - Quando uma pessoa é criada
   - `PersonUpdated` - Quando uma pessoa é atualizada
   - `PersonDeleted` - Quando uma pessoa é deletada

### Agregados Principais

#### Agregado: Person (Pessoa)

**Raiz do Agregado**: `Person`

**Entidades**:
- `Person` (Raiz)
  - ID (UUID)
  - Nome (firstName, lastName)
  - Data de nascimento (birthdate)
  - Endereço (address)
  - Email
  - Cargo (cargo)
  
- `Phone` (Entidade dentro do agregado)
  - ID (UUID)
  - DDD
  - Número
  - Tipo (TypePhone enum: HOME, MOBILE, WORK)
  - Referência para Person (personId)

**Regras de Negócio**:
- Uma pessoa deve ter pelo menos um telefone
- Email deve ser único no sistema
- Data de nascimento deve ser válida
- DDD e número devem seguir formato brasileiro

**Invariantes**:
- Person não pode ser criada sem telefone
- Email deve ser válido e único
- Telefone deve ter DDD válido (2 dígitos)

### Eventos de Domínio Publicados

```java
// Eventos publicados via RabbitMQ
- PersonCreatedEvent {
    personId: UUID
    firstName: String
    lastName: String
    email: String
    createdAt: Timestamp
}

- PersonUpdatedEvent {
    personId: UUID
    changes: Map<String, Object>
    updatedAt: Timestamp
}

- PersonDeletedEvent {
    personId: UUID
    deletedAt: Timestamp
}
```

### Integrações

**Publica Eventos Para**:
- API Gateway (para roteamento)
- Serviço de Notificações (para notificar criação/atualização)
- Serviço de Pagamentos (para associar pessoa a pagamentos)

**Consome Eventos De**:
- Nenhum (é fonte de verdade para dados de pessoas)

**APIs Expostas**:
- REST API (`/api/v1/Person`)
- gRPC API (para comunicação entre serviços)

---

## 2. 💳 Bounded Context: Pagamentos (Payment Service)

**Microsserviço**: `api-flask-pagamentos`  
**Linguagem**: Python  
**Framework**: Flask

### Domínio

**Subdomínio Core**: Processamento de Pagamentos e Transações Financeiras

### Responsabilidades

1. **Gestão de Transações de Pagamento**
   - Processamento de pagamentos
   - Validação de métodos de pagamento
   - Autorização de transações
   - Confirmação de pagamentos

2. **Gestão de Faturas**
   - Criação de faturas
   - Acompanhamento de status de pagamento
   - Cálculo de valores totais
   - Gestão de valores pagos vs valores pendentes

3. **Integração com Gateways de Pagamento**
   - Comunicação com provedores externos
   - Processamento de webhooks
   - Reconciliação de pagamentos

4. **Consumo de Eventos**
   - Consome eventos de criação/atualização de pessoas
   - Associa pagamentos a pessoas

### Agregados Principais

#### Agregado: Payment (Pagamento)

**Raiz do Agregado**: `Payment`

**Entidades**:
- `Payment` (Raiz)
  - ID (UUID)
  - Transacao (referência)
  - Fatura (referência)
  - Status (PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED)
  - CreatedAt, UpdatedAt

- `Transacao` (Entidade dentro do agregado)
  - ID (UUID)
  - Valor (Dinheiro - Value Object)
  - Status (PENDING, APPROVED, REJECTED)
  - Método de pagamento
  - Data da transação

- `Fatura` (Entidade dentro do agregado)
  - ID (UUID)
  - Valor total (Dinheiro - Value Object)
  - Valor pago (Dinheiro - Value Object)
  - Status (OPEN, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED)
  - Data de vencimento

**Value Objects**:
- `Dinheiro`
  - Valor (float)
  - Moeda (String: "BRL", "USD", etc.)
  - Imutável

**Regras de Negócio**:
- Valor pago não pode exceder valor total da fatura
- Transação deve ter valor positivo
- Fatura não pode ser paga se já estiver cancelada
- Moeda deve ser válida (ISO 4217)
- Valor da transação deve corresponder ao valor da fatura

**Invariantes**:
- `fatura.valor_pago <= fatura.valor_total`
- `transacao.valor > 0`
- `payment.status` deve seguir fluxo válido de estados

### Eventos de Domínio Publicados

```python
# Eventos publicados via RabbitMQ
- PaymentCreatedEvent {
    paymentId: UUID
    personId: UUID
    amount: Decimal
    currency: String
    createdAt: Timestamp
}

- PaymentProcessedEvent {
    paymentId: UUID
    transactionId: UUID
    status: String
    processedAt: Timestamp
}

- PaymentFailedEvent {
    paymentId: UUID
    reason: String
    failedAt: Timestamp
}

- InvoicePaidEvent {
    invoiceId: UUID
    paymentId: UUID
    totalPaid: Decimal
    paidAt: Timestamp
}
```

### Integrações

**Consome Eventos De**:
- Person Service (`person_created`, `person_updated`)
- API Gateway (comandos de criação de pagamento)

**Publica Eventos Para**:
- Serviço de Notificações (para notificar status de pagamento)
- API Gateway (para atualização de status)

**APIs Expostas**:
- REST API (`/api/payment`, `/api/invoice`)

**Integrações Externas**:
- Gateways de pagamento (Stripe, PayPal, etc.)
- Processadores de cartão de crédito

---

## 3. 📧 Bounded Context: Notificações (Notification Service)

**Microsserviço**: `api-golang-notificacoes`  
**Linguagem**: Go  
**Framework**: Gin

### Domínio

**Subdomínio Supporting**: Sistema de Notificações e Comunicação

### Responsabilidades

1. **Gestão de Notificações**
   - Criação de notificações
   - Envio de notificações por múltiplos canais
   - Rastreamento de status de entrega
   - Histórico de notificações

2. **Processamento Assíncrono de Eventos**
   - Consumo de eventos de outros serviços
   - Transformação de eventos em notificações
   - Agendamento de notificações

3. **Múltiplos Canais de Comunicação**
   - Email
   - SMS
   - Push notifications
   - In-app notifications

4. **Templates e Personalização**
   - Templates de notificações
   - Personalização por tipo de evento
   - Internacionalização (i18n)

### Agregados Principais

#### Agregado: Notification (Notificação)

**Raiz do Agregado**: `Notification`

**Entidades**:
- `Notification` (Raiz)
  - ID (UUID)
  - PersonId (referência externa)
  - Tipo (EMAIL, SMS, PUSH, IN_APP)
  - Título (title)
  - Conteúdo (content)
  - Status (PENDING, SENT, DELIVERED, FAILED)
  - Canal (channel)
  - CreatedAt, SentAt, DeliveredAt

**Value Objects**:
- `NotificationContent`
  - Título
  - Corpo da mensagem
  - Template usado
  - Variáveis substituídas

**Regras de Negócio**:
- Notificação deve ter destinatário válido
- Conteúdo não pode estar vazio
- Tipo de canal deve ser válido
- Status deve seguir fluxo válido (PENDING → SENT → DELIVERED)
- Tentativas de reenvio limitadas (máximo 3)

**Invariantes**:
- `notification.personId` deve existir no sistema de pessoas
- `notification.content` não pode ser vazio
- `notification.status` deve seguir transições válidas

### Eventos de Domínio Consumidos

```go
// Eventos consumidos via RabbitMQ
- PersonCreatedEvent → Cria notificação de boas-vindas
- PersonUpdatedEvent → Cria notificação de atualização de perfil
- PaymentProcessedEvent → Cria notificação de confirmação de pagamento
- PaymentFailedEvent → Cria notificação de falha no pagamento
- InvoicePaidEvent → Cria notificação de fatura paga
```

### Eventos de Domínio Publicados

```go
// Eventos publicados via RabbitMQ
- NotificationSentEvent {
    notificationId: UUID
    personId: UUID
    channel: String
    sentAt: Timestamp
}

- NotificationDeliveredEvent {
    notificationId: UUID
    personId: UUID
    channel: String
    deliveredAt: Timestamp
}

- NotificationFailedEvent {
    notificationId: UUID
    personId: UUID
    channel: String
    reason: String
    failedAt: Timestamp
}
```

### Integrações

**Consome Eventos De**:
- Person Service (`person_created`, `person_updated`, `person_deleted`)
- Payment Service (`payment_processed`, `payment_failed`, `invoice_paid`)
- API Gateway (comandos de envio de notificação)

**Publica Eventos Para**:
- API Gateway (para atualização de status)
- Outros serviços que precisam saber sobre entregas

**APIs Expostas**:
- REST API (`/api/notifications`)
- Endpoint para webhooks de provedores externos

**Integrações Externas**:
- Serviços de email (SendGrid, AWS SES)
- Serviços de SMS (Twilio, AWS SNS)
- Serviços de push (Firebase Cloud Messaging, OneSignal)

---

## 4. 🚪 Bounded Context: API Gateway

**Microsserviço**: `api-nestjs-gateway`  
**Linguagem**: TypeScript  
**Framework**: NestJS

### Domínio

**Subdomínio Generic**: Orquestração e Coordenação de Serviços

### Responsabilidades

1. **Roteamento e Agregação**
   - Roteamento de requisições para serviços apropriados
   - Agregação de respostas de múltiplos serviços
   - Transformação de dados entre serviços

2. **Orquestração de Fluxos**
   - Coordenação de operações que envolvem múltiplos serviços
   - Gerenciamento de transações distribuídas (Saga Pattern)
   - Compensação de operações em caso de falha

3. **Publicação de Eventos**
   - Publicação de eventos de domínio para RabbitMQ
   - Roteamento de eventos para filas apropriadas
   - Gerenciamento de exchanges e bindings

4. **Cross-Cutting Concerns**
   - Autenticação e autorização
   - Rate limiting
   - Logging e monitoramento
   - Validação de entrada
   - Transformação de erros

### Módulos de Domínio

#### Módulo: Usuários
- Roteamento de operações de usuários
- Publicação de eventos relacionados a pessoas

#### Módulo: Pagamentos
- Roteamento de operações de pagamento
- Orquestração de fluxos de pagamento

#### Módulo: Livros
- Roteamento de operações de livros
- Gestão de catálogo

#### Módulo: Empréstimos
- Roteamento de operações de empréstimos
- Orquestração de fluxos de empréstimo

### Eventos de Domínio Publicados

```typescript
// Eventos publicados via RabbitMQ
- PersonCreatedEvent → Para fila 'person_created'
- PersonUpdatedEvent → Para fila 'person_updated'
- PersonDeletedEvent → Para fila 'person_deleted'
- PaymentRequestedEvent → Para fila 'payment_requested'
- LoanRequestedEvent → Para fila 'loan_requested'
```

### Integrações

**Consome De**:
- Frontend (requisições HTTP)
- Outros gateways (se houver)

**Publica Para**:
- Todos os serviços backend via RabbitMQ
- Frontend (respostas HTTP)

**APIs Expostas**:
- REST API unificada (`/usuarios`, `/pagamentos`, `/livros`, `/emprestimos`)

---

## 5. 📚 Bounded Context: Livros (Books Service)

**Microsserviço**: Módulo dentro de `api-nestjs-gateway`  
**Linguagem**: TypeScript  
**Framework**: NestJS

### Domínio

**Subdomínio Core**: Gestão de Catálogo de Livros

### Responsabilidades

1. **Gestão de Catálogo**
   - Cadastro de livros
   - Atualização de informações
   - Busca e filtragem
   - Gestão de categorias

2. **Gestão de Estoque**
   - Controle de quantidade disponível
   - Reservas de livros
   - Atualização de estoque após empréstimos

3. **Publicação de Eventos**
   - `BookCreated` - Quando um livro é cadastrado
   - `BookUpdated` - Quando informações são atualizadas
   - `StockUpdated` - Quando estoque é alterado

### Agregados Principais

#### Agregado: Book (Livro)

**Raiz do Agregado**: `Book`

**Entidades**:
- `Book` (Raiz)
  - ID (UUID)
  - Título (title)
  - Autor (author)
  - ISBN (isbn)
  - Preço (price)
  - Estoque (stock)
  - Categoria (category)
  - CreatedAt, UpdatedAt

**Regras de Negócio**:
- ISBN deve ser único
- Preço deve ser positivo
- Estoque não pode ser negativo
- Título e autor são obrigatórios

**Invariantes**:
- `book.stock >= 0`
- `book.price > 0`
- `book.isbn` deve ser único e válido

---

## 6. 📖 Bounded Context: Empréstimos (Loans Service)

**Microsserviço**: Módulo dentro de `api-nestjs-gateway`  
**Linguagem**: TypeScript  
**Framework**: NestJS

### Domínio

**Subdomínio Core**: Gestão de Empréstimos de Livros

### Responsabilidades

1. **Gestão de Empréstimos**
   - Criação de empréstimos
   - Controle de devoluções
   - Renovações
   - Histórico de empréstimos

2. **Regras de Negócio**
   - Validação de disponibilidade de livros
   - Cálculo de multas por atraso
   - Limite de empréstimos por usuário
   - Prazo de devolução

3. **Publicação de Eventos**
   - `LoanCreated` - Quando empréstimo é criado
   - `LoanReturned` - Quando livro é devolvido
   - `LoanOverdue` - Quando empréstimo está atrasado

### Agregados Principais

#### Agregado: Loan (Empréstimo)

**Raiz do Agregado**: `Loan`

**Entidades**:
- `Loan` (Raiz)
  - ID (UUID)
  - PersonId (referência externa)
  - BookId (referência externa)
  - Data de empréstimo (loanDate)
  - Data de devolução esperada (dueDate)
  - Data de devolução real (returnDate)
  - Status (ACTIVE, RETURNED, OVERDUE, CANCELLED)
  - Multa (fine) - calculada se atrasado

**Regras de Negócio**:
- Usuário não pode ter mais de 3 empréstimos ativos simultaneamente
- Livro deve estar disponível no estoque
- Prazo padrão: 14 dias
- Multa: R$ 1,00 por dia de atraso
- Empréstimo não pode ser criado se usuário tiver multas pendentes

**Invariantes**:
- `loan.dueDate > loan.loanDate`
- `loan.status` deve seguir fluxo válido
- `loan.bookId` deve existir e estar disponível
- `loan.personId` deve existir e estar ativo

---

## 7. 🖥️ Frontend (Library Frontend)

**Aplicação**: `library-frontend`  
**Linguagem**: TypeScript  
**Framework**: Next.js 15

### Domínio

**Subdomínio Generic**: Interface do Usuário

### Responsabilidades

1. **Apresentação de Dados**
   - Renderização de interfaces
   - Formulários de entrada
   - Visualização de informações

2. **Interação com Usuário**
   - Coleta de dados do usuário
   - Validação de entrada no cliente
   - Feedback visual

3. **Comunicação com Backend**
   - Requisições HTTP para API Gateway
   - Tratamento de respostas
   - Gerenciamento de estado

**Nota**: O frontend não possui domínio próprio, apenas consome APIs dos serviços backend.

---

## 🔄 Context Mapping

### Relacionamentos Entre Contextos

```
┌─────────────────────────────────────────────────────────────┐
│                    Context Mapping                            │
└─────────────────────────────────────────────────────────────┘

Person Service (Upstream)
    │
    │ Publishes: PersonCreated, PersonUpdated, PersonDeleted
    │
    ├──► Payment Service (Downstream)
    │    └── Consumes: PersonCreated, PersonUpdated
    │
    ├──► Notification Service (Downstream)
    │    └── Consumes: PersonCreated, PersonUpdated, PersonDeleted
    │
    └──► API Gateway (Partnership)
         └── Routes requests, publishes events

Payment Service (Upstream)
    │
    │ Publishes: PaymentProcessed, PaymentFailed, InvoicePaid
    │
    ├──► Notification Service (Downstream)
    │    └── Consumes: PaymentProcessed, PaymentFailed, InvoicePaid
    │
    └──► API Gateway (Partnership)
         └── Routes requests, publishes events

Notification Service (Downstream)
    │
    │ Consumes from: Person Service, Payment Service
    │ Publishes: NotificationSent, NotificationDelivered, NotificationFailed
    │
    └──► API Gateway (Partnership)
         └── Routes requests

API Gateway (Conformist)
    │
    │ Orchestrates all services
    │ Routes requests
    │ Publishes events
    │
    └──► All Services (Partnership)
```

### Padrões de Integração

1. **Publish-Subscribe (Pub/Sub)**
   - RabbitMQ como message broker
   - Eventos de domínio como mensagens
   - Desacoplamento entre serviços

2. **API Gateway Pattern**
   - Ponto único de entrada
   - Agregação de respostas
   - Transformação de protocolos

3. **Saga Pattern** (para transações distribuídas)
   - Orquestração via API Gateway
   - Compensação em caso de falha
   - Eventos para coordenação

---

## 📋 Matriz de Responsabilidades

| Responsabilidade | Person Service | Payment Service | Notification Service | API Gateway | Books Service | Loans Service |
|-----------------|---------------|-----------------|---------------------|-------------|---------------|---------------|
| Gestão de Usuários | ✅ Proprietário | ❌ | ❌ | ⚠️ Roteia | ❌ | ⚠️ Referencia |
| Gestão de Pagamentos | ❌ | ✅ Proprietário | ❌ | ⚠️ Roteia | ❌ | ⚠️ Consome |
| Envio de Notificações | ❌ | ❌ | ✅ Proprietário | ⚠️ Roteia | ❌ | ❌ |
| Gestão de Livros | ❌ | ❌ | ❌ | ⚠️ Roteia | ✅ Proprietário | ⚠️ Referencia |
| Gestão de Empréstimos | ⚠️ Referencia | ⚠️ Consome | ⚠️ Consome | ⚠️ Roteia | ⚠️ Referencia | ✅ Proprietário |
| Orquestração | ❌ | ❌ | ❌ | ✅ Proprietário | ❌ | ❌ |

**Legenda**:
- ✅ Proprietário: Responsabilidade principal
- ⚠️ Participa: Participa mas não é proprietário
- ❌ Não participa

---

## 🎯 Princípios de Design

### 1. Single Responsibility Principle (SRP)
Cada microsserviço possui uma responsabilidade única e bem definida.

### 2. Database per Service
Cada serviço possui seu próprio banco de dados, garantindo independência.

### 3. API Gateway Pattern
Ponto único de entrada para todos os clientes externos.

### 4. Event-Driven Architecture
Comunicação assíncrona via eventos de domínio.

### 5. Bounded Context Isolation
Cada contexto mantém seu próprio modelo de domínio.

### 6. Domain Events
Eventos de domínio como mecanismo de integração entre contextos.

---

## 📊 Eventos de Domínio - Catálogo Completo

### Eventos do Person Service
- `PersonCreated`
- `PersonUpdated`
- `PersonDeleted`

### Eventos do Payment Service
- `PaymentCreated`
- `PaymentProcessed`
- `PaymentFailed`
- `InvoiceCreated`
- `InvoicePaid`
- `InvoiceOverdue`

### Eventos do Notification Service
- `NotificationSent`
- `NotificationDelivered`
- `NotificationFailed`

### Eventos do Books Service
- `BookCreated`
- `BookUpdated`
- `StockUpdated`
- `BookReserved`

### Eventos do Loans Service
- `LoanCreated`
- `LoanReturned`
- `LoanRenewed`
- `LoanOverdue`

---

## 🔐 Regras de Negócio Críticas

### Person Service
1. Email deve ser único no sistema
2. Pessoa deve ter pelo menos um telefone
3. Data de nascimento deve ser válida

### Payment Service
1. Valor pago não pode exceder valor total
2. Transação deve ter valor positivo
3. Moeda deve ser válida (ISO 4217)

### Notification Service
1. Notificação deve ter destinatário válido
2. Máximo de 3 tentativas de reenvio
3. Status deve seguir fluxo válido

### Loans Service
1. Máximo de 3 empréstimos ativos por usuário
2. Livro deve estar disponível
3. Multa de R$ 1,00 por dia de atraso
4. Não pode emprestar se houver multas pendentes

### Books Service
1. ISBN deve ser único
2. Estoque não pode ser negativo
3. Preço deve ser positivo

---

## 📈 Evolução e Expansão

### Possíveis Expansões Futuras

1. **Serviço de Autenticação**
   - Separação de autenticação/autorização
   - OAuth2/JWT
   - Gestão de sessões

2. **Serviço de Recomendações**
   - Algoritmos de recomendação
   - Machine Learning
   - Análise de comportamento

3. **Serviço de Avaliações**
   - Reviews de livros
   - Ratings
   - Comentários

4. **Serviço de Busca**
   - Elasticsearch
   - Busca full-text
   - Filtros avançados

---

## 📝 Glossário de Termos do Domínio

- **Person**: Pessoa física cadastrada no sistema
- **Payment**: Pagamento realizado por uma pessoa
- **Transaction**: Transação financeira individual
- **Invoice**: Fatura gerada para pagamento
- **Notification**: Notificação enviada a uma pessoa
- **Book**: Livro disponível no catálogo
- **Loan**: Empréstimo de livro para uma pessoa
- **Fine**: Multa aplicada por atraso na devolução
- **Stock**: Quantidade disponível de um livro

---

## 🎓 Referências

- Domain-Driven Design (Eric Evans)
- Implementing Domain-Driven Design (Vaughn Vernon)
- Microservices Patterns (Chris Richardson)
- Building Microservices (Sam Newman)

---

**Última Atualização**: 2026-02-10  
**Versão**: 1.0.0
