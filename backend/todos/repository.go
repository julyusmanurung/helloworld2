package todos

import (
	"log"

	"github.com/julyusmanurung/helloworld2/model"
	"gorm.io/gorm"
)

type Repository interface {
	GetTodos() ([]model.Todos, error)
	CreateTodos(data string) (model.Todos, error)
	UpdateTodos(id string) (model.Todos, error)
	DeleteTodos(id uint) (model.Todos, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) GetTodos() ([]model.Todos, error) {
	var todos []model.Todos
	res := r.db.Find(&todos)
	if res.Error != nil {
		log.Println("get data error", res.Error)
		return nil, res.Error
	}

	return todos, nil
}

func (r *repository) CreateTodos(task string) (model.Todos, error) {
	todo := model.Todos{
		Task: task,
		Done: false,
	}

	res := r.db.Create(&todo)
	if res.Error != nil {
		log.Println("create error", res.Error)
		return model.Todos{}, res.Error
	}

	return todo, nil
}

func (r *repository) UpdateTodos(id string) (model.Todos, error) {
	todo := model.Todos{
		Done: true,
	}

	res := r.db.Model(&todo).Where("ID", id).Updates(&todo)
	if res.Error != nil {
		log.Println("update error", res.Error)
		return model.Todos{}, res.Error
	}

	return todo, nil
}

func (r *repository) DeleteTodos(id uint) (model.Todos, error) {
	todo := model.Todos{
		Model: gorm.Model{
			ID: id,
		},
	}

	res := r.db.Delete(&todo)
	// Model(&todo).Where("ID", id).Delete(&todo)
	if res.Error != nil {
		log.Println("delete error", res.Error)
		return model.Todos{}, res.Error
	}

	return todo, nil
}
