package domain


type Person struct {
	Id        int     `json:"id" gorm:"primary_key"`
	First_name string  `json:"firstName"`
	Last_name string  `json:"lastName"`
	Birth_date string  `json:"birthdate"`
	Address string  `json:"address"`
	Email     string `json:"email"` 
	Phone []Phone  `gorm:"foreignKey:person_id"`
}