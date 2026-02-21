# Akku Electronics - Monthly SEO Maintenance Checklist

Use this checklist every month to keep technical SEO, indexing, and content health in good shape.

## 1) Technical SEO Health (Week 1)

- [ ] Verify sitemap is live: https://akkuelectronics.in/sitemap.xml
- [ ] Verify robots is live: https://akkuelectronics.in/robots.txt
- [ ] Confirm robots references only valid sitemap URLs.
- [ ] Re-run local tag audit for all HTML pages:
  - Title
  - Meta description
  - Canonical
  - H1
  - Open Graph (title/description/image/url)
  - Twitter (card/title/description/image)
  - JSON-LD schema
  - viewport
  - html lang
- [ ] Check for 404 pages and broken internal links.
- [ ] Check mixed-content issues (http resources on https pages).
- [ ] Validate mobile usability on top pages.

## 2) Google Search Console (Week 1)

- [ ] Open Indexing > Pages and review:
  - Not indexed
  - Crawled - currently not indexed
  - Duplicate/canonical issues
- [ ] Re-submit sitemap if new pages were added.
- [ ] Request indexing for:
  - Homepage
  - Services page
  - Shop page
  - New blog posts
  - New guides
- [ ] Review Enhancements / Rich Results and fix schema errors.
- [ ] Review Core Web Vitals and note any regressions.

## 3) Content SEO (Week 2)

- [ ] Publish at least 1-2 high-quality blog posts (if possible).
- [ ] Add internal links from new posts to service pages.
- [ ] Add internal links from service pages to related blog posts.
- [ ] Ensure each new page has unique title and description.
- [ ] Ensure each new page has one clear H1.
- [ ] Add/validate canonical for each new page.
- [ ] Add/validate JSON-LD (Article, Service, Product, WebPage/CollectionPage as relevant).

## 4) Local SEO (Week 3)

- [ ] Update Google Business Profile with latest services/photos.
- [ ] Add at least 3 fresh photos (repairs, workspace, products).
- [ ] Post one update/offer on GBP.
- [ ] Check NAP consistency (Name, Address, Phone) across pages.
- [ ] Ensure contact details are unchanged and correct.

## 5) Conversion + UX SEO (Week 3)

- [ ] Check top landing pages for clear CTA buttons.
- [ ] Ensure WhatsApp links work on mobile and desktop.
- [ ] Verify Shop -> Payment -> Invoice flow works fully.
- [ ] Confirm noindex pages stay noindex (payment/invoice).
- [ ] Test navigation links (including Guides, Blog, Firmwares).

## 6) Performance Basics (Week 4)

- [ ] Compress oversized images before upload.
- [ ] Use modern image formats where possible.
- [ ] Remove unused scripts/styles on pages where possible.
- [ ] Re-check Lighthouse for key pages (mobile + desktop).
- [ ] Track any drop in performance score month-over-month.

## 7) Monthly Reporting Snapshot (Week 4)

- [ ] Record:
  - Indexed pages count
  - Impressions
  - Clicks
  - CTR
  - Avg position
- [ ] List newly published pages.
- [ ] List pages that gained/declined in impressions.
- [ ] Define top 3 action items for next month.

---

## Quick Priority URLs for routine checks

- https://akkuelectronics.in/
- https://akkuelectronics.in/services.html
- https://akkuelectronics.in/firmwares.html
- https://akkuelectronics.in/shop.html
- https://akkuelectronics.in/product-detail.html
- https://akkuelectronics.in/blog/index.html
- https://akkuelectronics.in/guides/index.html

---

## Optional Automation Ideas (Future)

- Create a script to auto-audit HTML meta tags monthly.
- Auto-generate sitemap from all indexable HTML files.
- Add CI check to fail if canonical/title/description is missing on new pages.
