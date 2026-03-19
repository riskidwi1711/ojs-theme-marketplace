package entities

type ChangelogEntry struct {
	Version string   `json:"version" bson:"version"`
	Date    string   `json:"date"    bson:"date"`
	Tag     string   `json:"tag"     bson:"tag"`
	Changes []string `json:"changes" bson:"changes"`
}

type Product struct {
    ID         string  `json:"id"`
    Name       string  `json:"name"`
    Slug       string  `json:"slug"`
    Price      float64 `json:"price"`
    Original   float64 `json:"original,omitempty"`
    Rating     float64 `json:"rating"`
    Reviews    int     `json:"reviews"`
    Compat     string  `json:"compat,omitempty"`
    Category   string  `json:"category,omitempty"`
    Section    string  `json:"section"`
    Emoji      string  `json:"emoji,omitempty"`
    Bg         string  `json:"bg,omitempty"`
    Badge      string  `json:"badge,omitempty"`
    BadgeColor string  `json:"badgeColor,omitempty"`
    Description     string   `json:"description,omitempty"`
    Features        []string `json:"features,omitempty"`
    Image           string   `json:"image,omitempty"`
    Gallery         []string `json:"gallery,omitempty"`
    DemoUrl         string   `json:"demoUrl,omitempty"`
    LivePreviewURL  string   `json:"livePreviewUrl,omitempty"`
    PriceText       string   `json:"priceText,omitempty"`
    OjsVersion      string   `json:"ojsVersion,omitempty"`
    Framework       string   `json:"framework,omitempty"`
    BrowserSupport  string   `json:"browserSupport,omitempty"`
    License         string   `json:"license,omitempty"`
    UpdateDuration  string   `json:"updateDuration,omitempty"`
    SupportDuration string   `json:"supportDuration,omitempty"`
    Tags            []string         `json:"tags,omitempty"`
    Changelog       []ChangelogEntry `json:"changelog,omitempty" bson:"changelog,omitempty"`
}
