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

	collection := client.Database("ojs-marketplace").Collection("categories")

	// Clear existing categories
	fmt.Println("Clearing existing categories...")
	_, err = collection.DeleteMany(ctx, bson.M{})
	if err != nil {
		log.Printf("Warning: Failed to clear categories: %v", err)
	}

	// Seed categories
	categories := []entities.Category{
		{Slug: "jurnal-ilmiah", Name: "Jurnal Ilmiah", Description: "Template jurnal ilmiah profesional", Color: "text-blue-600", Bg: "from-blue-50 to-blue-100"},
		{Slug: "konferensi", Name: "Konferensi", Description: "Template untuk konferensi dan proceedings", Color: "text-purple-600", Bg: "from-purple-50 to-purple-100"},
		{Slug: "open-access", Name: "Open Access", Description: "Jurnal open access gratis", Color: "text-green-600", Bg: "from-green-50 to-green-100"},
		{Slug: "sains-teknik", Name: "Sains & Teknik", Description: "Sains, teknologi, dan teknik", Color: "text-cyan-600", Bg: "from-cyan-50 to-cyan-100"},
		{Slug: "kedokteran", Name: "Kedokteran", Description: "Kesehatan dan ilmu medis", Color: "text-red-600", Bg: "from-red-50 to-red-100"},
		{Slug: "hukum-sosial", Name: "Hukum & Sosial", Description: "Ilmu hukum dan sosial", Color: "text-amber-600", Bg: "from-amber-50 to-amber-100"},
		{Slug: "multi-journal", Name: "Multi-Journal", Description: "Platform multi jurnal", Color: "text-indigo-600", Bg: "from-indigo-50 to-indigo-100"},
		{Slug: "repository", Name: "Repository", Description: "Repository dan perpustakaan digital", Color: "text-gray-600", Bg: "from-gray-50 to-gray-100"},
	}

	fmt.Println("Inserting categories...")
	inserted := 0
	for _, cat := range categories {
		_, err := collection.InsertOne(ctx, cat)
		if err != nil {
			log.Printf("Failed to insert category %s: %v", cat.Slug, err)
			continue
		}
		inserted++
		fmt.Printf("Inserted: %s - %s\n", cat.Slug, cat.Name)
	}

	fmt.Printf("\nDone! Inserted %d categories\n", inserted)
	fmt.Println("Test endpoint: curl http://localhost:4000/api/v1/categories")
}
