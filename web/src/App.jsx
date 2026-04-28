import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import Wishlist from './components/Wishlist';
import ContactModal from './components/ContactModal';
import SaleCarousel from './components/SaleCarousel';
import SafetyPage from './components/SafetyPage';
import FilterDropdown from './components/FilterDropdown';
import ProductModal from './components/ProductModal';
import FooterSections from './components/FooterSections';
import TrajectoryJourney from './components/TrajectoryJourney';
import FireworkAnimation from './components/FireworkAnimation';
import BrandMarquee from './components/BrandMarquee';
import SmartBudgeter from './components/SmartBudgeter';
import AdminDashboard from './components/AdminDashboard';
import PromoPage from './components/PromoPage';
import { supabase } from './supabaseClient';
import productsFile from './data/products.json';

function App() {
  const [productsData, setProductsData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [advancedFilters, setAdvancedFilters] = useState({
    minPrice: '', maxPrice: '',
    minNoise: '', maxNoise: '',
    minShots: '', maxShots: '',
    minWeight: '', maxWeight: '',
    brand: ''
  });
  const [showNavbar, setShowNavbar] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [toastItem, setToastItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTicker, setShowTicker] = useState(true);

  // Persist wishlist natively using localStorage (the modern, ultra-fast equivalent of cookies)
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem('stag_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('stag_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Fetch fireworks from Supabase automatically
  useEffect(() => {
    const fetchFireworks = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Error fetching fireworks from Supabase:", error);
        setProductsData(productsFile.map(p => ({ ...p, price: p.price || p.specs?.price })));
      } else if (data && data.length > 0) {
        setProductsData(data.map(p => {
          let parsedSpecs = p.specs;
          if (typeof p.specs === 'string') {
            try { parsedSpecs = JSON.parse(p.specs); } catch (e) { }
          }
          const localEquiv = productsFile.find(localP => localP.id === p.id);
          const resolvedPrice = p.price || parsedSpecs?.price || localEquiv?.price || '';
          return { ...p, specs: parsedSpecs || {}, price: resolvedPrice };
        }));
      } else {
        setProductsData(productsFile.map(p => ({ ...p, price: p.price || p.specs?.price })));
      }
    };
    fetchFireworks();
  }, []);

  const handleToggleWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  useEffect(() => {
    setVisibleCount(10);
  }, [activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const lockedDistance = window.innerHeight * 1.3;
      setShowNavbar(window.scrollY > lockedDistance);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ['All', ...new Set(productsData.map(p => p.category))];

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setToastItem(product.name);
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      setToastItem(null);
    }, 3000);
  };

  const handleUpdateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + change) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (window.location.pathname === '/admin') {
    return <AdminDashboard />;
  }

  const isSafetyPage = window.location.pathname === '/safety';
  const isPromoPage = window.location.pathname === '/more';

  return (
    <div className="app-container">
      <div className={`top-bar-container ${showNavbar || isSafetyPage || isPromoPage ? 'visible' : ''}`}>
        <nav className="navbar" style={isSafetyPage || isPromoPage ? { background: 'rgba(11, 11, 15, 0.98)' } : {}}>
          <div className="nav-brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => window.location.href = '/'}>
            <img src="/images/StagFireworksLogo.png" alt="Stag Fireworks" style={{ height: '35px', objectFit: 'contain' }} />
          </div>
          <div className="nav-buttons-container" style={{ display: 'flex', gap: '1rem' }}>
            <button className="cart-btn" onClick={() => window.location.href = '/safety'} style={{ color: 'var(--accent-cyan)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span className="nav-btn-text">Safety</span>
            </button>
            <button className="cart-btn" onClick={() => setIsContactOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span className="nav-btn-text">Contact</span>
            </button>
            <button className="cart-btn" onClick={() => setIsWishlistOpen(true)}>
              <span style={{ fontSize: '1.2rem', color: wishlistItems.length > 0 ? 'var(--accent-magenta)' : 'inherit' }}>
                {wishlistItems.length > 0 ? '♥' : '♡'}
              </span>
              <span className="nav-btn-text">Wishlist</span> <span className="cart-badge" style={{ background: 'transparent', border: '1px solid currentColor' }}>{wishlistItems.length}</span>
            </button>
            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="nav-btn-text">Cart</span> <span className="cart-badge">{totalItems}</span>
            </button>
          </div>
        </nav>
        {showTicker && !isSafetyPage && !isPromoPage && (
          <div className="promo-ticker" style={{ position: 'relative' }}>
            <div className="promo-ticker-track">
              <span className="promo-ticker-text">🔥 MOST FIREWORKS UP TO 50% OFF RRP! 🔥 EXCLUSIVE VIVID FIREWORKS! 🔥</span>
              <span className="promo-ticker-text">🔥 MOST FIREWORKS UP TO 50% OFF RRP! 🔥 MORE BANG FOR YOUR BUCK! 🔥</span>
              <span className="promo-ticker-text">🔥 MOST FIREWORKS UP TO 50% OFF RRP! 🔥 EXCLUSIVE VIVID FIREWORKS! 🔥</span>
              <span className="promo-ticker-text">🔥 MOST FIREWORKS UP TO 50% OFF RRP! 🔥 MORE BANG FOR YOUR BUCK! 🔥</span>
              <span className="promo-ticker-text">🔥 MOST FIREWORKS UP TO 50% OFF RRP! 🔥 EXCLUSIVE VIVID FIREWORKS! 🔥</span>
            </div>
            <button
              className="ticker-close-btn"
              onClick={() => setShowTicker(false)}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {isSafetyPage ? (
        <SafetyPage />
      ) : isPromoPage ? (
        <PromoPage />
      ) : (
        <>
          <div className="hero-scroll-wrapper">
            <section className="hero">
              <FireworkAnimation />
            </section>
          </div>

          <main className="products-wrapper">
            <h2 className="section-title">Our Collection</h2>

            <div className="filter-bar-wrapper">
              <div className="category-filter" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: 0 }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`cat-btn standard-cat ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                    style={{ '--cat-color': '#ffffff' }}
                  >
                    {cat}
                  </button>
                ))}

                {/* Promotional Category Buttons */}
                <button
                  className={`cat-btn custom-cat ${activeCategory === 'BEST SELLERS' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('BEST SELLERS')}
                  style={{ '--cat-color': '#ffd700' }}
                >
                  BEST SELLERS
                </button>

                <button
                  className={`cat-btn custom-cat ${activeCategory === 'BRANDS' || activeCategory?.startsWith('Brand_') ? 'active' : ''}`}
                  onClick={() => setActiveCategory('BRANDS')}
                  style={{ '--cat-color': 'var(--accent-cyan)' }}
                >
                  BRANDS
                </button>

                <button
                  className="cat-btn custom-cat"
                  onClick={() => document.querySelector('.sale-carousel-section')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ '--cat-color': '#ffb3d9' }}
                >
                  🔥 ON SALE
                </button>

                {/* Thematic Category Buttons */}
                <button
                  className={`cat-btn custom-cat ${activeCategory === 'OCCASIONS' || activeCategory?.startsWith('Occasion_') ? 'active' : ''}`}
                  onClick={() => setActiveCategory('OCCASIONS')}
                  style={{ '--cat-color': '#ff8c00' }}
                >
                  OCCASIONS
                </button>
                <button
                  className={`cat-btn custom-cat ${activeCategory === 'VIVID' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('VIVID')}
                  style={{ '--cat-color': 'var(--accent-magenta)' }}
                >
                  VIVID EXCLUSIVES
                </button>
              </div>

              {(activeCategory === 'BRANDS' || activeCategory?.startsWith('Brand_')) && (
                <div className="category-filter" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: 0, marginTop: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  {['Astra', 'Big Star', 'Black Panther', 'Brothers', 'Celtic', 'Cosmic', 'Gemstone', 'Hallmark', 'Klasek', 'Riakeo', 'Vivid'].map(brand => (
                    <button
                      key={brand}
                      className={`cat-btn custom-cat ${activeCategory === 'Brand_' + brand ? 'active' : ''}`}
                      onClick={() => setActiveCategory('Brand_' + brand)}
                      style={{ '--cat-color': '#fff', fontSize: '0.85rem', padding: '0.4rem 1rem' }}
                    >
                      {brand.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}

              {(activeCategory === 'OCCASIONS' || activeCategory?.startsWith('Occasion_')) && (
                <div className="brand-sub-menu" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '1rem', background: 'rgba(255,140,0,0.05)', borderRadius: '12px', marginBottom: '1rem', justifyContent: 'center' }}>
                  {['Valentines', 'Bespoke Bundles', 'Garden Fireworks', 'Pet Friendly', 'Display Packs', 'Weddings', 'Pro Displays', 'Birthdays', 'Hen & Stag Dos', 'Baby Showers', 'Gender Reveals', 'Engagements', 'Diwali', 'Halloween', 'Christmas', 'Funerals', 'Eid', 'Parties'].map(occ => (
                    <button
                      key={occ}
                      onClick={() => setActiveCategory('Occasion_' + occ)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        background: activeCategory === ('Occasion_' + occ) ? '#ff8c00' : 'transparent',
                        color: activeCategory === ('Occasion_' + occ) ? '#000' : '#ff8c00',
                        border: '1px solid #ff8c00',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                      }}
                    >
                      {occ.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ position: 'relative', display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                <input
                  type="text"
                  className="search-input-fancy"
                  placeholder="Search fireworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="filter-toggle-btn" onClick={() => setIsFilterOpen(true)}>
                  ⚙ Filters
                </button>

                <FilterDropdown
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  filters={advancedFilters}
                  setFilters={setAdvancedFilters}
                  availableBrands={['Astra', 'Big Star', 'Black Panther', 'Brothers', 'Celtic', 'Cosmic', 'Gemstone', 'Hallmark', 'Klasek', 'Riakeo', 'Vivid']}
                />
              </div>
            </div>

            <div className="grid">
              {productsData
                .filter(p => {
                  if (activeCategory === 'All') return true;
                  if (activeCategory === 'BEST SELLERS') {
                    const hasExplicitBestSellers = productsData.some(prod => prod.specs?.specialties?.includes('Best Seller') || prod.specs?.specialty === 'Best Seller');
                    if (hasExplicitBestSellers) {
                      return p.specs?.specialties?.includes('Best Seller') || p.specs?.specialty === 'Best Seller';
                    } else {
                      // Fallback: Just return the first 5 items
                      return productsData.indexOf(p) < 5;
                    }
                  }
                  if (activeCategory === 'VIVID') return p.specs?.brand === 'Vivid' || p.name.toLowerCase().includes('vivid') || p.description?.toLowerCase().includes('vivid');
                  if (activeCategory === 'BRANDS') return true; // Show all when just 'BRANDS' is clicked
                  if (activeCategory?.startsWith('Brand_')) {
                    const targetBrand = activeCategory.split('_')[1];
                    const targetBrandLower = targetBrand.toLowerCase();
                    return p.specs?.brand === targetBrand ||
                      p.name.toLowerCase().includes(targetBrandLower) ||
                      p.description?.toLowerCase().includes(targetBrandLower);
                  }
                  if (activeCategory === 'OCCASIONS') return true; 
                  if (activeCategory?.startsWith('Occasion_')) {
                    const occasion = activeCategory.split('_')[1];
                    const lowerOccasion = occasion.toLowerCase();
                    if (p.specs?.events?.includes(occasion)) return true;
                    // Extended heuristic fallback for previously established special occasions
                    if (occasion === 'Diwali') return p.description?.toLowerCase().includes('diwali') || p.name.toLowerCase().includes('diwali') || p.category === 'Compounds & Barrages';
                    if (occasion === 'Gender Reveals') return p.description?.toLowerCase().includes('gender') || p.name.toLowerCase().includes('gender') || p.description?.toLowerCase().includes('pink') || p.description?.toLowerCase().includes('blue');
                    if (occasion === 'Funerals') return p.description?.toLowerCase().includes('funeral') || p.description?.toLowerCase().includes('memorial') || p.category === 'Low Noise';
                    if (occasion === 'Pet Friendly') return p.category === 'Low Noise';
                    return p.description?.toLowerCase().includes(lowerOccasion) || p.name.toLowerCase().includes(lowerOccasion);
                  }
                  if (activeCategory === 'Low Noise') return p.category === 'Low Noise' || (p.specs?.noise && parseInt(String(p.specs.noise).split('/')[0]) <= 2);

                  return p.category === activeCategory;
                })
                .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .filter(p => {
                  const parseNumber = (val) => {
                    if (!val) return 0;
                    const match = val.toString().match(/[\d.]+/);
                    return match ? parseFloat(match[0]) : 0;
                  };

                  const price = Number(p.price) || 0;
                  const noise = parseNumber(p.specs?.noise);
                  const shots = parseNumber(p.specs?.shots);
                  const weight = parseNumber(p.specs?.weight);

                  if (advancedFilters.minPrice && price < Number(advancedFilters.minPrice)) return false;
                  if (advancedFilters.maxPrice && price > Number(advancedFilters.maxPrice)) return false;
                  if (advancedFilters.minNoise && noise < Number(advancedFilters.minNoise)) return false;
                  if (advancedFilters.maxNoise && noise > Number(advancedFilters.maxNoise)) return false;
                  if (advancedFilters.minShots && shots < Number(advancedFilters.minShots)) return false;
                  if (advancedFilters.maxShots && shots > Number(advancedFilters.maxShots)) return false;
                  if (advancedFilters.minWeight && weight < Number(advancedFilters.minWeight)) return false;
                  if (advancedFilters.maxWeight && weight > Number(advancedFilters.maxWeight)) return false;

                  if (advancedFilters.brand && !p.name.toLowerCase().includes(advancedFilters.brand.toLowerCase())) return false;

                  return true;
                })
                .slice(0, visibleCount)
                .map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                    isWishlisted={wishlistItems.some(item => item.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onViewDetails={(p) => setSelectedProduct(p)}
                  />
                ))}
            </div>

            {productsData.filter(p => {
              if (activeCategory === 'All') return true;
              if (activeCategory === 'BEST SELLERS' || activeCategory === 'NEW IN') return true;
              if (activeCategory === 'VIVID') return p.name.toLowerCase().includes('vivid') || p.description?.toLowerCase().includes('vivid');
              if (activeCategory === 'Diwali') return p.description?.toLowerCase().includes('diwali') || p.name.toLowerCase().includes('diwali') || p.category === 'Compounds & Barrages';
              if (activeCategory === 'Gender Reveals') return p.description?.toLowerCase().includes('gender') || p.name.toLowerCase().includes('gender') || p.description?.toLowerCase().includes('pink') || p.description?.toLowerCase().includes('blue');
              if (activeCategory === 'Funerals') return p.description?.toLowerCase().includes('funeral') || p.description?.toLowerCase().includes('memorial') || p.category === 'Low Noise';

              return p.category === activeCategory;
            }).length > visibleCount && (
                <div className="show-more-container">
                  <button className="show-more-btn" onClick={() => setVisibleCount(prev => prev + 10)}>
                    SHOW MORE
                  </button>
                </div>
              )}

            <SmartBudgeter
              products={productsData}
              onAdd={handleAddToCart}
              wishlistItems={wishlistItems}
              onToggleWishlist={handleToggleWishlist}
            />

          </main>

          <SaleCarousel
            products={productsData}
            onAdd={handleAddToCart}
            wishlistItems={wishlistItems}
            handleToggleWishlist={handleToggleWishlist}
            setSelectedProduct={setSelectedProduct}
          />

          <BrandMarquee setActiveCategory={setActiveCategory} />

          <TrajectoryJourney setActiveCategory={setActiveCategory} />

          <FooterSections setActiveCategory={setActiveCategory} />
        </>
      )}

      <Cart
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onComplete={() => {
          setIsCheckoutOpen(false);
          setCartItems([]);
        }}
      />

      <Wishlist
        isOpen={isWishlistOpen}
        items={wishlistItems}
        onClose={() => setIsWishlistOpen(false)}
        onAdd={handleAddToCart}
        onRemove={(id) => setWishlistItems(prev => prev.filter(item => item.id !== id))}
      />

      <ProductModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={handleAddToCart}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <div className={`toast-notification ${toastItem ? 'visible' : ''}`}>
        ✓ Added {toastItem} to cart
      </div>
    </div>
  );
}

export default App;
