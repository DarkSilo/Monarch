# Category Images

This folder contains the category showcase images for the Monarch e-commerce platform.

## Image Structure

Add your category images following this naming convention:

```
public/categories/
├── mens-clothing.jpg (or .png, .webp)
├── womens-clothing.jpg
├── kids-wear.jpg
├── footwear.jpg
├── accessories.jpg
├── sportswear.jpg
├── formal-wear.jpg
├── ethnic-wear.jpg
└── perfume.jpg
```

## Recommended Image Specifications

- **Format**: JPG, PNG, or WebP
- **Dimensions**: 800×600px (aspect ratio 4:3) or 800×800px (square)
- **File Size**: Under 200KB (optimize with tools like TinyPNG or Squoosh)
- **Quality**: High-resolution, clear product imagery

## File Naming Convention

- Replace spaces with hyphens: "Men's Clothing" → `mens-clothing.jpg`
- Use lowercase only
- No special characters

## How Images Are Used

Category showcase images are automatically served from this folder and displayed:
- On the products page category selector
- In category cards and filters
- Throughout the storefront

## Adding Images

1. Prepare your image (800×600px, optimized JPG/PNG)
2. Place in this folder with the appropriate category name
3. Restart the Docker container with `docker-compose up --build`
4. Images will be served at: `http://localhost:3000/categories/mens-clothing.jpg`

## Fallback

If an image is missing for a category, a default placeholder will be shown.
