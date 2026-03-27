import React from "react";
import Link from "next/link";
import Image from "next/image";
import { inventoryApi, type InventoryItem } from "@/lib/inventory-api";
import StoreHeader from "@/app/components/StoreHeader";
import styles from "./storefront.module.css";

async function getFeaturedProducts(): Promise<InventoryItem[]> {
  try {
    const response = await inventoryApi.getItems({
      limit: "8",
      sort: "-createdAt",
      isActive: "true"
    });
    return response.items;
  } catch {
    return [];
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className={styles.page}>
      <StoreHeader />

      <section className={styles.heroCommerce}>
        <div className={styles.heroCommerceCopy}>
          <p className={styles.kicker}>New Styles Live Now</p>
          <h1>Premium fashion delivered fast, with a visual-first shopping experience.</h1>
          <p>
            Shop clothing, footwear, and accessories through curated collections,
            smart product search, and a checkout flow designed for conversion.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className="btn btn-primary btn-lg">Shop Collection</Link>
            <Link href="/customer/dashboard" className="btn btn-secondary btn-lg">Open Dashboard</Link>
          </div>
        </div>
        <div className={styles.heroCommercePanels}>
          <article className={styles.heroMiniCard}>
            <h3>Top Category</h3>
            <p>Streetwear Essentials</p>
            <span>From LKR 2,490</span>
          </article>
          <article className={styles.heroMiniCard}>
            <h3>Fast Delivery</h3>
            <p>Under 90 minutes</p>
            <span>City-wide</span>
          </article>
          <article className={styles.heroMiniCard}>
            <h3>Weekly Savings</h3>
            <p>Special basket combos</p>
            <span>Up to 18% off</span>
          </article>
        </div>
      </section>

      <section className={styles.seasonalHero}>
        <div className={styles.seasonalOverlay}>
          <p className={styles.kicker}>Seasonal Collection</p>
          <h2>Fresh Looks This Season</h2>
          <p>
            Handpicked fits, in-season trends, and wardrobe essentials curated for this week.
          </p>
          <Link href="/products" className="btn btn-primary btn-sm">Shop Seasonal Picks</Link>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2>Featured Products</h2>
          <Link href="/products">View full catalog</Link>
        </div>

        <div className={styles.grid}>
          {featuredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              No products are available right now. Please check again shortly.
            </div>
          ) : featuredProducts.map((item) => (
            <article key={item._id} className={styles.card}>
              <div className={styles.cardMedia}>
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>{item.name.slice(0, 1).toUpperCase()}</div>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3>{item.name}</h3>
                <p className={styles.description}>{item.description || "Premium fashion item"}</p>
                <div className={styles.metaRow}>
                  <span className={styles.price}>{formatCurrency(item.price)}</span>
                  <span className={item.stock > 0 ? styles.stockGood : styles.stockLow}>
                    {item.stock > 0 ? `${item.stock} ${item.unit} in stock` : "Out of stock"}
                  </span>
                </div>
                <Link href={`/products/${item._id}`} className={styles.cardLink}>View Details</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 Monarch</p>
        <div>
          <Link href="/products">Catalog</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </footer>
    </main>
  );
}
