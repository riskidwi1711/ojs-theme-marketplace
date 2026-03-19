// +build ignore

package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"ojs-server/internal/domain/entities"
	"ojs-server/internal/infrastructure/database"
	"ojs-server/internal/pkg/utils"

	"go.mongodb.org/mongo-driver/mongo"
)

func main() {
	// Connect to MongoDB
	client, err := database.NewMongoDB("mongodb://localhost:27017", "ojs-marketplace")
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Create admin account
	email := "admin@ojs.com"
	password := "admin123"
	name := "Administrator"

	// Check if admin exists
	collection := client.(*mongo.Database).Collection("accounts")
	var existing entities.Account
	err = collection.FindOne(ctx, map[string]string{"email": email}).Decode(&existing)
	if err == nil {
		fmt.Println("Admin account already exists!")
		return
	}

	// Hash password
	hash, err := utils.HashPassword(password)
	if err != nil {
		log.Fatal("Failed to hash password:", err)
	}

	// Create admin account
	admin := &entities.Account{
		Email:        email,
		Name:         name,
		PasswordHash: hash,
		Role:         "admin",
		Status:       "active",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	_, err = collection.InsertOne(ctx, admin)
	if err != nil {
		log.Fatal("Failed to create admin account:", err)
	}

	fmt.Println("✓ Admin account created successfully!")
	fmt.Println("  Email:", email)
	fmt.Println("  Password:", password)
	fmt.Println("\nPlease change the password after first login!")
}
