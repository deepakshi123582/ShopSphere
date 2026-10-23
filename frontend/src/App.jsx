import { useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 1499, oldPrice: 2499, rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80", badge: "BESTSELLER" },
  { id: 2, name: "Classic Sneakers", category: "Fashion", price: 1999, oldPrice: 2999, rating: 4.6, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80", badge: "POPULAR" },
  { id: 3, name: "Smart Watch", category: "Electronics", price: 2499, oldPrice: 3999, rating: 4.7, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80", badge: "TRENDING" },
  { id: 4, name: "Everyday Backpack", category: "Accessories", price: 999, oldPrice: 1599, rating: 4.5, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80", badge: "SALE" },
  { id: 5, name: "Skincare Essentials", category: "Beauty", price: 799, oldPrice: 1199, rating: 4.4, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80", badge: "NEW" },
  { id: 6, name: "Classic Sunglasses", category: "Accessories", price: 699, oldPrice: 999, rating: 4.3, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80", badge: "POPULAR" },
  { id: 7, name: "Running Shoes", category: "Fashion", price: 1799, oldPrice: 2599, rating: 4.7, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&q=80", badge: "TRENDING" },
  { id: 8, name: "Coffee Mug Set", category: "Home", price: 499, oldPrice: 799, rating: 4.2, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80", badge: "DEAL" },
];

const categories = [
  { name: "All", emoji: "✦" },
  { name: "Electronics", emoji: "⌁" },
  { name: "Fashion", emoji: "◈" },
  { name: "Accessories", emoji: "▧" },
  { name: "Beauty", emoji: "✿" },
  { name: "Home", emoji: "⌂" },
];

function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notice, setNotice] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesWishlist = !showWishlistOnly || wishlist.includes(product.id);
    return matchesSearch && matchesCategory && matchesWishlist;
  });

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => {
      setNotice((current) => (current === message ? "" : current));
    }, 2500);
  }

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    showNotice(`${product.name} added to cart!`);
  }

  function changeQuantity(productId, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleWishlist(product) {
    const isSaved = wishlist.includes(product.id);
    setWishlist((currentWishlist) =>
      isSaved
        ? currentWishlist.filter((id) => id !== product.id)
        : [...currentWishlist, product.id]
    );
    showNotice(isSaved ? "Removed from wishlist" : "Added to your wishlist!");
  }

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function selectCategory(category) {
    setActiveCategory(category);
    setShowWishlistOnly(false);
    scrollToSection("products");
  }

  return (
    <div className="shop-app" id="home">
      <div className="announcement">
        <span className="announcement-spark">✦</span>
        <span>THE SEASON'S BEST FINDS ARE HERE</span>
        <button onClick={() => scrollToSection("products")}>Shop the edit <span>→</span></button>
      </div>

      <header className="navbar">
        <a className="brand" href="#home" aria-label="ShopSphere home">
          <span className="brand-icon">S</span>
          <span>shop<span className="brand-highlight">sphere</span></span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a className="nav-active" href="#home">Home</a>
          <button onClick={() => scrollToSection("categories")}>Categories</button>
          <button onClick={() => scrollToSection("products")}>Discover</button>
        </nav>

        <label className="nav-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search for anything..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowWishlistOnly(false);
            }}
            aria-label="Search products"
          />
          {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}
        </label>

        <div className="nav-actions">
          <button
            className={`icon-action ${showWishlistOnly ? "icon-action-active" : ""}`}
            onClick={() => {
              setShowWishlistOnly((current) => !current);
              setSearch("");
              setActiveCategory("All");
              scrollToSection("products");
              if (wishlist.length === 0) showNotice("Your wishlist is empty!");
              else showNotice(showWishlistOnly ? "Showing all products" : "Showing your wishlist");
            }}
            aria-label="Toggle wishlist products"
            title="Wishlist"
          >
            ♡ <span className="action-count">{wishlist.length}</span>
          </button>
          <button className="cart-button" onClick={() => setShowCart(true)}>
            <span className="bag-icon">▱</span><span className="cart-label">Bag</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="market-hero">
          <div className="market-hero-copy">
            <div className="hero-pill"><span></span> YOUR EVERYDAY DISCOVERY STORE</div>
            <h1>Good finds.<br /><span>Great feelings.</span></h1>
            <p>Thoughtfully picked essentials, little luxuries, and everyday upgrades — all in one happy place.</p>
            <div className="hero-cta-row">
              <button className="primary-button" onClick={() => scrollToSection("products")}>Explore products <span>↗</span></button>
              <button className="hero-text-button" onClick={() => scrollToSection("categories")}>Browse categories <span>→</span></button>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars"><span>D</span><span>S</span><span>A</span><span>+</span></div>
              <div><strong>Little things, big joy.</strong><small>Discover something made for you</small></div>
            </div>
            <span className="hero-star hero-star-one">✳</span>
          </div>
          <div className="market-hero-art">
            <div className="hero-art-blob"></div>
            <div className="hero-image-main">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1100&q=85" alt="A bright, modern retail store" />
            </div>
            <div className="hero-image-small">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80" alt="Curated fashion finds" />
            </div>
            <div className="hero-note"><span>✦</span><div><strong>Your new favorite</strong><small>is waiting to be found</small></div></div>
            <div className="hero-discount"><strong>100%</strong><span>good finds</span></div>
          </div>
        </section>

        <section className="promo-strip" aria-label="Shopping highlights">
          <div className="promo-item"><span className="promo-symbol">✦</span><div><strong>Fresh finds, always</strong><small>A little something for everyone</small></div></div>
          <span className="promo-divider"></span>
          <div className="promo-item"><span className="promo-symbol">♡</span><div><strong>Save your favorites</strong><small>Keep your picks close</small></div></div>
          <span className="promo-divider"></span>
          <div className="promo-item"><span className="promo-symbol">↗</span><div><strong>Easy to explore</strong><small>Your next find is one click away</small></div></div>
        </section>

        <section className="category-section" id="categories">
          <div className="section-heading">
            <div><span className="section-kicker">SHOP BY MOOD</span><h2>A world of good things.</h2><p>Start with what you're in the mood for.</p></div>
            <button className="text-link" onClick={() => selectCategory("All")}>Explore everything <span>→</span></button>
          </div>
          <div className="category-tiles">
            {categories.filter((category) => category.name !== "All").map((category, index) => (
              <button
                key={category.name}
                className={`category-tile category-tile-${index + 1} ${activeCategory === category.name ? "category-tile-active" : ""}`}
                onClick={() => selectCategory(category.name)}
              >
                <span className="tile-icon">{category.emoji}</span>
                <span className="tile-text"><strong>{category.name}</strong><small>{products.filter((p) => p.category === category.name).length} curated picks</small></span>
                <span className="tile-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="catalog-section" id="products">
          <div className="catalog-heading">
            <div><span className="section-kicker">THE GOOD STUFF</span><h2>{showWishlistOnly ? "Your saved favorites." : "Find your favorites."}</h2><p>{showWishlistOnly ? "All the things you've had your eye on." : "Handpicked pieces for your everyday."}</p></div>
            <div className="catalog-meta"><span className="live-dot"></span>{filteredProducts.length} products to explore</div>
          </div>

          <div className="catalog-layout">
            <aside className="filter-sidebar">
              <div className="filter-sidebar-title"><h3>Filters</h3><button onClick={() => { setSearch(""); setActiveCategory("All"); setShowWishlistOnly(false); }}>Reset</button></div>
              <div className="filter-group">
                <span className="filter-label">CATEGORIES</span>
                {categories.map((category) => (
                  <button key={category.name} className={`sidebar-category ${activeCategory === category.name ? "sidebar-category-active" : ""}`} onClick={() => { setActiveCategory(category.name); setShowWishlistOnly(false); }}>
                    <span className="sidebar-category-icon">{category.emoji}</span><span>{category.name}</span><span className="sidebar-category-count">{category.name === "All" ? products.length : products.filter((p) => p.category === category.name).length}</span>
                  </button>
                ))}
              </div>
              <div className="sidebar-promo"><span>✦ A GOOD FIND</span><strong>Small things.<br />Big delight.</strong><p>Take a little time to find something you love.</p><button onClick={() => { setShowWishlistOnly(false); scrollToSection("products"); }}>Keep exploring ↗</button></div>
            </aside>

            <div className="catalog-results">
              <div className="catalog-toolbar">
                <div className="mobile-filter-row">
                  <span>Category</span>
                  <select value={activeCategory} onChange={(event) => { setActiveCategory(event.target.value); setShowWishlistOnly(false); }} aria-label="Filter by category">
                    {categories.map((category) => <option key={category.name} value={category.name}>{category.name}</option>)}
                  </select>
                </div>
                <span className="results-label">Showing <strong>{filteredProducts.length}</strong> results</span>
                <div className="sort-display">Curated for you <span>⌄</span></div>
              </div>

              <div className="product-grid">
                {filteredProducts.map((product) => {
                  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
                  return (
                    <article className="product-card" key={product.id}>
                      <div className="product-image">
                        <img src={product.image} alt={product.name} loading="lazy" />
                        <span className="product-badge">{product.badge}</span>
                        <span className="discount-badge">{discount}% OFF</span>
                        <button className={`wishlist-button ${wishlist.includes(product.id) ? "saved" : ""}`} onClick={() => toggleWishlist(product)} aria-label={`Toggle ${product.name} wishlist`}>{wishlist.includes(product.id) ? "♥" : "♡"}</button>
                        <button className="quick-add" onClick={() => addToCart(product)}><span>＋</span> Quick add</button>
                      </div>
                      <div className="product-details">
                        <div className="product-category-row"><span className="product-category">{product.category}</span><span className="product-rating"><span>★</span> {product.rating}</span></div>
                        <h3>{product.name}</h3>
                        <div className="product-bottom"><div className="product-prices"><strong>₹{product.price.toLocaleString("en-IN")}</strong><del>₹{product.oldPrice.toLocaleString("en-IN")}</del></div><button className="add-button" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>＋</button></div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && <div className="empty-state"><span>⌕</span><h3>{showWishlistOnly && wishlist.length === 0 ? "Your wishlist is waiting." : "No products found"}</h3><p>{showWishlistOnly && wishlist.length === 0 ? "Tap the heart on a product to save it here." : "Try another search or choose a different category."}</p><button className="primary-button" onClick={() => { setSearch(""); setActiveCategory("All"); setShowWishlistOnly(false); }}>Show all products</button></div>}
            </div>
          </div>
        </section>

        <section className="closing-banner">
          <div className="closing-banner-copy"><span className="section-kicker">YOUR NEXT GOOD FIND</span><h2>Make room for<br /><span>a little delight.</span></h2><p>There's always something worth discovering.</p><button className="primary-button" onClick={() => scrollToSection("products")}>Find your favorite <span>↗</span></button></div>
          <div className="closing-art"><span className="closing-orbit orbit-one"></span><span className="closing-orbit orbit-two"></span><div className="closing-gift">✦</div><span className="closing-spark closing-spark-one">✳</span><span className="closing-spark closing-spark-two">✧</span></div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home"><span className="brand-icon">S</span><span>shop<span className="brand-highlight">sphere</span></span></a>
        <p>Find your thing. Love your find.</p>
        <span className="footer-copy">© {new Date().getFullYear()} ShopSphere. Built with care.</span>
      </footer>

      {showCart && <div className="cart-backdrop" onClick={() => setShowCart(false)}>
        <section className="cart-panel" onClick={(event) => event.stopPropagation()} aria-label="Shopping cart">
          <div className="cart-panel-header"><div><span className="section-kicker">YOUR BAG</span><h2>Shopping bag <span>({cartCount})</span></h2></div><button className="close-cart" onClick={() => setShowCart(false)} aria-label="Close cart">×</button></div>
          {cart.length === 0 ? <div className="cart-empty"><span>▱</span><h3>Your bag is taking a break.</h3><p>Find something you love and add it to your bag.</p><button className="primary-button" onClick={() => { setShowCart(false); scrollToSection("products"); }}>Explore products</button></div> : <>
            <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-info"><strong>{item.name}</strong><span>₹{item.price.toLocaleString("en-IN")}</span><div className="quantity-controls"><button onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}>+</button></div></div><button className="remove-item" onClick={() => setCart((current) => current.filter((cartItem) => cartItem.id !== item.id))} aria-label={`Remove ${item.name}`}>×</button></div>)}</div>
            <div className="cart-total"><span>Subtotal</span><strong>₹{cartTotal.toLocaleString("en-IN")}</strong></div><p className="cart-note">Taxes and delivery can be calculated at checkout.</p><button className="checkout-button" onClick={() => showNotice("Demo project: checkout will be added in a later step.")}>Continue to checkout <span>→</span></button>
          </>}
        </section>
      </div>}

      {notice && <div className="toast-message" role="status"><span>✓</span>{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notification">×</button></div>}
    </div>
  );
}

export default App;
