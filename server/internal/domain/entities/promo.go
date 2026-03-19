package entities

type Promo struct {
	ID           string  `json:"id" bson:"id"`
	ProductID    string  `json:"productId" bson:"productId"`
	ProductName  string  `json:"productName" bson:"productName"`
	ProductImage string  `json:"productImage" bson:"productImage"`
	Price        float64 `json:"price" bson:"price"`
	Original     float64 `json:"original" bson:"original"`
	Rating       float64 `json:"rating" bson:"rating"`
	Reviews      int     `json:"reviews" bson:"reviews"`
	Sold         int     `json:"sold" bson:"sold"`
	Total        int     `json:"total" bson:"total"`
	Badge        string  `json:"badge" bson:"badge"`
	BadgeColor   string  `json:"badgeColor" bson:"badgeColor"`
	Compat       string  `json:"compat" bson:"compat"`
	Emoji        string  `json:"emoji" bson:"emoji"`
	Bg           string  `json:"bg" bson:"bg"`
	Active       bool    `json:"active" bson:"active"`
	Order        int     `json:"order" bson:"order"`
}
