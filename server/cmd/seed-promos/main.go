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

	// Get promos collection
	collection := client.Database("ojs-marketplace").Collection("promos")

	// Drop existing promos (optional - comment out if you want to keep existing data)
	fmt.Println("Clearing existing promos...")
	_, err = collection.DeleteMany(ctx, bson.M{})
	if err != nil {
		log.Printf("Warning: Failed to clear promos: %v", err)
	}

	// Seed promo data
	promos := []entities.Promo{
		{
			ID:           "promo-1",
			ProductID:    "scholar",
			ProductName:  "Scholar – Clean Academic Journal OJS Theme",
			ProductImage: "",
			Price:        19.00,
			Original:     29.00,
			Rating:       5,
			Reviews:      120,
			Sold:         15,
			Total:        60,
			Badge:        "Sale",
			BadgeColor:   "bg-red-500 text-white",
			Compat:       "OJS 3.3+",
			Emoji:        "📘",
			Bg:           "from-blue-50 to-blue-100",
			Active:       true,
			Order:        1,
		},
		{
			ID:           "promo-2",
			ProductID:    "akademia",
			ProductName:  "Akademia – Open Access Scientific Portal",
			ProductImage: "",
			Price:        25.00,
			Original:     35.00,
			Rating:       4,
			Reviews:      85,
			Sold:         144,
			Total:        300,
			Badge:        "10% Off",
			BadgeColor:   "bg-[var(--color-primary)] text-white",
			Compat:       "OJS 3.4+",
			Emoji:        "🔬",
			Bg:           "from-cyan-50 to-cyan-100",
			Active:       true,
			Order:        2,
		},
		{
			ID:           "promo-3",
			ProductID:    "primus",
			ProductName:  "Primus – Minimalist Journal Theme OJS 3.x",
			ProductImage: "",
			Price:        15.00,
			Original:     22.00,
			Rating:       4.5,
			Reviews:      340,
			Sold:         344,
			Total:        500,
			Badge:        "Hot",
			BadgeColor:   "bg-orange-500 text-white",
			Compat:       "OJS 3.x",
			Emoji:        "📄",
			Bg:           "from-indigo-50 to-indigo-100",
			Active:       true,
			Order:        3,
		},
		{
			ID:           "promo-4",
			ProductID:    "lexica",
			ProductName:  "Lexica – Law Review Journal Template",
			ProductImage: "",
			Price:        18.00,
			Original:     28.00,
			Rating:       5,
			Reviews:      52,
			Sold:         35,
			Total:        80,
			Badge:        "New",
			BadgeColor:   "bg-blue-500 text-white",
			Compat:       "OJS 3.3+",
			Emoji:        "⚖️",
			Bg:           "from-amber-50 to-amber-100",
			Active:       true,
			Order:        4,
		},
	}

	// Insert promos
	fmt.Println("Inserting promos...")
	inserted := 0
	for _, promo := range promos {
		_, err := collection.InsertOne(ctx, promo)
		if err != nil {
			log.Printf("Failed to insert promo %s: %v", promo.ID, err)
			continue
		}
		inserted++
		fmt.Printf("Inserted: %s - %s\n", promo.ID, promo.ProductName)
	}

	fmt.Printf("\nDone! Inserted %d promos\n", inserted)
	fmt.Println("Test endpoint: curl http://localhost:4000/api/v1/promos")
}
