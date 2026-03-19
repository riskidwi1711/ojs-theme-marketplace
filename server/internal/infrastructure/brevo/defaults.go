package brevo

import "ojs-server/internal/domain/entities"

// DefaultTemplates returns the built-in template definitions keyed by template key.
// These are used as fallback when no DB template exists and are also seeded
// into the admin panel for first-time display.
func DefaultTemplates() map[string]entities.EmailTemplate {
	return map[string]entities.EmailTemplate{
		"order_confirmation": {
			Key:  "order_confirmation",
			Name: "Konfirmasi Pesanan",
			Subject: "Pesanan #{{.OrderID}} Diterima – OpenThemes",
			Body: `<p style="margin:0 0 8px;font-size:15px;color:#374151;">Halo 👋</p>
<p style="margin:0 0 24px;font-size:15px;color:#374151;">
  Terima kasih telah berbelanja di <strong>OpenThemes</strong>. Pesanan kamu sudah kami terima dan sedang menunggu pembayaran.
</p>
<div style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
  <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
    <span style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">No. Pesanan</span>
    <span style="font-size:13px;font-weight:700;color:#1c3b6d;">#{{.OrderID}}</span>
  </div>
  <div style="display:flex;justify-content:space-between;">
    <span style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">Tanggal</span>
    <span style="font-size:13px;color:#374151;">{{.Date}}</span>
  </div>
</div>
<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
  <thead>
    <tr style="background:#1c3b6d;">
      <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.06em;">Item</th>
      <th style="padding:10px 16px;text-align:right;font-size:12px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.06em;">Harga</th>
    </tr>
  </thead>
  <tbody>
    {{range .Items}}
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151;">{{.Name}}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151;text-align:right;">{{.Price}}</td>
    </tr>
    {{end}}
  </tbody>
  <tfoot>
    <tr style="background:#1c3b6d;">
      <td style="padding:12px 16px;font-size:14px;font-weight:800;color:#fff;">Total</td>
      <td style="padding:12px 16px;font-size:14px;font-weight:800;color:#fff;text-align:right;">{{.Total}}</td>
    </tr>
  </tfoot>
</table>
{{if .InvoiceURL}}<a href="{{.InvoiceURL}}" style="display:inline-block;background:linear-gradient(135deg,#1c3b6d,#0d2a52);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;">Bayar Sekarang →</a>{{else}}<a href="{{.SiteURL}}/account" style="display:inline-block;background:linear-gradient(135deg,#1c3b6d,#0d2a52);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;">Lihat Pesanan →</a>{{end}}`,
			Variables: []entities.TemplateVariable{
				{Key: "OrderID", Description: "ID pesanan (8 karakter terakhir)", Example: "A1B2C3D4"},
				{Key: "Date", Description: "Tanggal pesanan", Example: "19 March 2026"},
				{Key: "Items", Description: "Daftar item — {{range .Items}} → {{.Name}}, {{.Price}} {{end}}", Example: "OJS Bootstrap Theme – Rp250.000"},
				{Key: "Total", Description: "Total harga dalam Rupiah", Example: "Rp250.000"},
				{Key: "InvoiceURL", Description: "URL halaman pembayaran Xendit", Example: "https://checkout.xendit.co/web/xxx"},
				{Key: "SiteURL", Description: "URL website (dari Settings)", Example: "https://openthemes.id"},
				{Key: "SiteName", Description: "Nama website (dari Settings)", Example: "OpenThemes"},
				{Key: "SupportEmail", Description: "Email support (dari Settings)", Example: "support@openthemes.id"},
			},
		},

		"payment_success": {
			Key:     "payment_success",
			Name:    "Pembayaran Berhasil",
			Subject: "Pembayaran #{{.OrderID}} Berhasil – Unduh Tema Kamu!",
			Body: `<p style="margin:0 0 8px;font-size:15px;color:#374151;">Halo 👋</p>
<p style="margin:0 0 24px;font-size:15px;color:#374151;">
  Pembayaran untuk pesanan <strong>#{{.OrderID}}</strong> sudah kami terima. Tema kamu sudah siap untuk digunakan!
</p>
<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
  <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:.06em;">Tema yang dibeli</p>
  <ul style="margin:0;padding:0 0 0 4px;list-style:none;">
    {{range .Items}}<li style="padding:6px 0;font-size:14px;color:#374151;">📦 {{.Name}}</li>{{end}}
  </ul>
</div>
<p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
  Kamu bisa mengunduh tema kapan saja melalui halaman <strong>Dashboard → Unduhan</strong>.
</p>
<a href="{{.SiteURL}}/account" style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;">
  Unduh Tema Sekarang →
</a>
<p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
  Butuh bantuan? Hubungi kami di <a href="mailto:{{.SupportEmail}}" style="color:#1c3b6d;">{{.SupportEmail}}</a>
</p>`,
			Variables: []entities.TemplateVariable{
				{Key: "OrderID", Description: "ID pesanan (8 karakter terakhir)", Example: "A1B2C3D4"},
				{Key: "Items", Description: "Daftar item — {{range .Items}} → {{.Name}} {{end}}", Example: "OJS Bootstrap Theme"},
				{Key: "SiteURL", Description: "URL website (dari Settings)", Example: "https://openthemes.id"},
				{Key: "SupportEmail", Description: "Email support (dari Settings)", Example: "support@openthemes.id"},
			},
		},

		"newsletter_welcome": {
			Key:     "newsletter_welcome",
			Name:    "Selamat Datang Newsletter",
			Subject: "Selamat Datang! Ada Hadiah 15% OFF untuk Kamu 🎁",
			Body: `<p style="margin:0 0 24px;font-size:15px;color:#374151;">
  Terima kasih sudah bergabung dengan newsletter <strong>OpenThemes</strong>. Kamu adalah bagian dari komunitas kami sekarang!
</p>
<div style="background:linear-gradient(135deg,#1c3b6d,#0d2a52);border-radius:16px;padding:28px;margin-bottom:24px;text-align:center;">
  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;">Hadiah untuk kamu</p>
  <p style="margin:0 0 8px;font-size:42px;font-weight:900;color:#fff;">15% OFF</p>
  <p style="margin:0 0 16px;font-size:13px;color:rgba(255,255,255,.7);">untuk pembelian pertama di OpenThemes</p>
  <div style="display:inline-block;background:rgba(255,255,255,.12);border:2px dashed rgba(255,255,255,.3);border-radius:10px;padding:10px 24px;">
    <span style="font-size:22px;font-weight:900;font-family:monospace;letter-spacing:.15em;color:#fff;">WELCOME15</span>
  </div>
</div>
<p style="margin:0 0 24px;font-size:14px;color:#6b7280;text-align:center;">
  Gunakan kode di atas saat checkout. Berlaku untuk semua tema premium.
</p>
<a href="{{.SiteURL}}/themes" style="display:block;text-align:center;background:linear-gradient(135deg,#1c3b6d,#0d2a52);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;">
  Jelajahi Tema Sekarang →
</a>`,
			Variables: []entities.TemplateVariable{
				{Key: "Email", Description: "Alamat email subscriber", Example: "user@example.com"},
				{Key: "SiteURL", Description: "URL website (dari Settings)", Example: "https://openthemes.id"},
				{Key: "SiteName", Description: "Nama website (dari Settings)", Example: "OpenThemes"},
			},
		},
	}
}
