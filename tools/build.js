// Prerenders every page of the site (da at /, de at /de/, en at /en/) from src/template.html into public/.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..'), PUB = path.join(ROOT, 'public'), ORIGIN = 'https://unikt-ophold.dk';
const MIME = { '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
const template = () => fs.readFileSync(path.join(ROOT, 'src/template.html'));
const srv = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]), f = path.join(PUB, p);
  if (path.extname(p) && f.startsWith(PUB) && fs.existsSync(f) && fs.statSync(f).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); return fs.createReadStream(f).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(template());
});
const pathOf = (key, l) => (l === 'da' ? '' : '/' + l) + (!key ? '/' : '/' + key.split('~')[0] + '/' + (key.includes('~') ? key.split('~')[1] + '/' : ''));
(async () => {
  await new Promise(r => srv.listen(0, r));
  const base = 'http://localhost:' + srv.address().port;
  const browser = await chromium.launch(), page = await browser.newPage();
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.goto(base + '/'); await page.waitForFunction(() => window.__uoKeys);
  const keys = await page.evaluate(() => window.__uoKeys());
  // remove previously generated pages (keep fonts, img, robots, sitemap)
  for (const e of fs.readdirSync(PUB)) if (!['fonts', 'img', 'robots.txt', 'sitemap.xml', '_headers'].includes(e)) fs.rmSync(path.join(PUB, e), { recursive: true, force: true });
  const urls = [];
  for (const l of ['da', 'de', 'en']) for (const k of keys) {
    const u = pathOf(k, l);
    await page.goto(base + u); await page.waitForFunction(() => window.__uoKeys);
    const thin = await page.evaluate(() => !!window.__uoThin);
    const html = '<!DOCTYPE html>\n' + await page.evaluate(() => document.documentElement.outerHTML);
    const out = path.join(PUB, u, 'index.html'); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
    urls.push({ k, l, u, thin });
  }
  await browser.close(); srv.close();
  const idx = urls.filter(x => !x.thin);
  const keysIdx = [...new Set(idx.map(x => x.k))];
  const loc = x => ORIGIN + pathOf(x.k, x.l);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const x of idx) {
    xml += '  <url>\n    <loc>' + loc(x) + '</loc>\n';
    for (const l of ['da', 'de', 'en']) xml += '    <xhtml:link rel="alternate" hreflang="' + l + '" href="' + ORIGIN + pathOf(x.k, l) + '"/>\n';
    xml += '    <xhtml:link rel="alternate" hreflang="x-default" href="' + ORIGIN + pathOf(x.k, 'da') + '"/>\n  </url>\n';
  }
  fs.writeFileSync(path.join(PUB, 'sitemap.xml'), xml + '</urlset>\n');
  console.log('pages', urls.length, 'indexable', idx.length, 'keys', keys.length, 'errors', errors);
})();
