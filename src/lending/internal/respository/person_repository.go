package repository

import (
	"github.com/hellyaxs/internal/domain"
	"gorm.io/gorm"
)

type PersonRepository struct {
	db *gorm.DB
}

func NewPersonRepository(db *gorm.DB) *PersonRepository {
	return &PersonRepository{db: db}
}

func (r *PersonRepository) CreatePerson(person *domain.Person) error {
	return r.db.Create(person).Error
}

func (r *PersonRepository) GetPerson(person *domain.Person) error {
	return r.db.Preload("Phone").Find(person).Error
}

func (r *PersonRepository) GetPersonById(id int) (*domain.Person, error) {
	var person domain.Person
	if err := r.db.Preload("Phone").First(&person, id).Error; err != nil {
		return nil, err
	}
	return &person, nil
}

func (r *PersonRepository) UpdatePerson(person *domain.Person) error {
	return r.db.Save(person).Error
}