# Projeto API em Golang com Gin

Instalar o Gin

```bash
go get -u github.com/gin-gonic/gin
```

Execute o projeto com:

```bash
go run main.go
```

A API estará disponível em `http://localhost:8080`

1. Criar uma estrutura organizada
Para projetos maiores, organize os arquivos assim:


my-gin-app/
│── main.go
│── go.mod
│── go.sum
├── controllers/
│   ├── user_controller.go
├── models/
│   ├── user.go
├── routes/
│   ├── routes.go
├── config/
│   ├── database.go
controllers/ → Lógica dos endpoints
models/ → Definição de structs
routes/ → Definição das rotas
config/ → Configurações como conexão ao banco
