package repositories

import "strings"

// slugify normalizes a string into a URL-friendly slug.
// Kept unexported to keep surface consistent with existing calls in this package.
func slugify(s string) string {
    s = strings.ToLower(strings.TrimSpace(s))
    s = strings.ReplaceAll(s, " ", "-")
    out := make([]rune, 0, len(s))
    for _, r := range s {
        if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
            out = append(out, r)
        }
    }
    if len(out) == 0 { return "slug" }
    return string(out)
}

