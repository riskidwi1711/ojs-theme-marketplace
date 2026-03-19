package handler

import (
    "ojs-server/internal/infrastructure/container"
    "ojs-server/internal/usecase/settings"
)


type Handler struct {
	userHandler       *userHandler
	authHandler       *authHandler
	cartHandler       *cartHandler
	wishlistHandler   *wishlistHandler
	checkoutHandler   *checkoutHandler
    paymentHandler    *paymentHandler
	themeHandler      *themeHandler
	callbackHandler   *callbackHandler
    productHandler    *productHandler
    promoHandler      *promoHandler
    bannerHandler     *bannerHandler
    articleHandler    *articleHandler
    adminProductHandler *adminProductHandler
    adminOrderHandler   *adminOrderHandler
    adminAccountHandler *adminAccountHandler
    adminUploadHandler  *adminUploadHandler
    adminCategoryHandler *adminCategoryHandler
    categoryHandler     *categoryHandler
    adminTagHandler     *adminTagHandler
    tagHandler          *tagHandler
    adminSectionHandler *adminSectionHandler
    sectionHandler      *sectionHandler
    adminStatsHandler   *adminStatsHandler
    adminSettingsHandler *adminSettingsHandler
    voucherHandler      *voucherHandler
	homeHandler       *homeHandler
	newsletterHandler         *newsletterHandler
	chatHandler               *chatHandler
	adminEmailTemplateHandler *adminEmailTemplateHandler
	reviewHandler             *reviewHandler
	mediaHandler              *mediaHandler
}

func SetupHandler(container *container.Container) *Handler {
    return &Handler{
		userHandler:       NewUserHandler(container.UserService),
		authHandler:       NewAuthHandler(container.AuthService),
		cartHandler:       NewCartHandler(container.CartService),
		wishlistHandler:   NewWishlistHandler(container.WishlistService),
		checkoutHandler:   NewCheckoutHandler(container.CheckoutService, container.BrevoWrapper, container.MinioWrapper, container.MinIOBucket, container.XenditWrapper, container.OrderRepo),
        paymentHandler:    NewPaymentHandler(container.XenditWrapper, container.CheckoutService, container.OrderRepo),
		themeHandler:      NewThemeHandler(container.ProductService),
		callbackHandler:   NewCallbackHandler(container.CallbackService),
        productHandler:    NewProductHandler(container.ProductService),
        promoHandler:      NewPromoHandler(container.PromoService),
        bannerHandler:     NewBannerHandler(container.BannerService),
        articleHandler:    NewArticleHandler(container.ArticleService),
        adminProductHandler: NewAdminProductHandler(container.ProductService, container.CategoryService, container.SectionService, container.TagService, container.MinioWrapper, container.MinIOBucket),
        adminOrderHandler:   NewAdminOrderHandler(container.CheckoutService),
        adminAccountHandler: NewAdminAccountHandler(container.AccountRepo),
        adminUploadHandler:  NewAdminUploadHandler(container.MinioWrapper, container.MinIOBucket),
        adminCategoryHandler: NewAdminCategoryHandler(container.CategoryService),
        categoryHandler:     NewCategoryHandler(container.CategoryService),
        adminTagHandler:     NewAdminTagHandler(container.TagService),
        tagHandler:          NewTagHandler(container.TagService),
        adminSectionHandler: NewAdminSectionHandler(container.SectionService),
        sectionHandler:      NewSectionHandler(container.SectionService),
        adminStatsHandler:   NewAdminStatsHandler(container.OrderRepo, container.ProductRepo, container.AccountRepo),
        adminSettingsHandler: NewAdminSettingsHandler(settings.NewService(container.SettingsRepo), container.TelegramWrapper),
        voucherHandler:      NewVoucherHandler(container.VoucherService),
		homeHandler:       NewHomeHandler(),
		newsletterHandler: NewNewsletterHandler(container.NewsletterRepo, container.BrevoWrapper),
		chatHandler:               NewChatHandler(container.ChatService, container.TelegramWrapper),
		adminEmailTemplateHandler: NewAdminEmailTemplateHandler(container.EmailTemplateRepo),
		reviewHandler:             NewReviewHandler(container.ReviewRepo),
		mediaHandler:              NewMediaHandler(container.MinioWrapper, container.MinIOBucket),
	}
}

func (h *Handler) Validate() *Handler {
	if h.userHandler == nil {
		panic("userHandler is nil")
	}
	if h.themeHandler == nil {
		panic("themeHandler is nil")
	}
	if h.authHandler == nil {
		panic("authHandler is nil")
	}
	if h.cartHandler == nil {
		panic("cartHandler is nil")
	}
	if h.wishlistHandler == nil {
		panic("wishlistHandler is nil")
	}
	if h.checkoutHandler == nil {
		panic("checkoutHandler is nil")
	}
	if h.paymentHandler == nil {
		panic("paymentHandler is nil")
	}
	if h.callbackHandler == nil {
		panic("callbackHandler is nil")
	}
    if h.productHandler == nil {
        panic("productHandler is nil")
    }
    if h.adminProductHandler == nil {
        panic("adminProductHandler is nil")
    }
    if h.adminOrderHandler == nil {
        panic("adminOrderHandler is nil")
    }
    if h.adminAccountHandler == nil {
        panic("adminAccountHandler is nil")
    }
    if h.adminUploadHandler == nil {
        panic("adminUploadHandler is nil")
    }
    if h.adminCategoryHandler == nil {
        panic("adminCategoryHandler is nil")
    }
    if h.categoryHandler == nil {
        panic("categoryHandler is nil")
    }
    if h.adminTagHandler == nil {
        panic("adminTagHandler is nil")
    }
    if h.tagHandler == nil {
        panic("tagHandler is nil")
    }
    if h.adminSectionHandler == nil {
        panic("adminSectionHandler is nil")
    }
    if h.sectionHandler == nil {
        panic("sectionHandler is nil")
    }
    return h
}
