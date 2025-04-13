package rabbbitmq

import (
    "log"
    "github.com/streadway/amqp"
)

type RabbitMQ struct {
	Conn *amqp.Connection
	Ch   *amqp.Channel
	Q    amqp.Queue
}

func failOnError(err error, msg string) {
    if err != nil {
        log.Fatalf("%s: %s", msg, err)
    }
}

func NewConection(queuename string) (*RabbitMQ, error) {
	rq := &RabbitMQ{}

	// Conectar ao RabbitMQ
	var err error
	rq.Conn, err = amqp.Dial("amqp://apicconn:root@localhost:5672/")
	failOnError(err, "Falha ao conectar ao RabbitMQ")

	// Criar um canal
	rq.Ch, err = rq.Conn.Channel()
	failOnError(err, "Falha ao abrir um canal")

	// Declarar uma fila
	rq.Q, err = rq.Ch.QueueDeclare(
		queuename, // Nome da fila
		false,   // Durável
		false,   // Exclusiva
		false,   // Auto-exclusiva
		false,   // Sem espera
		nil,     // Argumentos adicionais
	)
	failOnError(err, "Falha ao declarar a fila")

	return rq, nil
}


func (rq *RabbitMQ) Connect() {
    // Conectar ao RabbitMQ
	if(rq.Conn == nil) {
		var err error
		rq.Conn, err = amqp.Dial("amqp://apicconn:password@localhost:5672/")
		failOnError(err, "Falha ao conectar ao RabbitMQ")
	}

}

func (rq *RabbitMQ) Publishing(conn *amqp.Connection, ch *amqp.Channel, q amqp.Queue) {
	body := "Olá, RabbitMQ!"
    ch.Publish(
        "",     // Exchange
        q.Name, // Roteamento para a fila
        false,  // Obrigatório
        false,  // Imediato
        amqp.Publishing{
            ContentType: "text/plain",
            Body:        []byte(body),
        })
    // failOnError(err, "Falha ao publicar uma mensagem")
    log.Printf("Mensagem enviada: %s", body)

}

func (rq *RabbitMQ) Consumer(ch *amqp.Channel, q amqp.Queue) {
	defer ch.Close()
	// Consumir mensagens
	msgs, err := ch.Consume(
		q.Name, // Nome da fila
		"",     // Nome do consumidor
		true,   // Auto-ack
		false,  // Exclusivo
		false,  // No-local
		false,  // No-wait
		nil,    // Argumentos adicionais
	)
	failOnError(err, "Falha ao registrar o consumidor")

	// Ler mensagens em um canal
	forever := make(chan bool)
	go func() {
		for d := range msgs {
			log.Printf("Mensagem recebida: %s", d.Body)
		}
	}()

	log.Printf("Aguardando mensagens. Pressione CTRL+C para sair.")
	<-forever
}