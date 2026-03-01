# 🎮 Akku Electronics - Gaming Console Repair Website

**Production website for gaming console repair services and support content**

---

## 📖 DOCUMENTATION

**Start Here:** [COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md)

This single comprehensive guide includes:
- ✅ Quick start (30 seconds)
- ✅ System overview
- ✅ Configuration
- ✅ Customer experience
- ✅ Developer reference
- ✅ Testing & deployment
- ✅ Troubleshooting
- ✅ FAQ

---

## 🚀 QUICK START

1. **Open Website:** https://akkuelectronics.in/
2. **Browse Services** from PlayStation / Xbox pages
3. **Use Contact Options** via phone, email, or WhatsApp
4. **Book Repair Support** directly with Akku Electronics

---

## 📊 WHAT'S INCLUDED

✅ **Service Pages** - Dedicated PlayStation/Xbox repair pages  
✅ **Contact Workflows** - Phone, email, and WhatsApp support  
✅ **Blog Content** - Technical posts and repair guides  
✅ **Analytics** - Website interaction tracking  
✅ **Mobile Optimized** - Works perfectly on all devices  
✅ **Security** - Form validation & error handling  
✅ **Debug Tools** - 8 console tools for testing  

---

## 🎯 KEY FEATURES

| Feature | Status |
|---------|--------|
| Service Discovery | ✅ |
| Contact Workflows | ✅ |
| Blog Publishing | ✅ |
| WhatsApp Messaging | ✅ |
| Analytics Tracking | ✅ |
| Mobile Responsive | ✅ |
| Production Ready | ✅ |

---

## 🧑‍💻 FOR DEVELOPERS

### Sitemap Generation

When you add a new blog post, regenerate both sitemaps with:

```bash
python generate_sitemaps.py
```

For Windows PowerShell:

```powershell
.\generate-sitemaps.ps1
```

This updates:
- `sitemap.xml`
- `sitemap-news.xml`
- `robots.txt` already points to both sitemap URLs.

### Link Validation

Check all local `href`/`src` links before deploy:

```powershell
.\check-links.ps1
```

A CI workflow also runs this automatically on every push and pull request:
- `.github/workflows/link-check.yml`

### Redirect Rules (SEO)

Server-side redirect mappings are in:
- `_redirects`

This maps old root URLs to new folder URLs using forced `301` rules.
If your host does not support `_redirects` (for example plain GitHub Pages),
the existing root redirect HTML pages still provide client-side fallback.

**Core JS Functions:** Available in `script.js` and page-level scripts  
**CSS:** Shared styles via `style.css` + `mobile.css`  
**HTML Integration:** Service, blog, and utility pages  

### Debug in Console

```javascript
// Check system status
DEBUG.showStatus()

// View all orders
DEBUG.showOrderHistory()

// Create sample order
DEBUG.createSampleOrder()

// Test messages
DEBUG.testWhatsApp()
DEBUG.testEmail()
```

See **[COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md)** for:
- All 50+ function reference
- Configuration options
- Deployment checklist
- Troubleshooting guide
- Complete API reference

---

## 📞 CONTACT

**Business:** akkuelectronics.nagpur@gmail.com  
**Phone:** +91 8956 389 723  
**WhatsApp:** https://wa.me/918956389723  
**Website:** https://akkuelectronics.in  

---

**Version:** 2.0 | **Status:** ✅ PRODUCTION READY | **Date:** Feb 19, 2026

**👉 Read [COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md) for full details**

