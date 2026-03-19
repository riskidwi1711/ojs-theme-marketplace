package mongodb

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"ojs-server/internal/config"
	"ojs-server/internal/pkg/log"

	"github.com/labstack/gommon/color"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/x/mongo/driver/connstring"
)

func NewDB(cfg config.MongoDB, ctx context.Context, wg *sync.WaitGroup) (db *mongo.Database) {
	conn, err := connstring.Parse(cfg.URI)
	if err != nil {
		panic(err)
	}

	if conn.Database == "" {
		panic("mongouri database is empty")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(conn.String()))
	if err != nil {
		panic(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		panic(err)
	}

	db = client.Database(conn.Database)

	color.Println(color.Green(fmt.Sprintf("⇨ connected to mongodb on %s\n", conn.Database)))

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	wg.Add(1)
	go func() {
		defer wg.Done()
		sig := <-sigs
		startProcessTime := time.Now()
		log.Info(ctx, "mongodb disconnecting", sig)
		err := client.Disconnect(ctx)
		if err != nil {
			log.Error(ctx, "mongodb failed to disconnect", err)
			return
		}
		log.TInfo(ctx, "mongodb disconnected", startProcessTime, err)
	}()

	return
}
