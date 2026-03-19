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

	collection := client.Database("ojs-marketplace").Collection("articles")

	// Drop and recreate collection
	fmt.Println("Dropping existing articles collection...")
	err = collection.Drop(ctx)
	if err != nil {
		log.Printf("Warning: Failed to drop articles: %v", err)
	}

	// Seed articles (blog posts)
	articles := []entities.Article{
		{
			Slug:        "install-tema-ojs",
			Title:       "Cara Install Tema OJS 3.x dari Awal",
			Excerpt:     "Panduan lengkap instalasi tema OJS mulai dari download, upload via FTP, hingga aktivasi di panel admin. Cocok untuk pemula.",
			Author:      "Admin",
			AuthorEmail: "admin@example.com",
			Category:    "Tutorial",
			Tags:        []string{"OJS", "Tutorial", "Install"},
			Icon:        "FaTools",
			IconColor:   "text-blue-400",
			Bg:          "from-blue-50 to-indigo-100",
			Tag:         "Tutorial",
			TagColor:    "bg-blue-100 text-blue-700",
			PublishedAt: time.Date(2026, 3, 14, 0, 0, 0, 0, time.UTC),
			Active:      true,
			Order:       1,
		},
		{
			Slug:        "migrasi-ojs-33-34",
			Title:       "Panduan Migrasi OJS 3.3 ke OJS 3.4",
			Excerpt:     "Langkah demi langkah migrasi versi OJS tanpa kehilangan data artikel, reviewer, dan pengaturan jurnal Anda.",
			Author:      "Admin",
			AuthorEmail: "admin@example.com",
			Category:    "Tutorial",
			Tags:        []string{"OJS", "Migrasi", "Upgrade"},
			Icon:        "FaSyncAlt",
			IconColor:   "text-amber-400",
			Bg:          "from-amber-50 to-orange-100",
			Tag:         "Migrasi",
			TagColor:    "bg-amber-100 text-amber-700",
			PublishedAt: time.Date(2026, 3, 10, 0, 0, 0, 0, time.UTC),
			Active:      true,
			Order:       2,
		},
		{
			Slug:        "plugin-ojs-terbaik",
			Title:       "10 Plugin OJS Terbaik untuk Jurnal Anda",
			Excerpt:     "Rekomendasi plugin OJS paling berguna: DOI, Plagiarism Check, Google Scholar indexing, dan plugin aksesibilitas terpopuler.",
			Author:      "Admin",
			AuthorEmail: "admin@example.com",
			Category:    "Review",
			Tags:        []string{"OJS", "Plugin", "Review"},
			Icon:        "FaPlug",
			IconColor:   "text-green-400",
			Bg:          "from-green-50 to-emerald-100",
			Tag:         "Plugin",
			TagColor:    "bg-green-100 text-green-700",
			PublishedAt: time.Date(2026, 3, 5, 0, 0, 0, 0, time.UTC),
			Active:      true,
			Order:       3,
		},
	}

	fmt.Println("Inserting articles...")
	inserted := 0
	for _, article := range articles {
		article.CreatedAt = time.Now().UTC()
		article.UpdatedAt = article.CreatedAt
		_, err := collection.InsertOne(ctx, article)
		if err != nil {
			log.Printf("Failed to insert article %s: %v", article.Slug, err)
			continue
		}
		inserted++
		fmt.Printf("Inserted: %s - %s\n", article.Slug, article.Title)
	}

	fmt.Printf("\nDone! Inserted %d articles\n", inserted)
	fmt.Println("Test endpoint: curl http://localhost:4000/api/v1/articles?limit=3")
}
