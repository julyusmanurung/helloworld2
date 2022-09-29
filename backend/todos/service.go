package todos

import (
	"net/http"

	"github.com/julyusmanurung/helloworld2/model"
)

type Service interface {
	GetTodos() ([]model.Todos, int, error)
	CreateTodos(req DataRequest) (model.Todos, int, error)
	UpdateTodos(id string) (model.Todos, int, error)
	DeleteTodos(id string) (model.Todos, int, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) *service {
	return &service{repo}
}

func (s *service) GetTodos() ([]model.Todos, int, error) {
	todos, err := s.repo.GetTodos()
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	return todos, http.StatusOK, nil
}

func (s *service) CreateTodos(req DataRequest) (model.Todos, int, error) {
	todo, err := s.repo.CreateTodos(req.Task)
	if err != nil {
		return model.Todos{}, http.StatusInternalServerError, err
	}

	return todo, http.StatusOK, nil
}

func (s *service) UpdateTodos(id string) (model.Todos, int, error) {
	todo, err := s.repo.UpdateTodos(id)
	if err != nil {
		return model.Todos{}, http.StatusInternalServerError, err
	}

	return todo, http.StatusOK, nil
}

func (s *service) DeleteTodos(id string) (model.Todos, int, error) {
	todo, err := s.repo.DeleteTodos(id)
	if err != nil {
		return model.Todos{}, http.StatusInternalServerError, err
	}

	return todo, http.StatusOK, nil
}
