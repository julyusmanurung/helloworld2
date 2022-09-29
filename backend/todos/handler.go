package todos

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service}
}

func (h *Handler) GetTodos(c *gin.Context) {
	todos, status, err := h.Service.GetTodos()
	if err != nil {
		log.Println("get data error", err)
		c.JSON(status, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"message": "success",
		"data":    todos,
	})
}

func (h *Handler) CreateTodo(c *gin.Context) {
	var req DataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println("data request error", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, status, err := h.Service.CreateTodos(req)
	if err != nil {
		log.Println("create error", err)
		c.JSON(status, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"message": "success",
		"data":    res,
	})
}

func (h *Handler) UpdateTodo(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		log.Println("convert string to uint error", err)
	}

	res, status, err := h.Service.UpdateTodos(uint(id))
	if err != nil {
		log.Println("update error", err)
		c.JSON(status, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"message": "success",
		"data":    res,
	})
}

func (h *Handler) DeleteTodo(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		log.Println("convert string to uint error", err)
	}

	res, status, err := h.Service.DeleteTodos(uint(id))
	if err != nil {
		log.Println("delete error", err)
		c.JSON(status, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"message": "success",
		"data":    res,
	})
}
