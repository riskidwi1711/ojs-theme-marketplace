package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/config"
	"ojs-server/internal/domain/entities"
)

func main() {
	config.Load(os.Getenv("env"), ".env")
	mongoURI := config.GetString("sa.mongodb.uri")

	fmt.Println("Connecting to MongoDB...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}
	fmt.Println("Connected to MongoDB!")

	collection := client.Database("ojs-marketplace").Collection("sections")

	// Clear existing sections
	fmt.Println("Clearing existing sections...")
	_, err = collection.DeleteMany(ctx, bson.M{})
	if err != nil {
		log.Printf("Warning: Failed to clear sections: %v", err)
	}

	// Seed sections (featured collections)
	sections := []entities.Section{
		{
			Slug:        "new-releases",
			Name:        "Rilis Tema Terbaru 2024",
			Description: "Desain segar & modern",
			Sub:         "Desain segar & modern",
			Icon:        "FaMagic",
			IconColor:   "text-purple-300",
			Bg:          "from-violet-800 to-purple-900",
			TextColor:   "text-white",
			SubColor:    "text-purple-300",
			Tag:         "Baru",
			TagBg:       "bg-[var(--color-primary)] text-white",
			Href:        "/themes?section=new",
			Active:      true,
			Order:       1,
		},
		{
			Slug:        "bootstrap-collection",
			Name:        "Koleksi Bootstrap 3 OJS",
			Description: "Template klasik terjangkau",
			Sub:         "Mulai dari $9.9",
			Icon:        "FaPalette",
			IconColor:   "text-amber-500",
			Bg:          "from-amber-50 to-orange-100",
			TextColor:   "text-gray-900",
			SubColor:    "text-gray-600",
			Tag:         "Populer",
			TagBg:       "bg-green-500 text-white",
			Href:        "/themes?category=jurnal-ilmiah",
			Active:      true,
			Order:       2,
		},
		{
			Slug:        "ojs-34-bundle",
			Name:        "Paket OJS 3.4",
			Description: "Support terjamin",
			Sub:         "Support terjamin",
			Icon:        "FaBox",
			IconColor:   "text-blue-400",
			Bg:          "from-sky-50 to-blue-100",
			TextColor:   "text-gray-900",
			SubColor:    "text-gray-600",
			Tag:         "Sale",
			TagBg:       "bg-red-500 text-white",
			Href:        "/themes?compat=OJS 3.4+",
			Active:      true,
			Order:       3,
		},
		{
			Slug:        "free-themes",
			Name:        "Tema Gratis",
			Description: "100% free, no credit card",
			Sub:         "100% free, no credit card",
			Icon:        "FaGift",
			IconColor:   "text-green-500",
			Bg:          "from-green-50 to-emerald-100",
			TextColor:   "text-gray-900",
			SubColor:    "text-gray-600",
			Tag:         "Gratis",
			TagBg:       "bg-blue-500 text-white",
			Href:        "/themes/free",
			Active:      true,
			Order:       4,
		},
	}

	fmt.Println("Inserting sections...")
	inserted := 0
	for _, sec := range sections {
		sec.CreatedAt = time.Now().UTC()
		sec.UpdatedAt = sec.CreatedAt
		_, err := collection.InsertOne(ctx, sec)
		if err != nil {
			log.Printf("Failed to insert section %s: %v", sec.Slug, err)
			continue
		}
		inserted++
		fmt.Printf("Inserted: %s - %s\n", sec.Slug, sec.Name)
	}

	fmt.Printf("\nDone! Inserted %d sections\n", inserted)
	fmt.Println("Test endpoint: curl http://localhost:4000/api/v1/sections")
}
