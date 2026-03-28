/**
 * Category showcase images - Maps product categories to local image paths
 * Images are stored in public/categories/ folder and served statically
 * 
 * To add your own category images:
 * 1. Place image files in frontend/public/categories/
 * 2. Name them according to the category (e.g., mens-clothing.jpg, perfume.png)
 * 3. Update paths below if using different filenames
 * 4. Restart Docker: docker-compose up --build
 */

export const CATEGORY_SHOWCASE_IMAGES: Record<string, string> = {
    "Men's Clothing": "/categories/mens-clothing.png",
    "Women's Clothing": "/categories/womens-clothing.png",
    "Kids' Wear": "/categories/kids-wear.png",
    "Footwear": "/categories/footwear.png",
    "Accessories": "/categories/accessories.png",
    "Sportswear": "/categories/sportswear.png",
    "Formal Wear": "/categories/formal-wear.png",
    "Ethnic Wear": "/categories/ethnic-wear.png",
    "Perfume": "/categories/perfume.png"
};

/**
 * Fallback image used when category image is not found
 */
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect fill='%23f3f4f6' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='32' fill='%239ca3af'%3ECategory Image%3C/text%3E%3C/svg%3E";

/**
 * Get showcase image for a category
 * Returns local image path or fallback placeholder
 */
export function getCategoryShowcaseImage(category: string): string {
    return CATEGORY_SHOWCASE_IMAGES[category] || FALLBACK_IMAGE;
}
