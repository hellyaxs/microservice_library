package main


import (
	rabbbitmq "github.com/hellyaxs/pkg/rabbbitmq"
	
)

func main() {
	rt,err := rabbbitmq.NewConection("hello")
	if err != nil {
		panic(err)
	}
	rt.Consumer(rt.Ch, rt.Q)
}