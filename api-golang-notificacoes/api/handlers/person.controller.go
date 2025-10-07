package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hellyaxs/internal/domain"
	repository "github.com/hellyaxs/internal/respository"
	"gorm.io/gorm"
)

type PersonController struct {
	db *gorm.DB
	repository *repository.PersonRepository
}

func NewPersonController(db *gorm.DB) *PersonController {
	return &PersonController{db: db, repository: repository.NewPersonRepository(db)}
}

func (controller *PersonController) CreatePerson(c *gin.Context) {
	Person, err := BindJSON[domain.Person](c)
	if err != nil {
		c.JSON(400, gin.H{
			"message": "Invalid request payload",
		})
		return
	}
	er := controller.repository.CreatePerson(Person)
	if er != nil {
		c.JSON(500, gin.H{
			"message": "Error creating person",
		})
		return
	}
	c.JSON(200, Person)
}

func (controller *PersonController) GetPerson(c *gin.Context) {
	Person := domain.Person{}
	err := controller.repository.GetPerson(&Person)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error getting person",
		})
		return
	}
	c.JSON(200, Person)
}

func (controller *PersonController) GetPersonById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{
			"message": "Invalid ID format",
		})
		return
	}
	Person, err := controller.repository.GetPersonById(id)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error getting person",
		})
		return
	}
	c.JSON(200, Person)
}

func (controller *PersonController) UpdatePerson(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello, World!",
	})
}

func (controller *PersonController) DeletePerson(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello, World!",
	})
}

