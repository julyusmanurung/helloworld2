package api

import (
	"github.com/gin-contrib/cors"
	"github.com/julyusmanurung/helloworld2/todos"
)

func (s *server) SetupRouter() {
	s.Router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "DELETE", "PUT"},
	}))

	todosRepo := todos.NewRepository(s.DB)
	todosService := todos.NewService(todosRepo)
	todosHandler := todos.NewHandler(todosService)

	s.Router.GET("/", todosHandler.GetTodos)
	s.Router.POST("/send", todosHandler.CreateTodo)
	s.Router.PUT("/send/:id", todosHandler.UpdateTodo)
	s.Router.DELETE("/send/:id", todosHandler.DeleteTodo)
}
