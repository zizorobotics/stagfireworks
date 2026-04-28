import React from 'react';
import ProductCard from './ProductCard';

export default function SaleCarousel({ products, onAdd, wishlistItems, handleToggleWishlist, setSelectedProduct }) {

  // Grab explicitly marked On Sale items, otherwise fallback to the first 8 products with images.
  let baseSaleProducts = products.filter(p => (p.specs?.specialties?.includes('On Sale') || p.specs?.specialty === 'On Sale') && p.image);
  if (baseSaleProducts.length === 0) {
    baseSaleProducts = products.filter(p => p.image).slice(0, 8);
  }
  
  if (baseSaleProducts.length === 0) return null;

  // Duplicate the array to create a seamless infinite rolling loop locally
  const saleProducts = [...baseSaleProducts, ...baseSaleProducts];

  return (
    <section className="sale-carousel-section" style={{ position: 'relative', padding: '4rem 0', background: '#0a0a0c', borderTop: '1px solid #222', overflow: 'hidden' }}>
      <style>
        {`
          @keyframes glowPulse {
            0% { filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.4)); transform: rotate(-5deg) scale(1); }
            50% { filter: drop-shadow(0 0 30px rgba(255, 255, 0, 1)); transform: rotate(-5deg) scale(1.05); }
            100% { filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.4)); transform: rotate(-5deg) scale(1); }
          }
        `}
      </style>

      {/* Top Left Giant UP TO 50% Text */}
      <div className="giant-sale-badge" style={{ pointerEvents: 'none', animation: 'glowPulse 2s infinite ease-in-out' }}>
        <span className="giant-sale-text-up">UP TO</span>
        <span className="giant-sale-text-50">50%</span>
        <span className="giant-sale-text-off">OFF</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 4rem', position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontSize: '3rem', color: 'var(--accent-magenta)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', display: 'inline-block' }}>
          On Sale Right Now
        </h2>
        <p style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: 600 }}>
          Massive Discounts Up To 50% - Limited Time Only!
        </p>
      </div>

      {/* 
        This wrapper holds the infinite slider. 
        It uses a CSS mask to create smooth fade in / fade out at the edges.
      */}
      <div
        className="marquee-container"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div
          className="marquee-track"
          style={{
            display: 'flex',
            gap: '2rem',
            width: 'max-content',
            paddingLeft: '2rem',
            animation: 'marqueeScroll 40s linear infinite'
          }}
        >
          {saleProducts.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              style={{
                position: 'relative',
                width: '320px', /* Enforce uniform card width so the marquee flows evenly */
                flexShrink: 0
              }}
            >
              <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'red', color: 'white', padding: '1rem', borderRadius: '50%', fontWeight: 'bold', zIndex: 10, boxShadow: '0 0 20px red', transform: 'rotate(15deg)' }}>
                -50%
              </div>
              <ProductCard
                product={product}
                onAdd={onAdd}
                isWishlisted={wishlistItems.some(item => item.id === product.id)}
                onToggleWishlist={handleToggleWishlist}
                onViewDetails={setSelectedProduct}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
