package handler

import (
	"ojs-server/internal/infrastructure/container"
	"time"

	"github.com/labstack/echo/v4"
	mw "github.com/labstack/echo/v4/middleware"
)

func SetupRouter(e *echo.Echo, cnt *container.Container) {
	h := SetupHandler(cnt).Validate()

	v1 := e.Group("/api/v1")
	{
		// ── Auth (public) ─────────────────────────────────────────────────────────
		auth := v1.Group("/auth")
		{
			// Basic rate limiters for auth endpoints
			loginLimiter := mw.RateLimiterWithConfig(mw.RateLimiterConfig{
				Store: mw.NewRateLimiterMemoryStoreWithConfig(mw.RateLimiterMemoryStoreConfig{
					Rate:      5,
					Burst:     10,
					ExpiresIn: time.Minute,
				}),
			})

			auth.POST("/register", h.authHandler.Register)
			auth.POST("/login", h.authHandler.Login, loginLimiter)
			auth.GET("/me", h.authHandler.Me)
			auth.POST("/logout", h.authHandler.Logout)
			auth.POST("/refresh", h.authHandler.Refresh)
			auth.PATCH("/change-password", h.authHandler.ChangePassword, AuthRequired())
		}

		// ── Admin (separated group) ───────────────────────────────────────────────
		admin := v1.Group("/admin")
		{
			// Stats & Settings
			admin.GET("/stats", h.adminStatsHandler.Get, AdminRequired())
			admin.GET("/settings", h.adminSettingsHandler.Get, AdminRequired())
			admin.PUT("/settings", h.adminSettingsHandler.Put, AdminRequired())
			// Admin auth with rate limiter
			adminLoginLimiter := mw.RateLimiterWithConfig(mw.RateLimiterConfig{
				Store: mw.NewRateLimiterMemoryStoreWithConfig(mw.RateLimiterMemoryStoreConfig{
					Rate:      5,
					Burst:     10,
					ExpiresIn: time.Minute,
				}),
			})
			admin.POST("/auth/login", h.authHandler.AdminLogin, adminLoginLimiter)

			// Example: protect admin resources with AdminRequired()
			products := admin.Group("/products", AdminRequired())
			{
				products.GET("", h.adminProductHandler.List)
				products.POST("", h.adminProductHandler.Create)
				products.GET("/:id", h.adminProductHandler.Get)
				products.PUT("/:id", h.adminProductHandler.Update)
				products.DELETE("/:id", h.adminProductHandler.Delete)
				products.POST("/:id/file", h.adminProductHandler.UploadFile)
			}
			users := admin.Group("/users", AdminRequired())
			{
				// Reuse existing user service for listing
				users.GET("", h.userHandler.GetAllUser)
			}
			accounts := admin.Group("/accounts", AdminRequired())
			{
				accounts.GET("", h.adminAccountHandler.List)
				accounts.POST("", h.adminAccountHandler.Create)
				accounts.PUT("/:email/role", h.adminAccountHandler.SetRole)
				accounts.PUT("/:email/status", h.adminAccountHandler.SetStatus)
			}

			uploads := admin.Group("/uploads", AdminRequired())
			{
				uploads.POST("", h.adminUploadHandler.Upload)
			}
			categories := admin.Group("/categories", AdminRequired())
			{
				categories.GET("", h.adminCategoryHandler.List)
				categories.POST("", h.adminCategoryHandler.Create)
				categories.PUT("/:slug", h.adminCategoryHandler.Update)
				categories.DELETE("/:slug", h.adminCategoryHandler.Delete)
			}
			tags := admin.Group("/tags", AdminRequired())
			{
				tags.GET("", h.adminTagHandler.List)
				tags.POST("", h.adminTagHandler.Create)
				tags.PUT("/:slug", h.adminTagHandler.Update)
				tags.DELETE("/:slug", h.adminTagHandler.Delete)
			}
			sections := admin.Group("/sections", AdminRequired())
			{
				sections.GET("", h.adminSectionHandler.List)
				sections.POST("", h.adminSectionHandler.Create)
				sections.PUT("/:slug", h.adminSectionHandler.Update)
				sections.DELETE("/:slug", h.adminSectionHandler.Delete)
			}
			orders := admin.Group("/orders", AdminRequired())
			{
				orders.GET("", h.adminOrderHandler.List)
				orders.GET("/:id", h.adminOrderHandler.Get)
				orders.PUT("/:id/status", h.adminOrderHandler.UpdateStatus)
			}
			adminChat := admin.Group("/chat", AdminRequired())
			{
				adminChat.GET("/sessions", h.chatHandler.AdminSessions)
				adminChat.GET("/messages", h.chatHandler.AdminMessages)
			}
			emailTpls := admin.Group("/email-templates", AdminRequired())
			{
				emailTpls.GET("", h.adminEmailTemplateHandler.List)
				emailTpls.GET("/:key", h.adminEmailTemplateHandler.Get)
				emailTpls.PUT("/:key", h.adminEmailTemplateHandler.Update)
				emailTpls.POST("/:key/reset", h.adminEmailTemplateHandler.Reset)
			}
		}

		// ── Payment ───────────────────────────────────────────────────────────────
		// payment := v1.Group("/payment")
		// {
		//     payment.POST("/invoice", h.paymentHandler.CreateInvoice)
		//     payment.POST("/invoice/from-order", h.paymentHandler.CreateInvoiceFromOrder, AuthRequired())
		// }

		// ── Cart ──────────────────────────────────────────────────────────────────
		cart := v1.Group("/cart", AuthRequired())
		{
			cart.GET("", h.cartHandler.Get)
			cart.POST("", h.cartHandler.Add)
			cart.DELETE("/:id", h.cartHandler.Remove)
		}

		// ── Wishlist ──────────────────────────────────────────────────────────────
		wishlist := v1.Group("/wishlist", AuthRequired())
		{
			wishlist.GET("", h.wishlistHandler.Get)
			wishlist.POST("", h.wishlistHandler.Add)
			wishlist.DELETE("/:id", h.wishlistHandler.Remove)
			wishlist.GET("/:id/check", h.wishlistHandler.Check)
		}

		// ── Checkout ──────────────────────────────────────────────────────────────
		v1.POST("/checkout", h.checkoutHandler.Place, AuthRequired())

		// ── Orders ────────────────────────────────────────────────────────────────
		orders := v1.Group("/orders", AuthRequired())
		{
			orders.GET("", h.checkoutHandler.ListOrders)
			orders.GET("/:id", h.checkoutHandler.GetOrder)
			orders.GET("/:id/invoice", h.checkoutHandler.DownloadInvoice)
			orders.GET("/:id/invoice-url", h.checkoutHandler.GetInvoiceURL)
			orders.GET("/:id/download", h.checkoutHandler.DownloadTheme)
		}

		// ── Users ─────────────────────────────────────────────────────────────────
		user := v1.Group("/users")
		{
			user.GET("", h.userHandler.GetAllUser)
		}

		// ── Media proxy (images served via server, bucket stays private) ──────────
		v1.GET("/media/*", h.mediaHandler.Serve)

		// ── Themes (scraped JSON) ─────────────────────────────────────────────────
		themes := v1.Group("/themes")
		{
			themes.GET("", h.themeHandler.GetThemes)
			themes.GET("/:slug", h.themeHandler.GetTheme)
		}

		// ── Products (marketplace catalogue) ─────────────────────────────────────
		products := v1.Group("/products")
		{
			products.GET("", h.productHandler.List)
			products.GET("/:id", h.productHandler.Get)
			products.GET("/:id/reviews", h.reviewHandler.List)
			products.POST("/:id/reviews", h.reviewHandler.Create, AuthRequired())
		}

		// ── Promos (daily deals) ─────────────────────────────────────────────────
		promos := v1.Group("/promos")
		{
			promos.GET("", h.promoHandler.GetPromos)
		}

		// ── Vouchers ─────────────────────────────────────────────────────────────
		voucherLimiter := mw.RateLimiterWithConfig(mw.RateLimiterConfig{
			Store: mw.NewRateLimiterMemoryStoreWithConfig(mw.RateLimiterMemoryStoreConfig{
				Rate:      10,
				Burst:     20,
				ExpiresIn: time.Minute,
			}),
		})
		vouchers := v1.Group("/vouchers")
		{
			vouchers.POST("/validate", h.voucherHandler.Validate, AuthRequired(), voucherLimiter)
		}
		adminVouchers := admin.Group("/vouchers", AdminRequired())
		{
			adminVouchers.GET("", h.voucherHandler.AdminList)
			adminVouchers.POST("", h.voucherHandler.AdminCreate)
			adminVouchers.PUT("/:id", h.voucherHandler.AdminUpdate)
			adminVouchers.DELETE("/:id", h.voucherHandler.AdminDelete)
		}

		// ── Banners (promo banners) ──────────────────────────────────────────────
		banners := v1.Group("/banners")
		{
			banners.GET("", h.bannerHandler.GetBanners)
		}
		adminBanners := admin.Group("/banners", AdminRequired())
		{
			adminBanners.GET("", h.bannerHandler.AdminList)
			adminBanners.POST("", h.bannerHandler.AdminCreate)
			adminBanners.PUT("/:id", h.bannerHandler.AdminUpdate)
			adminBanners.DELETE("/:id", h.bannerHandler.AdminDelete)
		}

		// ── Promos (admin) ────────────────────────────────────────────────────────
		adminPromos := admin.Group("/promos", AdminRequired())
		{
			adminPromos.GET("", h.promoHandler.AdminList)
			adminPromos.POST("", h.promoHandler.AdminCreate)
			adminPromos.PUT("/:id", h.promoHandler.AdminUpdate)
			adminPromos.DELETE("/:id", h.promoHandler.AdminDelete)
		}

		// ── Articles (admin) ──────────────────────────────────────────────────────
		adminArticles := admin.Group("/articles", AdminRequired())
		{
			adminArticles.GET("", h.articleHandler.AdminList)
			adminArticles.POST("", h.articleHandler.AdminCreate)
			adminArticles.PUT("/:slug", h.articleHandler.AdminUpdate)
			adminArticles.DELETE("/:slug", h.articleHandler.AdminDelete)
		}

		// ── Static home data ──────────────────────────────────────────────────────
		v1.GET("/categories", h.categoryHandler.List)
		v1.GET("/tags", h.tagHandler.List)
		v1.GET("/sections", h.sectionHandler.List)
		v1.GET("/collections", h.homeHandler.Collections)
		v1.GET("/blog", h.homeHandler.Blog)

		// ── Articles (blog posts) ────────────────────────────────────────────────
		articles := v1.Group("/articles")
		{
			articles.GET("", h.articleHandler.GetArticles)
			articles.GET("/:slug", h.articleHandler.GetArticle)
		}

		// ── Newsletter ────────────────────────────────────────────────────────────
		v1.POST("/newsletter", h.newsletterHandler.Subscribe)

		// ── Chat (live chat via Telegram topics) ──────────────────────────────────
		chat := v1.Group("/chat", AuthRequired())
		{
			chat.POST("/message", h.chatHandler.Send)
			chat.POST("/upload", h.chatHandler.Upload)
			chat.GET("/messages", h.chatHandler.Messages)
		}
		// Webhook is public but verified by X-Telegram-Bot-Api-Secret-Token header.
		v1.POST("/chat/webhook", h.chatHandler.Webhook)

		// ── Callbacks ────────────────────────────────────────────────────────────
		callback := v1.Group("/callback")
		{
			callback.POST("/xendit", h.callbackHandler.CallbackXendit)
		}
	}
}
