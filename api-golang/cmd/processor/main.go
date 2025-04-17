package main

import (
	rabbbitmq "github.com/hellyaxs/pkg/rabbbitmq"
)

func main() {

    rq := &rabbbitmq.RabbitMQ{}
    rq.Connect()
    go rq.Consumer("person_created")
	go rq.Consumer("person_updated")
	select {}
}