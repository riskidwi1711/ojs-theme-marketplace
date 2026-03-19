package repositories

import (
    "context"
    "strings"
    "strconv"

    "ojs-server/internal/domain/entities"
)

type ProductRepo interface {
    GetAll() []entities.Product
    GetBySection(section string) []entities.Product
    GetByCategory(category string) []entities.Product
    GetByID(id string) (*entities.Product, error)
    Create(p entities.Product) (*entities.Product, error)
    Update(id string, p entities.Product) (*entities.Product, error)
    Delete(id string) error
    ListFilter(ctx context.Context, f ProductFilter) (items []entities.Product, total int, err error)
}

type productRepo struct {
	data []entities.Product
}

func NewProduct() ProductRepo {
	return &productRepo{data: seedProducts()}
}

func (r *productRepo) GetAll() []entities.Product { return r.data }

func (r *productRepo) GetBySection(section string) []entities.Product {
	if section == "" {
		return r.data
	}
	var out []entities.Product
	for _, p := range r.data {
		if p.Section == section {
			out = append(out, p)
		}
	}
	return out
}

func (r *productRepo) GetByCategory(category string) []entities.Product {
	if category == "" {
		return r.data
	}
	var out []entities.Product
	for _, p := range r.data {
		if strings.EqualFold(p.Category, category) {
			out = append(out, p)
		}
	}
	return out
}

func (r *productRepo) GetByID(id string) (*entities.Product, error) {
	for _, p := range r.data {
		if p.ID == id || p.Slug == id {
			cp := p
			return &cp, nil
		}
	}
	return nil, errNotFound("product not found")
}

func (r *productRepo) Create(p entities.Product) (*entities.Product, error) {
    // Basic slugify from name if missing
    if p.Slug == "" {
        p.Slug = slugify(p.Name)
    }
    if p.ID == "" {
        p.ID = p.Slug
    }
    // ensure unique id/slug
    base := p.Slug
    i := 1
    for {
        exists := false
        for _, e := range r.data {
            if e.ID == p.ID || e.Slug == p.Slug {
                exists = true
                break
            }
        }
        if !exists { break }
        i++
        p.Slug = base + "-" + itoa(i)
        p.ID = p.Slug
    }
    r.data = append(r.data, p)
    cp := p
    return &cp, nil
}

func (r *productRepo) Update(id string, p entities.Product) (*entities.Product, error) {
    for idx, e := range r.data {
        if e.ID == id || e.Slug == id {
            // preserve ID/Slug if not provided
            if p.ID == "" { p.ID = e.ID }
            if p.Slug == "" { p.Slug = e.Slug }
            if p.Name == "" { p.Name = e.Name }
            if p.Price == 0 { p.Price = e.Price }
            if p.Original == 0 { p.Original = e.Original }
            if p.Rating == 0 { p.Rating = e.Rating }
            if p.Reviews == 0 { p.Reviews = e.Reviews }
            if p.Compat == "" { p.Compat = e.Compat }
            if p.Category == "" { p.Category = e.Category }
            if p.Section == "" { p.Section = e.Section }
            if p.Emoji == "" { p.Emoji = e.Emoji }
            if p.Bg == "" { p.Bg = e.Bg }
            if p.Badge == "" { p.Badge = e.Badge }
            if p.BadgeColor == "" { p.BadgeColor = e.BadgeColor }
            if p.Description == "" { p.Description = e.Description }
            if p.Image == "" { p.Image = e.Image }
            if len(p.Gallery) == 0 { p.Gallery = e.Gallery }
            if p.LivePreviewURL == "" { p.LivePreviewURL = e.LivePreviewURL }
            if p.PriceText == "" { p.PriceText = e.PriceText }
            r.data[idx] = p
            cp := p
            return &cp, nil
        }
    }
    return nil, errNotFound("product not found")
}

func (r *productRepo) Delete(id string) error {
    for idx, e := range r.data {
        if e.ID == id || e.Slug == id {
            r.data = append(r.data[:idx], r.data[idx+1:]...)
            return nil
        }
    }
    return errNotFound("product not found")
}

// helpers
// slugify centralized in slugutil.go

func itoa(i int) string { return strconv.Itoa(i) }

// Default in-memory implementation for ListFilter (fallback)
type ProductFilter struct {
    Section  string
    Category string
    Tags     []string
    Limit    int
    Page     int
    Sort     string
    Query    string
}

func (r *productRepo) ListFilter(_ context.Context, f ProductFilter) ([]entities.Product, int, error) {
    items := r.GetAll()
    if f.Section != "" {
        var out []entities.Product
        for _, p := range items { if p.Section == f.Section { out = append(out, p) } }
        items = out
    }
    if f.Category != "" {
        var out []entities.Product
        for _, p := range items { if strings.EqualFold(p.Category, f.Category) { out = append(out, p) } }
        items = out
    }
    if len(f.Tags) > 0 {
        wants := map[string]bool{}
        for _, t := range f.Tags { wants[strings.TrimSpace(t)] = true }
        var out []entities.Product
        for _, p := range items {
            ok := false
            for _, tg := range p.Tags { if wants[tg] { ok = true; break } }
            if ok { out = append(out, p) }
        }
        items = out
    }
    // Query search on name
    if f.Query != "" {
        var out []entities.Product
        q := strings.ToLower(f.Query)
        for _, p := range items {
            if strings.Contains(strings.ToLower(p.Name), q) || strings.Contains(strings.ToLower(p.Slug), q) {
                out = append(out, p)
            }
        }
        items = out
    }
    total := len(items)
    // simple pagination
    limit := f.Limit; if limit <= 0 { limit = 20 }
    page := f.Page; if page <= 0 { page = 1 }
    start := (page-1)*limit; if start > total { start = total }
    end := start+limit; if end > total { end = total }
    return items[start:end], total, nil
}

// errNotFound is a simple sentinel
type notFoundError struct{ msg string }

func (e notFoundError) Error() string { return e.msg }
func errNotFound(msg string) error    { return notFoundError{msg: msg} }

// seedProducts returns the static marketplace product catalogue.
func seedProducts() []entities.Product {
	return []entities.Product{
		// ── Best Sellers ──────────────────────────────────────────────────────────
		{ID: "scholar", Slug: "scholar", Name: "Scholar – Clean Academic Journal OJS", Price: 19, Original: 29, Rating: 4.5, Reviews: 312, Compat: "OJS 3.3+", Emoji: "📘", Bg: "from-blue-50 to-blue-100", Badge: "Terlaris", BadgeColor: "bg-red-500 text-white", Section: "bestsellers", Category: "jurnal-ilmiah"},
		{ID: "akademia", Slug: "akademia", Name: "Akademia – Open Access Scientific Portal", Price: 25, Rating: 5, Reviews: 198, Compat: "OJS 3.4+", Emoji: "🔬", Bg: "from-cyan-50 to-cyan-100", Section: "bestsellers", Category: "open-access"},
		{ID: "primus", Slug: "primus", Name: "Primus – Minimalist Journal Theme", Price: 15, Original: 22, Rating: 4.5, Reviews: 274, Compat: "OJS 3.x", Emoji: "📄", Bg: "from-indigo-50 to-indigo-100", Badge: "Sale", BadgeColor: "bg-orange-500 text-white", Section: "bestsellers", Category: "jurnal-ilmiah"},
		{ID: "lexica", Slug: "lexica", Name: "Lexica – Law Review Journal Template", Price: 18, Rating: 5, Reviews: 87, Compat: "OJS 3.3+", Emoji: "⚖️", Bg: "from-amber-50 to-amber-100", Section: "bestsellers", Category: "hukum-sosial"},
		{ID: "medicus", Slug: "medicus", Name: "Medicus – Medical & Health Journal", Price: 22, Original: 30, Rating: 4, Reviews: 143, Compat: "OJS 3.4+", Emoji: "🏥", Bg: "from-red-50 to-pink-100", Badge: "New", BadgeColor: "bg-blue-500 text-white", Section: "bestsellers", Category: "kedokteran"},
		{ID: "cosmos", Slug: "cosmos", Name: "Cosmos – Astronomy & Physics Journal", Price: 20, Rating: 4.5, Reviews: 56, Compat: "OJS 3.x", Emoji: "⭐", Bg: "from-violet-50 to-purple-100", Section: "bestsellers", Category: "sains-teknik"},

		// ── New Arrivals ──────────────────────────────────────────────────────────
		{ID: "nexus", Slug: "nexus", Name: "Nexus – Multi-Journal Platform OJS", Price: 35, Rating: 5, Reviews: 24, Compat: "OJS 3.4+", Emoji: "🗞️", Bg: "from-slate-50 to-gray-100", Badge: "New", BadgeColor: "bg-green-500 text-white", Section: "new", Category: "multi-journal"},
		{ID: "clarity", Slug: "clarity", Name: "Clarity – Open Access Minimal Theme", Price: 12, Rating: 4, Reviews: 41, Compat: "OJS 3.3+", Emoji: "🔓", Bg: "from-emerald-50 to-green-100", Section: "new", Category: "open-access"},
		{ID: "summit", Slug: "summit", Name: "Summit – Conference & Proceedings", Price: 28, Original: 38, Rating: 4.5, Reviews: 67, Compat: "OJS 3.x", Emoji: "🎤", Bg: "from-orange-50 to-red-50", Badge: "Sale", BadgeColor: "bg-red-500 text-white", Section: "new", Category: "konferensi"},
		{ID: "archiva", Slug: "archiva", Name: "Archiva – Repository & Digital Library", Price: 30, Rating: 4, Reviews: 19, Compat: "OJS 3.4+", Emoji: "🗃️", Bg: "from-gray-50 to-zinc-100", Section: "new", Category: "repository"},
		{ID: "spectrum", Slug: "spectrum", Name: "Spectrum – Science & Technology Journal", Price: 17, Rating: 4.5, Reviews: 88, Compat: "OJS 3.3+", Emoji: "⚗️", Bg: "from-teal-50 to-cyan-100", Section: "new", Category: "sains-teknik"},
		{ID: "polis", Slug: "polis", Name: "Polis – Social Science & Humanities", Price: 16, Original: 24, Rating: 4, Reviews: 33, Compat: "OJS 3.x", Emoji: "🌍", Bg: "from-green-50 to-lime-100", Section: "new", Category: "hukum-sosial"},

		// ── Essential ─────────────────────────────────────────────────────────────
		{ID: "bootstrap3", Slug: "bootstrap3", Name: "Bootstrap3 OJS Classic Theme", Price: 9.90, Rating: 4, Reviews: 510, Compat: "OJS 3.x", Emoji: "🎨", Bg: "from-purple-50 to-violet-100", Badge: "Klasik", BadgeColor: "bg-purple-500 text-white", Section: "essential", Category: "jurnal-ilmiah"},
		{ID: "default-enhanced", Slug: "default-enhanced", Name: "Default Enhanced – OJS Starter", Price: 0, Rating: 4.5, Reviews: 1240, Compat: "OJS 3.x", Emoji: "⭐", Bg: "from-amber-50 to-yellow-100", Badge: "Gratis", BadgeColor: "bg-green-500 text-white", Section: "essential", Category: "jurnal-ilmiah"},
		{ID: "helios", Slug: "helios", Name: "Helios – Engineering Journal Theme", Price: 21, Original: 28, Rating: 4, Reviews: 76, Compat: "OJS 3.4+", Emoji: "⚙️", Bg: "from-orange-50 to-amber-100", Section: "essential", Category: "sains-teknik"},
		{ID: "aether", Slug: "aether", Name: "Aether – Interdisciplinary Journal", Price: 24, Rating: 5, Reviews: 45, Compat: "OJS 3.4+", Emoji: "🌐", Bg: "from-sky-50 to-blue-100", Badge: "New", BadgeColor: "bg-blue-500 text-white", Section: "essential", Category: "jurnal-ilmiah"},
		{ID: "terra", Slug: "terra", Name: "Terra – Agriculture & Environment", Price: 18, Rating: 4, Reviews: 29, Compat: "OJS 3.3+", Emoji: "🌱", Bg: "from-green-50 to-emerald-100", Section: "essential", Category: "sains-teknik"},
		{ID: "rhema", Slug: "rhema", Name: "Rhema – Theology & Religion Journal", Price: 14, Original: 20, Rating: 4.5, Reviews: 38, Compat: "OJS 3.x", Emoji: "📖", Bg: "from-rose-50 to-red-100", Badge: "Sale", BadgeColor: "bg-red-500 text-white", Section: "essential", Category: "jurnal-ilmiah"},
	}
}
