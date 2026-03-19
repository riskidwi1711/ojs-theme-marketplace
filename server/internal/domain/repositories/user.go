package repositories

import (
	"context"

	"ojs-server/internal/domain/entities"
	"ojs-server/internal/pkg/log"
	"go.mongodb.org/mongo-driver/mongo"
)

type User interface {
	GetAllUser(ctx context.Context, req entities.GetUsersReq) (docs []entities.User, count uint, err error)
}

type user struct {
	collection *mongo.Collection
}

func NewUser(db *mongo.Database) User {
	if db == nil {
		panic("sa db is nil")
	}
	return &user{collection: db.Collection("user_state")}
}

func (r *user) GetAllUser(ctx context.Context, req entities.GetUsersReq) (docs []entities.User, count uint, err error) {
	filter := make(map[string]interface{})

	if req.StartDate != "" && req.EndDate != "" {
		filter["created_at"] = map[string]interface{}{
			"$gte": req.StartDate + "T00:00:00Z",
			"$lte": req.EndDate + "T23:59:59Z",
		}
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		log.Error(ctx, "error find user %v", err)
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var doc entities.User
		if err = cursor.Decode(&doc); err != nil {
			log.Error(ctx, "error decode user %v", err)
			return
		}
		docs = append(docs, doc)
	}

	count = uint(len(docs))
	return
}
