package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"ojs-server/internal/domain/entities"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(ctx)

	collection := client.Database("ojs-marketplace").Collection("banners")

	// Clear existing banners
	_, err = collection.DeleteMany(ctx, bson.M{})
	if err != nil {
		log.Fatal("Failed to clear existing banners:", err)
	}
	fmt.Println("✓ Cleared existing banners")

	// Banner data from FALLBACK_SLIDES
	banners := []entities.Banner{
		{
			Title:       "Tema OJS Premium untuk Jurnal Akademik",
			Subtitle:    "🎨 Premium OJS Templates",
			Description: "Tingkatkan kredibilitas jurnal Anda dengan desain profesional. Mudah dikustomisasi, SEO-friendly, dan mobile-responsive.",
			Bg:          "from-[#0b1624] via-[#1c3a6e] to-[#3d8c1e]",
			TextColor:   "text-white",
			SubColor:    "text-blue-300",
			Href:        "/themes",
			Icon:        "🎓",
			Active:      true,
			Order:       1,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			Title:       "DISKON 20% SEMUA TEMA",
			Subtitle:    "⚡ Flash Sale - Hari Ini Saja",
			Description: "Gunakan kode voucher di bawah dan hemat hingga 20% untuk semua tema premium. Jangan sampai kehabisan!",
			Price:       "20% OFF",
			Discount:    "Semua Tema",
			Bg:          "from-[#1a1a2e] via-[#2d1f3d] to-[#1a3a2e]",
			TextColor:   "text-white",
			SubColor:    "text-amber-400",
			Href:        "voucher:PREMIUM20",
			Icon:        "🎁",
			Active:      true,
			Order:       2,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			Title:       "Gratis Update Selamanya",
			Subtitle:    "✨ Lifetime Free Updates",
			Description: "Beli sekali, dapatkan semua update masa depan secara gratis. Kompatibel dengan OJS 3.x dan versi terbaru.",
			Bg:          "from-[#0f4c81] via-[#1e5f74] to-[#2d7a6e]",
			TextColor:   "text-white",
			SubColor:    "text-cyan-300",
			Href:        "/themes",
			Icon:        "♾️",
			Active:      true,
			Order:       3,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			Title:       "Tools & Fitur Lengkap",
			Subtitle:    "🛠️ Powerful OJS Tools",
			Description: "Kelola jurnal Anda dengan mudah menggunakan tools dan fitur lengkap yang terintegrasi dengan OJS 3.x",
			Bg:          "from-[#1c3a6e] via-[#2d5a8e] to-[#3d8c1e]",
			TextColor:   "text-white",
			SubColor:    "text-green-300",
			Href:        "/themes",
			Icon:        "FaTools",
			Active:      true,
			Order:       4,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	// Insert banners
	for i, banner := range banners {
		result, err := collection.InsertOne(ctx, banner)
		if err != nil {
			log.Fatal("Failed to insert banner:", err)
		}
		fmt.Printf("✓ Inserted banner %d/%d: %s (ID: %v)\n", i+1, len(banners), banner.Title, result.InsertedID)
	}

	fmt.Println("\n✅ Successfully seeded", len(banners), "banners to database!")
	fmt.Println("\nVoucher code: PREMIUM20")
}
