package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

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

	collection := client.Database("ojs-marketplace").Collection("banners")

	// Drop and recreate collection
	fmt.Println("Dropping existing banners collection...")
	err = collection.Drop(ctx)
	if err != nil {
		log.Printf("Warning: Failed to drop banners: %v", err)
	}

	// Seed banners (promo banners)
	banners := []entities.Banner{
		{
			Title:       "Paket Hemat",
			Subtitle:    "Bundle 5 Tema",
			Price:       "Hanya $59.9",
			Discount:    "Hemat hingga 40%",
			Icon:        "FaBox",
			Bg:          "from-violet-600 to-purple-800",
			TextColor:   "text-white",
			SubColor:    "text-purple-200",
			Href:        "/themes?section=bundle",
			Active:      true,
			Order:       1,
			CreatedAt:   time.Now().UTC(),
			UpdatedAt:   time.Now().UTC(),
		},
		{
			Title:         "STARTER THEME",
			Subtitle:      "Gratis selamanya",
			Price:         "$0",
			OriginalPrice: "$15",
			Description:   "OJS 3.3+",
			Icon:          "FaGift",
			Bg:            "from-[#1a1a2e] to-[#16213e]",
			TextColor:     "text-white",
			SubColor:      "text-white/80",
			Href:          "/themes/free",
			Active:        true,
			Order:         2,
			CreatedAt:     time.Now().UTC(),
			UpdatedAt:     time.Now().UTC(),
		},
		{
			Title:       "Custom Development",
			Subtitle:    "Tema Kustom",
			Description: "Sesuai kebutuhan jurnal Anda",
			Price:       "Dari $299",
			Icon:        "FaTools",
			Bg:          "from-amber-50 to-yellow-100",
			TextColor:   "text-[#1a1a2e]",
			SubColor:    "text-gray-500",
			Href:        "/contact",
			Active:      true,
			Order:       3,
			CreatedAt:   time.Now().UTC(),
			UpdatedAt:   time.Now().UTC(),
		},
	}

	fmt.Println("Inserting banners...")
	inserted := 0
	for _, banner := range banners {
		_, err := collection.InsertOne(ctx, banner)
		if err != nil {
			log.Printf("Failed to insert banner %s: %v", banner.Title, err)
			continue
		}
		inserted++
		fmt.Printf("Inserted: %s\n", banner.Title)
	}

	fmt.Printf("\nDone! Inserted %d banners\n", inserted)
	fmt.Println("Test endpoint: curl http://localhost:4000/api/v1/banners")
}
