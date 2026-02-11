package rabbbitmq

import (
	"log"
	"github.com/hellyaxs/pkg/env"
	"github.com/streadway/amqp"
)

type RabbitMQ struct {
	Conn *amqp.Connection
	Ch   *amqp.Channel
}

func (rq *RabbitMQ) Connect() *RabbitMQ {

	amqpURL := env.GetAmqpURL()
    // Conectar ao RabbitMQ
	if(rq.Conn == nil) {
		var err error
		rq.Conn, err = amqp.Dial(amqpURL)
		env.FailOnError(err, "Falha ao conectar ao RabbitMQ")
	}

	if(rq.Ch == nil) {
		var err error
		rq.Ch, err = rq.Conn.Channel()
		env.FailOnError(err, "Falha ao abrir um canal")
	}

	return rq

}

func (rq *RabbitMQ) Publishing(q amqp.Queue) {
	body := "Olá, RabbitMQ!"
    rq.Ch.Publish(
        "",     // Exchange
        q.Name, // Roteamento para a fila
        false,  // Obrigatório
        false,  // Imediato
        amqp.Publishing{
            ContentType: "text/plain",
            Body:        []byte(body),
        })
    log.Printf("Mensagem enviada: %s", body)

}

func (rq *RabbitMQ) Consumer(q string) {
	defer rq.Ch.Close()
	// Consumir mensagens
	msgs, err := rq.Ch.Consume(
		q, // Nome da fila
		"",     // Nome do consumidor
		true,   // Auto-ack
		false,  // Exclusivo
		false,  // No-local
		false,  // No-wait
		nil,    // Argumentos adicionais
	)
	env.FailOnError(err, "Falha ao registrar o consumidor")

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