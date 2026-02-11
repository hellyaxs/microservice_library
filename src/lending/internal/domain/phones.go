package domain


type Phone struct {
	ID int `json:"id" gorm:"primary_key"`
	DDD string `json:"ddd"`
	Number string `json:"number"`
	Type string `json:"type"`
	PersonId int `json:"-" gorm:"column:person_id"`

}