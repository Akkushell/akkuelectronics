# Product Image Guide for Akku Electronics

## Recommended Image Specifications

### Image Dimensions
- **Primary Size:** 800px × 800px (1:1 square ratio)
- **High Quality:** 1200px × 1200px (for zoom/detail views)
- **Thumbnail:** 500px × 500px (auto-generated from primary)

### File Format & Quality
- **Format:** WebP (preferred) or JPG
- **Compression:** 80-85% quality
- **File Size:** Under 150KB per image
- **Background:** White or transparent

### Naming Convention
```
Product Folder: images/[product-folder]/
Image Names: [product-code][number].[extension]

Examples:
- images/ps4fat/ps4fat1.png
- images/ps4fat/ps4fat2.png
- images/ps4slim/ps4slim1.jpg
```

## Products Needing Images

### 1. PlayStation 2 USB Modded 250GB/320GB (ID: 37)
**Folder:** `images/ps2/` (use existing PS2 folder)
**Search Terms:** "PlayStation 2 console", "PS2 slim console"
**Images Needed:** 3-5 images
**Suggested Names:** 
- ps2hdd1.png (front view)
- ps2hdd2.png (with controllers)
- ps2hdd3.png (back ports)

### 2. PlayStation 3 Super Slim 500GB (ID: 38)
**Folder:** `images/ps3superslim/`
**Search Terms:** "PlayStation 3 Super Slim console", "PS3 Super Slim 500GB"
**Images Needed:** 3-5 images
**Suggested Names:**
- ps3ss1.png (front view)
- ps3ss2.png (top view showing disc slot)
- ps3ss3.png (with controller)

### 3. PlayStation 4 Fat 1TB (ID: 39)
**Folder:** `images/ps4fat/`
**Search Terms:** "PlayStation 4 original console", "PS4 launch model"
**Images Needed:** 3-5 images
**Suggested Names:**
- ps4fat1.png (front view)
- ps4fat2.png (side view)
- ps4fat3.png (with controller)

### 4. PlayStation 4 Slim 1TB (ID: 40)
**Folder:** `images/ps4slim/`
**Search Terms:** "PlayStation 4 Slim console", "PS4 Slim 1TB"
**Images Needed:** 3-5 images
**Suggested Names:**
- ps4slim1.png (front view)
- ps4slim2.png (comparison with controller)
- ps4slim3.png (ports view)

### 5. PlayStation 4 Pro 1TB (ID: 41)
**Folder:** `images/ps4pro/`
**Search Terms:** "PlayStation 4 Pro console", "PS4 Pro black"
**Images Needed:** 3-5 images
**Suggested Names:**
- ps4pro1.png (front view)
- ps4pro2.png (side view showing layers)
- ps4pro3.png (with controller)

### 6. Xbox 360 RGH 500GB (ID: 42)
**Folder:** `images/xbox360/`
**Search Terms:** "Xbox 360 console", "Xbox 360 slim"
**Images Needed:** 3-5 images
**Suggested Names:**
- xbox3601.png (front view)
- xbox3602.png (with controllers)
- xbox3603.png (side view)

## Where to Find Images

### Free Stock Photo Sites:
1. **Unsplash.com** - High quality, royalty-free
2. **Pexels.com** - Free stock photos
3. **Pixabay.com** - Free images and videos

### Google Images:
- Use filter: "Tools → Usage Rights → Creative Commons licenses"
- Or search manufacturer's official press kits

### Official Sources:
- Sony PlayStation Press Center
- Microsoft Xbox Media Assets
- Product manufacturer websites

## Image Optimization Tools

### Online Tools (Free):
- **TinyPNG.com** - Compress PNG/JPG (up to 70% reduction)
- **Squoosh.app** - Google's image optimizer
- **Compressor.io** - Multi-format compression

### Desktop Tools:
- **GIMP** (Free) - Image editing and batch processing
- **IrfanView** (Free) - Batch resize and convert
- **Adobe Photoshop** - Professional editing

## Batch Processing Steps

1. **Resize All Images:**
   - Set to 800px × 800px
   - Maintain aspect ratio (crop if needed)
   - Center product in frame

2. **Optimize/Compress:**
   - Use TinyPNG or Squoosh
   - Target: 80-85% quality
   - Keep file size under 150KB

3. **Rename Files:**
   - Follow naming convention
   - Use sequential numbers

4. **Upload to Folders:**
   - Place in correct product folder
   - Verify file paths

## After Adding Images

Once you've added images to the folders, update `products.json`:

**Change from:**
```json
"image": "fas fa-playstation"
```

**To:**
```json
"images": [
  "images/ps4fat/ps4fat1.png",
  "images/ps4fat/ps4fat2.png",
  "images/ps4fat/ps4fat3.png"
]
```

## Quick Checklist

- [ ] Downloaded 3-5 images per product
- [ ] Resized to 800×800px
- [ ] Compressed to under 150KB each
- [ ] Named following convention
- [ ] Saved to correct folder
- [ ] Updated products.json with image paths
- [ ] Tested on website

---

**Need help?** Contact me after adding images, and I'll update the JSON file with the correct image paths!
