package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// homeHandler serves static content: categories, banners, collections, blog.
type homeHandler struct{}

func NewHomeHandler() *homeHandler { return &homeHandler{} }

// GET /api/v1/categories
func (h *homeHandler) Categories(c echo.Context) error {
	data := []map[string]any{
		{"id": "jurnal-ilmiah", "label": "Jurnal Ilmiah", "slug": "jurnal-ilmiah", "bg": "from-blue-50 to-blue-100", "color": "text-blue-600"},
		{"id": "konferensi", "label": "Konferensi", "slug": "konferensi", "bg": "from-purple-50 to-purple-100", "color": "text-purple-600"},
		{"id": "open-access", "label": "Open Access", "slug": "open-access", "bg": "from-green-50 to-green-100", "color": "text-green-600"},
		{"id": "sains-teknik", "label": "Sains & Teknik", "slug": "sains-teknik", "bg": "from-cyan-50 to-cyan-100", "color": "text-cyan-600"},
		{"id": "kedokteran", "label": "Kedokteran", "slug": "kedokteran", "bg": "from-red-50 to-red-100", "color": "text-red-600"},
		{"id": "hukum-sosial", "label": "Hukum & Sosial", "slug": "hukum-sosial", "bg": "from-amber-50 to-amber-100", "color": "text-amber-600"},
		{"id": "multi-journal", "label": "Multi-Journal", "slug": "multi-journal", "bg": "from-indigo-50 to-indigo-100", "color": "text-indigo-600"},
		{"id": "repository", "label": "Repository", "slug": "repository", "bg": "from-gray-50 to-gray-100", "color": "text-gray-600"},
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": data})
}

// GET /api/v1/banners
func (h *homeHandler) Banners(c echo.Context) error {
	data := []map[string]any{
		{
			"id": "bundle", "type": "bundle",
			"title": "Bundle 5 Tema", "sub": "Paket Hemat",
			"price": "$59.9", "note": "Hemat hingga 40%",
			"bg": "from-violet-600 to-purple-800",
		},
		{
			"id": "starter", "type": "free",
			"title": "STARTER THEME", "sub": "Gratis selamanya",
			"badge": "$0", "originalBadge": "$15", "note": "OJS 3.3+",
			"bg": "from-[#1a1a2e] to-[#16213e]",
		},
		{
			"id": "custom", "type": "custom",
			"title": "Tema Kustom", "sub": "Custom Development",
			"price": "Dari $299", "note": "Sesuai kebutuhan jurnal Anda",
			"bg": "from-amber-50 to-yellow-100",
		},
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": data})
}

// GET /api/v1/collections
func (h *homeHandler) Collections(c echo.Context) error {
	data := []map[string]any{
		{
			"id": "new-2024", "label": "Rilis Tema Terbaru 2024", "sub": "Desain segar & modern",
			"tag": "Baru", "tagBg": "bg-[var(--color-primary)] text-black",
			"bg": "from-violet-800 to-purple-900", "textColor": "text-white", "subColor": "text-purple-300",
		},
		{
			"id": "bootstrap3", "label": "Koleksi Bootstrap 3 OJS", "sub": "Mulai dari $9.9",
			"tag": "Populer", "tagBg": "bg-green-500 text-white",
			"bg": "from-amber-50 to-orange-100", "textColor": "text-gray-900", "subColor": "text-gray-600",
		},
		{
			"id": "ojs34-compat", "label": "Paket OJS 3.4 Compatible – Hemat 30%", "sub": "Support terjamin",
			"tag": "Sale", "tagBg": "bg-red-500 text-white",
			"bg": "from-sky-50 to-blue-100", "textColor": "text-gray-900", "subColor": "text-gray-600",
		},
		{
			"id": "free", "label": "Tema Gratis OJSMart. Coba Sekarang!", "sub": "100% free, no credit card",
			"tag": "Gratis", "tagBg": "bg-blue-500 text-white",
			"bg": "from-green-50 to-emerald-100", "textColor": "text-gray-900", "subColor": "text-gray-600",
		},
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": data})
}

// GET /api/v1/blog
func (h *homeHandler) Blog(c echo.Context) error {
	data := []map[string]any{
		{
			"id": "install-tema", "slug": "install-tema-ojs",
			"title":    "Cara Install Tema OJS 3.x dari Awal",
			"excerpt":  "Panduan lengkap instalasi tema OJS mulai dari download, upload via FTP, hingga aktivasi di panel admin. Cocok untuk pemula.",
			"date":     "Tutorial · 14 Maret 2026",
			"tag":      "Tutorial",
			"tagColor": "bg-blue-100 text-blue-700",
			"bg":       "from-blue-50 to-indigo-100",
		},
		{
			"id": "migrasi-ojs", "slug": "migrasi-ojs-33-34",
			"title":    "Panduan Migrasi OJS 3.3 ke OJS 3.4",
			"excerpt":  "Langkah demi langkah migrasi versi OJS tanpa kehilangan data artikel, reviewer, dan pengaturan jurnal Anda.",
			"date":     "Tutorial · 10 Maret 2026",
			"tag":      "Migrasi",
			"tagColor": "bg-amber-100 text-amber-700",
			"bg":       "from-amber-50 to-orange-100",
		},
		{
			"id": "plugin-ojs", "slug": "plugin-ojs-terbaik",
			"title":    "10 Plugin OJS Terbaik untuk Jurnal Anda",
			"excerpt":  "Rekomendasi plugin OJS paling berguna: DOI, Plagiarism Check, Google Scholar indexing, dan plugin aksesibilitas terpopuler.",
			"date":     "Review · 5 Maret 2026",
			"tag":      "Plugin",
			"tagColor": "bg-green-100 text-green-700",
			"bg":       "from-green-50 to-emerald-100",
		},
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": data})
}
