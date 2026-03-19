package entities

type Theme struct {
	ID         string `json:"id" bson:"id"`
	Title      string `json:"title" bson:"title"`
	URL        string `json:"url" bson:"url"`
	Image      string `json:"image" bson:"image"`
	LocalImage string `json:"localImage" bson:"localImage"`
	PriceText  string `json:"priceText" bson:"priceText"`
	Slug       string `json:"slug" bson:"slug"`
	Filename   string `json:"filename" bson:"filename"`
}
