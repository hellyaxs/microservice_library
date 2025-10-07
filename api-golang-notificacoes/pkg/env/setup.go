package env

import (
	"log"
	"os"
	"fmt"
	"github.com/joho/godotenv"
)

const (
	amqpURL = "amqp://%s:%s@%s:%s/"
	rabbitMQUser = "RABBITMQ_USER"
	rabbitMQPassword = "RABBITMQ_PASSWORD"
	rabbitMQHost = "RABBITMQ_HOST"
	rabbitMQPort = "RABBITMQ_PORT"
)

func setupEnv() {
	err := godotenv.Load()
    FailOnError(err, "Erro ao carregar o arquivo .env")
}

func GetEnv(key string) string {
	return os.Getenv(key)
}

func GetAmqpURL() string {
	setupEnv()
	return fmt.Sprintf(amqpURL,
	os.Getenv(rabbitMQUser),
	os.Getenv(rabbitMQPassword),
	os.Getenv(rabbitMQHost),
	os.Getenv(rabbitMQPort),
)
}

func FailOnError(err error, msg string) {
    if err != nil {
        log.Fatalf("%s: %s", msg, err)
    }
}