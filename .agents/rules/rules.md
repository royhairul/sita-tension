# Clean Architecture Rules

## 🎯 Purpose

This document defines the standard architecture rules for all projects to ensure:

* maintainability
* scalability
* testability
* loose coupling
* technology independence
* consistency across projects

All developers must follow these rules.

---

# 🧠 Core Principles

## 1. Dependency Rule (MANDATORY)

Dependencies must always point inward.

```
Outer Layer → Inner Layer
```

### Allowed

```
Delivery → Use Case → Domain
Infrastructure → Domain Interface
Agent → Use Case → Domain
```

### Forbidden

```
Domain → Use Case
Domain → Infrastructure
Use Case → Delivery
Use Case → Framework
```

The domain must not depend on any external implementation.

---

## 2. Separation of Concerns

Each layer must have a clear and distinct responsibility.

| Layer          | Responsibility               |
| -------------- | ---------------------------- |
| Domain         | Business rules and entities  |
| Use Case       | Application flow             |
| Delivery       | Input/output handling        |
| Infrastructure | External systems             |
| Agent          | Automation and orchestration |

Responsibilities must not overlap.

---

## 3. Framework Independence

Business logic must not depend on:

* database systems
* web frameworks
* message brokers
* external API SDKs
* UI frameworks

Frameworks are implementation details.

---

# 🧱 Architecture Layers

---

## 📦 Domain Layer (Core)

### Responsibility

* entities
* value objects
* domain rules
* business logic
* repository interfaces
* domain services

### Rules

✅ Pure business logic only
✅ No framework imports
✅ No database logic
✅ No HTTP logic
✅ No environment configuration

### Forbidden

```
ORM libraries (GORM, Prisma, Sequelize, etc.)
HTTP frameworks
Redis clients
External SDKs
```

The domain must be portable and independent.

---

## ⚙️ Use Case / Application Layer

### Responsibility

* application flow
* orchestration
* transaction boundary
* validation flow
* calling domain logic
* depending on repository interfaces

### Rules

✅ implement business processes
✅ use repository interfaces
✅ no framework logic
✅ no direct database access

### Forbidden

```
SQL queries
ORM usage
HTTP handling
```

---

## 🌐 Delivery Layer (Interface Layer)

Examples:

* REST controllers
* GraphQL resolvers
* gRPC handlers
* CLI handlers
* Webhook handlers

### Responsibility

* parse requests
* call use cases
* format responses

### Rules

✅ no business logic
✅ no database logic
✅ must remain thin

---

## 🗄 Infrastructure Layer

Examples:

* database implementations
* external API clients
* message queues
* caching systems
* file storage
* email services

### Responsibility

* implement interfaces defined by domain or use case

### Rules

✅ replaceable implementations
✅ no business logic
✅ isolated from domain rules

---

## 🤖 Agent Layer (Worker / Scheduler / Integration)

Agents are alternative entry points besides controllers.

Examples:

* cron jobs
* queue workers
* data synchronization services
* realtime listeners
* automation processes

### Rules

✅ only trigger use cases
✅ no complex business logic
✅ stateless design
✅ idempotent execution
✅ orchestration only

### Forbidden

```
business decision logic
direct database access
framework coupling
```

---

# 🔗 Communication Rules

---

## 1. Cross-Layer Communication

Always use interfaces.

```
Use Case → Repository Interface → Infrastructure Implementation
```

Direct dependency on implementations is not allowed.

---

## 2. Shared Models

Models must not be shared directly across layers.

Use:

* DTOs
* mappers
* transformers

---

## 3. No Circular Dependencies

Circular dependencies are strictly forbidden.

---

# 📁 Recommended Folder Structure

```
internal/

  domain/
    entity/
    value_object/
    repository/
    service/

  usecase/
    create_user_usecase.go

  delivery/
    http/
    grpc/
    cli/

  agent/
    cron/
    worker/

  infrastructure/
    database/
    external/
    cache/
```

---

# 💻 Coding Rules

---

## 1. Dependency Injection Required

Dependencies must not be instantiated directly.

### Forbidden

```
new Database()
new Repository()
```

### Required

```
constructor injection
```

---

## 2. Business Logic Placement

| Logic Type       | Location       |
| ---------------- | -------------- |
| business rules   | domain         |
| workflow         | use case       |
| database queries | infrastructure |
| request parsing  | delivery       |

---

## 3. Error Handling

* explicit error handling required
* no silent failures
* meaningful error messages
* consistent error types

---

## 4. Stateless Design

Components should be stateless whenever possible.

State must be stored in:

* database
* external storage

---

## 5. Idempotency

Critical operations must be idempotent:

* payments
* synchronization
* background jobs
* order processing

---

# 🧪 Testing Rules

---

## Unit Test Priority

| Layer          | Priority |
| -------------- | -------- |
| Domain         | highest  |
| Use Case       | high     |
| Delivery       | medium   |
| Infrastructure | optional |

---

## Mocking Rules

Mocks are allowed only for:

```
repository interfaces
external services
```

---

# 🚫 Anti-Patterns (Forbidden)

* fat controllers
* business logic in delivery layer
* domain depending on database
* direct ORM usage in use case layer
* global state
* tight coupling
* shared mutable state
* circular dependencies

---

# ⭐ Design Goals

All projects must:

* allow database replacement easily
* allow framework replacement easily
* be testable without infrastructure
* support scalable architecture
* follow predictable structure

---

# 📌 Golden Rule

When unsure:

```
Business logic → Domain
Process flow → Use Case
External systems → Infrastructure
Request/Response → Delivery
Automation → Agent
```
