package main

import (
	_ "github.com/joho/godotenv/autoload"
	"github.com/julyusmanurung/helloworld2/api"
)

func main() {
	db, err := api.SetupDb()
	if err != nil {
		panic(err)
	}

	server := api.MakeServer(db)
	server.RunServer()
}
