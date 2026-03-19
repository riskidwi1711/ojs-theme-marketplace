package container

import (
	"context"
	"os"
	"sync"

	"ojs-server/internal/config"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/infrastructure/brevo"
	"ojs-server/internal/infrastructure/minio"
	mongodb "ojs-server/internal/infrastructure/mongo"
	"ojs-server/internal/infrastructure/telegram"
	"ojs-server/internal/infrastructure/xendit"
	"ojs-server/internal/pkg/log"
	"ojs-server/internal/usecase/article"
	"ojs-server/internal/usecase/auth"
	"ojs-server/internal/usecase/banner"
	"ojs-server/internal/usecase/callback"
	"ojs-server/internal/usecase/cart"
	"ojs-server/internal/usecase/category"
	chatuc "ojs-server/internal/usecase/chat"
	"ojs-server/internal/usecase/checkout"
	"ojs-server/internal/usecase/product"
	"ojs-server/internal/usecase/promo"
	"ojs-server/internal/usecase/section"
	"ojs-server/internal/usecase/tag"
	"ojs-server/internal/usecase/user"
	"ojs-server/internal/usecase/voucher"
	"ojs-server/internal/usecase/wishlist"
)

type Container struct {
	Config            *config.DefaultConfig
	PostgresqlDB      *config.PostgreSQLDB
	AuthService       auth.Service
	CartService       cart.Service
	WishlistService   wishlist.Service
	CheckoutService   checkout.Service
	UserService       user.Service
	XenditWrapper     xendit.Wrapper
	MinioWrapper      minio.Wrapper
	CallbackService   callback.Service
	ProductService    product.Service
	PromoService      promo.Service
	BannerService     banner.Service
	ArticleService    article.Service
	CategoryService   category.Service
	TagService        tag.Service
	SectionService    section.Service
	VoucherService    voucher.Service
	NewsletterRepo    repositories.NewsletterRepo
	EmailTemplateRepo repositories.EmailTemplateRepo
	ReviewRepo        repositories.ReviewRepo
	ChatService       chatuc.Service
	TelegramWrapper   telegram.Wrapper
	BrevoWrapper      brevo.Wrapper
	// Expose repos for admin handlers needing raw access
	AccountRepo  repositories.AccountRepo
	OrderRepo    repositories.OrderRepo
	ProductRepo  repositories.ProductRepo
	SettingsRepo repositories.SettingsRepo
	MinioClient  *minio.MinIOClient
	MinIOBucket  string
}

func (c *Container) Validate() *Container {
	if c.Config == nil {
		panic("Config is nil")
	}
	if c.UserService == nil {
		panic("UserService is nil")
	}
	if c.WishlistService == nil {
		panic("WishlistService is nil")
	}
	return c
}

func New(testingEnv ...string) *Container {
	if len(testingEnv) > 0 {
		config.Load(os.Getenv("env"), testingEnv[0])
	} else {
		config.Load(os.Getenv("env"), ".env")
	}

	defConfig := &config.DefaultConfig{
		Apps: config.Apps{
			Name:     config.GetString("appName"),
			Address:  config.GetString("address"),
			HttpPort: config.GetString("port"),
		},
	}
	mongoCfg := &config.MongoDB{
		URI: config.GetString("sa.mongodb.uri"),
	}

	xenditCfg := &config.Xendit{
		APIHost:  config.GetString("xendit.api.host"),
		KeyName:  config.GetString("xendit.api.keyName"),
		KeyToken: config.GetString("xendit.api.keyToken"),
	}

	telegramCfg := config.Telegram{
		BotToken:      config.GetString("telegram.bot.token"),
		GroupID:       config.GetInt64("telegram.group.id"),
		WebhookSecret: config.GetString("telegram.webhook.secret"),
	}

	minioCfg := config.MinIO{
		Endpoint:        config.GetString("minio.endpoint"),
		AccessKeyID:     config.GetString("minio.accessKeyID"),
		SecretAccessKey: config.GetString("minio.secretAccessKey"),
		BucketName:      config.GetString("minio.bucketName"),
		UseSSL:          config.GetBool("minio.useSSL"),
		Region:          config.GetString("minio.region"),
	}

	log.New()

	ctx := context.Background()
	var wg = sync.WaitGroup{}
	mainMongo := mongodb.NewDB(*mongoCfg, ctx, &wg)

	// * Repositories
	userRepo := repositories.NewUser(mainMongo)
	accountRepo := repositories.NewAccount(mainMongo)
	cartRepo := repositories.NewCart(mainMongo)
	wishlistRepo := repositories.NewWishlist(mainMongo)
	orderRepo := repositories.NewOrder(mainMongo)
	productRepo := repositories.NewProductMongo(mainMongo)
	settingsRepo := repositories.NewSettings(mainMongo)
	categoryRepo := repositories.NewCategory(mainMongo)
	tagRepo := repositories.NewTag(mainMongo)
	sectionRepo := repositories.NewSection(mainMongo)
	newsletterRepo := repositories.NewNewsletter(mainMongo)
	emailTemplateRepo := repositories.NewEmailTemplate(mainMongo)
	reviewRepo := repositories.NewReview(mainMongo)
	promoRepo := repositories.NewPromoMongo(mainMongo)
	bannerRepo := repositories.NewBanner(mainMongo)
	articleRepo := repositories.NewArticle(mainMongo)
	voucherRepo := repositories.NewVoucherMongo(mainMongo)

	// * Wrappers
	xenditWrapper := xendit.New(*xenditCfg)
	telegramWrapper := telegram.New(telegramCfg)
	minioWrapper := minio.New(minioCfg)
	brevoWrapper := brevo.New(config.GetString("brevo.api.key"))
	brevoWrapper.SetTemplateRepo(emailTemplateRepo)
	brevoWrapper.SetSettingsRepo(settingsRepo)

	// Seed default email templates (only inserts if key doesn't exist yet)
	for _, tpl := range brevo.DefaultTemplates() {
		if existing, err := emailTemplateRepo.GetByKey(ctx, tpl.Key); err == nil && existing == nil {
			_ = emailTemplateRepo.Save(ctx, tpl)
		}
	}

	// Initialize MinIO bucket and set public-read policy for images
	minioClient := minio.NewMinIOClient(minioCfg)
	if err := minioClient.Initialize(ctx); err != nil {
		log.Warn(ctx, "minio init", "err", err)
	}

	// * Services
	userService := user.NewService(userRepo)
	authService := auth.NewService(accountRepo)
	cartService := cart.NewService(cartRepo)
	wishlistService := wishlist.NewService(wishlistRepo)
	voucherService := voucher.NewService(voucherRepo, orderRepo)
	checkoutService := checkout.NewService(cartRepo, orderRepo, xenditWrapper, voucherService)
	callbackService := callback.NewService(orderRepo, brevoWrapper)
	productService := product.NewService(productRepo, reviewRepo)
	promoService := promo.NewService(promoRepo)
	bannerService := banner.NewService(bannerRepo)
	articleService := article.NewService(articleRepo)
	categoryService := category.NewService(categoryRepo)
	tagService := tag.NewService(tagRepo)
	sectionService := section.NewService(sectionRepo)

	// * Chat
	chatRepo := repositories.NewChat(mainMongo)
	chatService := chatuc.NewService(chatRepo, telegramWrapper)

	// Override telegram config with DB values if present (admin may have changed them).
	if dbSettings, err := settingsRepo.GetSite(ctx); err == nil && dbSettings != nil {
		if dbSettings.TgBotToken != "" || dbSettings.TgGroupID != 0 {
			telegramWrapper.Reconfigure(dbSettings.TgBotToken, dbSettings.TgGroupID, dbSettings.TgWebhookSecret)
		}
	}

	// * Brokers

	// * Workers

	container := &Container{
		Config:            defConfig,
		AccountRepo:       accountRepo,
		AuthService:       authService,
		CartService:       cartService,
		WishlistService:   wishlistService,
		CheckoutService:   checkoutService,
		UserService:       userService,
		XenditWrapper:     xenditWrapper,
		MinioWrapper:      minioWrapper,
		CallbackService:   callbackService,
		ProductService:    productService,
		PromoService:      promoService,
		BannerService:     bannerService,
		ArticleService:    articleService,
		CategoryService:   categoryService,
		TagService:        tagService,
		SectionService:    sectionService,
		VoucherService:    voucherService,
		NewsletterRepo:    newsletterRepo,
		EmailTemplateRepo: emailTemplateRepo,
		ReviewRepo:        reviewRepo,
		ChatService:       chatService,
		TelegramWrapper:   telegramWrapper,
		BrevoWrapper:      brevoWrapper,
		OrderRepo:         orderRepo,
		ProductRepo:       productRepo,
		SettingsRepo:      settingsRepo,
		MinioClient:       minioClient,
		MinIOBucket:       minioCfg.BucketName,
	}
	container.Validate()
	return container

}
