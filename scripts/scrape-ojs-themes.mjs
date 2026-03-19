import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_JSON = path.join(__dirname, '..', 'src', 'data', 'ojs-themes.json');
const IMG_DIR = path.join(__dirname, '..', 'public', 'themes');
const URL = 'https://openjournaltheme.com/product-category/ojs-3-themes/';

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

function chooseLargeFromSrcset(srcset) {
  if (!srcset) return null;
  const parts = srcset.split(',').map(s => s.trim().split(' ')[0]);
  return parts.pop() || null;
}

function slugFromUrl(u) {
  try {
    const { pathname } = new URL(u);
    const parts = pathname.split('/').filter(Boolean);
    return parts[parts.length - 1];
  } catch {
    return u.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
  }
}

async function download(url, toPath) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
      'accept': 'image/*,*/*;q=0.8',
    },
  });
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(toPath, buf);
}

async function run() {
  ensureDir(path.dirname(OUT_JSON));
  ensureDir(IMG_DIR);
  const html = await fetchText(URL);
  const $ = cheerio.load(html);
  const items = [];
  $('ul.products li.product').each((_, el) => {
    const $el = $(el);
    const a = $el.find('a.woocommerce-LoopProduct-link').first();
    const url = a.attr('href');
    const img = a.find('img').first();
    const src = img.attr('src');
    const srcset = img.attr('srcset');
    const image = chooseLargeFromSrcset(srcset) || src;
    const title = $el.find('.woocommerce-loop-product__title').first().text().trim();
    const priceText = $el.find('.price').text().replace(/\s+/g, ' ').trim();
    if (!url || !image || !title) return;
    const slug = slugFromUrl(url);
    const ext = (image.split('.').pop() || 'jpg').split('?')[0];
    const filename = `${slug}.${ext}`;
    items.push({ title, url, image, priceText, slug, filename });
  });

  for (const it of items) {
    const dest = path.join(IMG_DIR, it.filename);
    try {
      if (!fs.existsSync(dest)) {
        await download(it.image, dest);
      }
      it.localImage = `/themes/${it.filename}`;
    } catch (e) {
      it.localImage = it.image; // fallback remote
      console.warn('Image download failed:', it.image, e.message);
    }
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify({ source: URL, scrapedAt: new Date().toISOString(), count: items.length, items }, null, 2));
  console.log(`Saved ${items.length} items to ${OUT_JSON}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
