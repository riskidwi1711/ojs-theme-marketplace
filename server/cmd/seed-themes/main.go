package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/config"
	"ojs-server/internal/domain/entities"
)

type ThemeJSON struct {
	Source    string           `json:"source"`
	ScrapedAt string           `json:"scrapedAt"`
	Count     int              `json:"count"`
	Items     []entities.Theme `json:"items"`
}

func main() {
	// Load config
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

	// Ping to verify connection
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}
	fmt.Println("Connected to MongoDB!")

	// Read JSON file
	jsonPath := "../src/data/ojs-themes.json"
	absPath, _ := filepath.Abs(jsonPath)
	data, err := os.ReadFile(absPath)
	if err != nil {
		log.Fatalf("Failed to read JSON file: %v", err)
	}

	var themeData ThemeJSON
	if err := json.Unmarshal(data, &themeData); err != nil {
		log.Fatalf("Failed to parse JSON: %v", err)
	}

	fmt.Printf("Found %d themes in JSON file\n", themeData.Count)

	// Get products collection
	collection := client.Database("ojs-marketplace").Collection("products")

	// Create unique index on slug
	fmt.Println("Creating unique index on slug...")
	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "slug", Value: 1}},
		Options: options.Index().SetUnique(true).SetName("uniq_slug"),
	}
	_, err = collection.Indexes().CreateOne(ctx, indexModel)
	if err != nil {
		log.Printf("Warning: Failed to create index: %v", err)
	}

	// Insert themes as products
	fmt.Println("Inserting OJS themes as products...")
	inserted := 0
	skipped := 0

	for _, theme := range themeData.Items {
		// Convert Theme to Product
		product := entities.Product{
			ID:         theme.Slug,
			Slug:       theme.Slug,
			Name:       theme.Title,
			Price:      0, // Will be parsed from priceText if needed
			Original:   0,
			Rating:     4.5,
			Reviews:    0,
			Compat:     "OJS 3.x",
			Category:   "ojs-theme",
			Section:    "",
			Emoji:      "🎨",
			Bg:         "from-blue-50 to-blue-100",
			Badge:      "",
			BadgeColor: "",
			Image:      theme.Image,
			PriceText:  theme.PriceText,
			Tags:       []string{"OJS 3", "Scraped"},
			LivePreviewURL: theme.URL,
		}

		// Try to insert
		_, err := collection.InsertOne(ctx, product)
		if err != nil {
			// Check if duplicate key error
			if we, ok := err.(mongo.WriteException); ok {
				for _, e := range we.WriteErrors {
					if e.Code == 11000 { // Duplicate key error
						fmt.Printf("Skipping duplicate: %s\n", product.Slug)
						skipped++
						continue
					}
				}
			}
			log.Printf("Failed to insert %s: %v", product.Slug, err)
			continue
		}
		inserted++
		fmt.Printf("Inserted: %s\n", product.Name)
	}

	fmt.Printf("\nDone! Inserted: %d, Skipped: %d\n", inserted, skipped)
}

// Helper to convert price text to float (optional)
func parsePrice(priceText string) float64 {
	// Remove "Rp" and commas, convert to float
	clean := strings.ReplaceAll(priceText, "Rp", "")
	clean = strings.ReplaceAll(clean, ",", "")
	// Simple parsing (you can add more robust parsing if needed)
	return 0 // For now, return 0
}
