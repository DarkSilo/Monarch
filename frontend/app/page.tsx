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
          <p className={styles.kicker}>The House Collection</p>
          <h1>Timeless tailoring and elevated essentials for modern luxury wardrobes.</h1>
          <p>
            Discover refined silhouettes, premium fabrics, and curated seasonal pieces
            inspired by heritage style and contemporary sophistication.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className="btn btn-primary btn-lg">Shop The Edit</Link>
            <Link href="/customer/dashboard" className="btn btn-secondary btn-lg">View Your Wardrobe</Link>
          </div>
        </div>
        <div className={styles.heroCommercePanels}>
          <article className={styles.heroMiniCard}>
            <h3>Signature Tailoring</h3>
            <p>Italian wool blazers</p>
            <span>From USD 190</span>
          </article>
          <article className={styles.heroMiniCard}>
            <h3>Concierge Delivery</h3>
            <p>Priority same-day dispatch</p>
            <span>In selected cities</span>
          </article>
          <article className={styles.heroMiniCard}>
            <h3>Private Client Access</h3>
            <p>Members-only capsule drops</p>
            <span>Early access every Friday</span>
          </article>
        </div>
      </section>

      <section className={styles.seasonalHero}>
        <div className={styles.seasonalOverlay}>
          <p className={styles.kicker}>Seasonal Collection</p>
          <h2>Autumn Atelier 2026</h2>
          <p>
            Hand-finished knits, heritage outerwear, and clean silhouettes selected for a timeless season.
          </p>
          <Link href="/products" className="btn btn-primary btn-sm">Explore The Collection</Link>
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
