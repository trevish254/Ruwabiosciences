const siteHeaders = document.querySelectorAll('.site-header');
const overlaySections = document.querySelectorAll('.hero, .contact-hero, .ingredients-hero, .values-hero');
const updateHeaderState = () => {
  siteHeaders.forEach((header) => {
    const headerHeight = header.offsetHeight;
    const isOverHero = [...overlaySections].some((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const navbarEdge = window.scrollY + headerHeight;
      return navbarEdge > sectionTop && navbarEdge < sectionBottom;
    });
    header.classList.toggle('is-on-hero', isOverHero);
    header.classList.toggle('is-scrolled', !isOverHero && window.scrollY > 0);
  });
};

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

const defaultCart = [];
const bagStorageKey = 'ruwa-bag-v2';
let bagItems;
try {
  bagItems = JSON.parse(localStorage.getItem(bagStorageKey) || 'null') || defaultCart;
} catch {
  bagItems = defaultCart;
}
bagItems.forEach((item) => { item.quantity = Math.max(1, Number(item.quantity) || 1); });

document.body.insertAdjacentHTML('beforeend', `<div class="bag-overlay" data-bag-close></div>
  <aside class="bag-drawer" data-bag-drawer aria-label="Shopping bag" aria-hidden="true">
    <div class="bag-drawer__header"><h2 data-bag-count>0 items in cart</h2><button type="button" class="bag-close" data-bag-close aria-label="Close shopping bag">×</button></div>
    <div class="bag-drawer__items" data-bag-items></div>
    <div class="bag-drawer__footer"><div class="bag-subtotal"><span>Subtotal</span><strong data-bag-subtotal>$0.00</strong></div><button class="bag-checkout" type="button">Checkout</button><div class="bag-payments" aria-label="Accepted payment methods"><span>VISA</span><span>●●</span><span>stripe</span><span>PayPal</span><span>G Pay</span><span> Pay</span><b>⚑ &nbsp; Made in Framer</b></div></div>
  </aside>`);

const bagDrawer = document.querySelector('[data-bag-drawer]');
const bagItemsContainer = document.querySelector('[data-bag-items]');
const bagCount = document.querySelector('[data-bag-count]');
const bagSubtotal = document.querySelector('[data-bag-subtotal]');
const formatMoney = (value) => `KES ${Number(value).toFixed(2)}`;
const saveBag = () => localStorage.setItem(bagStorageKey, JSON.stringify(bagItems));
const renderBag = () => {
  const itemCount = bagItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = bagItems.reduce((total, item) => total + item.price * item.quantity, 0);
  bagCount.textContent = `${itemCount} item${itemCount === 1 ? '' : 's'} in cart`;
  bagSubtotal.textContent = formatMoney(subtotal);
  document.querySelectorAll('[href="#bag"]').forEach((link) => { link.textContent = `Bag (${itemCount})`; });
  bagItemsContainer.innerHTML = bagItems.length ? bagItems.map((item) => `<article class="bag-item" data-bag-item="${item.id}"><img src="${item.image}" alt="${item.name}" /><div class="bag-item__details"><div class="bag-item__top"><div><h3>${item.name}</h3><p><strong>Size:</strong> ${item.size}</p></div><strong>${formatMoney(item.price * item.quantity)}</strong></div><div class="bag-item__bottom"><div class="bag-quantity"><button type="button" data-bag-decrease="${item.id}" aria-label="Decrease ${item.name}">−</button><span>${item.quantity}</span><button type="button" data-bag-increase="${item.id}" aria-label="Increase ${item.name}">+</button></div><button type="button" class="bag-remove" data-bag-remove="${item.id}" aria-label="Remove ${item.name}">×</button></div></div></article>`).join('') : '<p class="bag-empty">Your bag is empty.</p>';
  saveBag();
};
const openBag = () => {
  bagDrawer.classList.add('is-open');
  document.querySelector('.bag-overlay').classList.add('is-open');
  bagDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('bag-is-open');
};
document.addEventListener('click', (event) => {
  if (event.target.closest('.bag-checkout')) {
    event.preventDefault();
    window.location.href = 'checkout.html';
  }
});
const closeBag = () => {
  bagDrawer.classList.remove('is-open');
  document.querySelector('.bag-overlay').classList.remove('is-open');
  bagDrawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('bag-is-open');
};
const addBagItem = (product, quantityToAdd = 1) => {
  const existing = bagItems.find((item) => item.id === product.id);
  if (existing) existing.quantity += quantityToAdd;
  else bagItems.push({ ...product, quantity: quantityToAdd });
  renderBag();
  openBag();
};
renderBag();
document.querySelectorAll('[href="#bag"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); openBag(); }));
document.querySelectorAll('[data-bag-close]').forEach((element) => element.addEventListener('click', closeBag));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeBag(); });
bagItemsContainer.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  const id = button?.dataset.bagIncrease || button?.dataset.bagDecrease || button?.dataset.bagRemove;
  if (!id) return;
  const item = bagItems.find((entry) => entry.id === id);
  if (button.dataset.bagIncrease && item) item.quantity += 1;
  if (button.dataset.bagDecrease && item) item.quantity = Math.max(1, item.quantity - 1);
  if (button.dataset.bagRemove) bagItems = bagItems.filter((entry) => entry.id !== id);
  renderBag();
});

const searchProducts = [
  { id: 'malaria-pf-pan', name: 'Malaria PF/PAN', category: 'RDT Kits & Reagents', price: 'KES 1,500.00', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=85' },
  { id: 'sinocare-blood-sugar-machine', name: 'Sinocare Blood Sugar Machine', category: 'POC Equipment', price: 'KES 700.00', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85' },
  { id: 'mission-hb-machine', name: 'Mission Hb Machine', category: 'POC Equipment', price: 'KES 9,750.00', image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=85' },
  { id: 'urinalysis-strips', name: 'Urinalysis Strips (10 Para)', category: 'Laboratory Consumables', price: 'KES 800.00', image: 'https://images.unsplash.com/photo-1583912086096-8c60c8a7f7f8?auto=format&fit=crop&w=900&q=85' },
  { id: 'patient-monitor', name: 'Patient Monitor', category: 'Clinic Infrastructure', price: 'KES 120,000.00', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=85' }
];
document.body.insertAdjacentHTML('beforeend', `<div class="search-overlay" data-search-close></div>
  <aside class="search-drawer" data-search-drawer aria-label="Search products" aria-hidden="true">
    <div class="search-drawer__controls"><span aria-hidden="true">⌕</span><input type="search" data-search-input placeholder="Search" aria-label="Search products" /><button type="button" data-search-clear>Clear</button><button type="button" class="search-close" data-search-close aria-label="Close search">×</button></div>
    <div class="search-results" data-search-results></div>
  </aside>`);
const searchDrawer = document.querySelector('[data-search-drawer]');
const searchInput = document.querySelector('[data-search-input]');
const searchResults = document.querySelector('[data-search-results]');
const renderSearchResults = (query = '') => {
  const normalizedQuery = query.trim().toLowerCase();
  const matches = searchProducts.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery));
  searchResults.innerHTML = matches.length ? matches.map((product) => `<a class="search-result" href="product.html?product=${product.id}"><img src="${product.image}" alt="${product.name}" /><span><strong>${product.name}</strong><small>${product.category}</small><em>${product.compareAt ? `<del>${product.compareAt}</del> ` : ''}${product.price}</em></span></a>`).join('') : '<p class="search-empty">No products found.</p>';
};
const openSearch = () => {
  closeBag();
  renderSearchResults(searchInput.value);
  searchDrawer.classList.add('is-open');
  document.querySelector('.search-overlay').classList.add('is-open');
  searchDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('bag-is-open');
  window.requestAnimationFrame(() => searchInput.focus());
};
const closeSearch = () => {
  searchDrawer.classList.remove('is-open');
  document.querySelector('.search-overlay').classList.remove('is-open');
  searchDrawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('bag-is-open');
};
renderSearchResults();
document.querySelectorAll('[href="#search"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); openSearch(); }));
document.querySelectorAll('[data-search-close]').forEach((element) => element.addEventListener('click', closeSearch));
searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
document.querySelector('[data-search-clear]').addEventListener('click', () => { searchInput.value = ''; renderSearchResults(); searchInput.focus(); });
searchResults.addEventListener('click', closeSearch);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSearch(); });

const favoriteStorageKey = 'ruwa-favorites-v1';
let favoriteItems;
try {
  favoriteItems = JSON.parse(localStorage.getItem(favoriteStorageKey) || '[]');
} catch {
  favoriteItems = [];
}
const saveFavorites = () => localStorage.setItem(favoriteStorageKey, JSON.stringify(favoriteItems));
const getProductFromCard = (card) => {
  const name = card?.querySelector('h2, h3, .environment-mini-product strong')?.textContent.trim();
  const id = card?.dataset.productId || name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const category = card?.querySelector('.product-info p, .catalog-info p, .featured-info p, .feature-product-info p, .recommendation-card p, .mini-product__details p, .environment-mini-product small')?.textContent.trim() || 'Skin';
  const image = card?.querySelector('img')?.src || '';
  const priceElement = card?.querySelector('.product-info strong, .catalog-info strong, .featured-info strong, .feature-product-info strong, .recommendation-card strong, .mini-product__details strong, .environment-mini-product b');
  const priceText = priceElement?.textContent.match(/\$\s*[\d,.]+\s*$/)?.[0] || priceElement?.textContent.match(/\$\s*[\d,.]+/)?.[0];
  const price = Number(priceText?.replace(/[^\d.]/g, '')) || Number(card?.dataset.price) || 0;
  return name && price ? { id, name, category, price, image } : null;
};
const syncFavoriteButton = (button) => {
  const product = getProductFromCard(button.closest('.product-card, .catalog-card, .featured-card, .feature-product-card, .recommendation-card, .mini-product, .environment-mini-product'));
  const isFavorite = Boolean(product && favoriteItems.some((item) => item.id === product.id));
  button.classList.toggle('is-favorite', isFavorite);
  button.textContent = isFavorite ? '♥' : '♡';
};
const handleFavoriteToggle = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  const button = event.currentTarget;
  const product = getProductFromCard(button.closest('.product-card, .catalog-card, .featured-card, .feature-product-card, .recommendation-card, .mini-product, .environment-mini-product'));
  if (!product) return;
  const existingIndex = favoriteItems.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) favoriteItems.splice(existingIndex, 1);
  else favoriteItems.push(product);
  saveFavorites();
  syncFavoriteButton(button);
  window.renderFavoritesPage?.();
};
document.querySelectorAll('.favorite-button, .catalog-favorite, .recommendation-favorite').forEach((button) => {
  button.addEventListener('click', handleFavoriteToggle);
  syncFavoriteButton(button);
});

const bagCardSelectors = '.product-card, .catalog-card, .featured-card, .feature-product-card, .recommendation-card, .mini-product, .environment-mini-product';
const boundCardButtons = new WeakSet();
const handleCardAdd = (event) => {
  const button = event.currentTarget?.classList.contains('card-add-to-bag') ? event.currentTarget : event.target.closest('.card-add-to-bag');
  if (!button || !button.dataset.productName) return;
  event.preventDefault();
  event.stopPropagation();
  addBagItem({ id: button.dataset.productId, name: button.dataset.productName, category: button.dataset.productCategory, size: '50 ml', price: Number(button.dataset.productPrice), image: button.dataset.productImage });
};
document.querySelectorAll(bagCardSelectors).forEach((card) => {
  const title = card.querySelector('h2, h3, .environment-mini-product strong')?.textContent.trim();
  const category = card.querySelector('.product-info p, .catalog-info p, .featured-info p, .feature-product-info p, .recommendation-card p, .mini-product__details p, .environment-mini-product small')?.textContent.trim() || 'Skin';
  const image = card.querySelector('img')?.src;
  const priceElement = card.querySelector('.product-info strong, .catalog-info strong, .featured-info strong, .feature-product-info strong, .recommendation-card strong, .mini-product__details strong, .environment-mini-product b');
  const priceText = priceElement?.textContent.match(/\$\s*[\d,.]+\s*$/)?.[0] || priceElement?.textContent.match(/\$\s*[\d,.]+/)?.[0];
  const price = Number(priceText?.replace(/[^\d.]/g, '')) || Number(card.dataset.price) || 0;
  if (!title || !priceElement || !price) return;
  priceElement.classList.add('product-price');
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'card-add-to-bag';
  addButton.textContent = 'Add to bag';
  addButton.setAttribute('aria-label', `Add ${title} to bag`);
  addButton.dataset.productId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  addButton.dataset.productName = title;
  addButton.dataset.productCategory = category;
  addButton.dataset.productPrice = String(price);
  addButton.dataset.productImage = image;
  priceElement.insertAdjacentElement('afterend', addButton);
  addButton.addEventListener('click', handleCardAdd);
  boundCardButtons.add(addButton);
});
document.addEventListener('click', (event) => {
  const button = event.target.closest('.card-add-to-bag');
  if (!button) return;
  if (boundCardButtons.has(button)) return;
  if (!button.dataset.productName) return;
  event.preventDefault();
  event.stopPropagation();
  addBagItem({ id: button.dataset.productId, name: button.dataset.productName, category: button.dataset.productCategory, size: '50 ml', price: Number(button.dataset.productPrice), image: button.dataset.productImage });
});

const pagination = document.querySelectorAll('.pagination-dot');

pagination.forEach((dot) => {
  dot.addEventListener('click', () => {
    pagination.forEach((item) => {
      item.classList.remove('is-active');
      item.removeAttribute('aria-current');
    });
    dot.classList.add('is-active');
    dot.setAttribute('aria-current', 'true');
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenuMarkup = `<div class="mobile-menu-backdrop" data-mobile-menu-close></div><aside class="mobile-menu" data-mobile-menu aria-hidden="true"><div class="mobile-menu-header"><button type="button" data-mobile-menu-close>Close</button><strong>Ruwa Biosciences<sup>™</sup></strong><span aria-hidden="true"></span></div><nav class="mobile-menu-primary" data-mobile-primary aria-label="Mobile navigation"><button type="button" data-mobile-panel="collections">Categories <span>→</span></button><button type="button" data-mobile-panel="products">Products <span>→</span></button><button type="button" data-mobile-panel="brand">About Ruwa <span>→</span></button><a href="index.html#journal">Resources</a></nav><div class="mobile-menu-view" data-mobile-view hidden></div><div class="mobile-menu-secondary"><a href="#account">Account</a><a href="favorites.html">Favorites</a><a href="contact.html">Contact</a><a href="faqs.html">FAQs</a><a href="stockists.html">Distributors</a><a href="stores.html">Service areas</a></div></aside>`;
document.body.insertAdjacentHTML('beforeend', mobileMenuMarkup);
const mobileMenu = document.querySelector('[data-mobile-menu]');
const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
const mobileMenuView = document.querySelector('[data-mobile-view]');
const mobileMenuPrimary = document.querySelector('[data-mobile-primary]');
const closeMobileMenu = () => {
  mobileMenu?.classList.remove('is-open');
  mobileMenuBackdrop?.classList.remove('is-open');
  mobileMenu?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('mobile-menu-is-open');
  if (mobileMenuPrimary) mobileMenuPrimary.hidden = false;
  if (mobileMenuView) { mobileMenuView.hidden = true; mobileMenuView.replaceChildren(); }
  menuToggle?.setAttribute('aria-expanded', 'false');
};
const showMobilePanel = (name) => {
  const panel = document.querySelector(`[data-panel-content="${name}"]`);
  if (!panel || !mobileMenuView || !mobileMenuPrimary) return;
  mobileMenuPrimary.hidden = true;
  mobileMenuView.hidden = false;
  mobileMenuView.innerHTML = `<div class="mobile-submenu-header"><button type="button" data-mobile-back>‹</button><strong>${name === 'collections' ? 'Categories' : name === 'brand' ? 'About Ruwa' : 'Products'}</strong><a href="${name === 'collections' ? 'products.html' : name === 'brand' ? 'about.html' : 'products.html'}">View all</a></div>`;
  const content = panel.cloneNode(true);
  content.classList.add('mobile-submenu-content');
  mobileMenuView.appendChild(content);
  mobileMenuView.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));
  mobileMenuView.querySelector('[data-mobile-back]')?.addEventListener('click', () => { mobileMenuView.hidden = true; mobileMenuView.replaceChildren(); mobileMenuPrimary.hidden = false; });
};
menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  if (expanded) closeMobileMenu();
  else { mobileMenu?.classList.add('is-open'); mobileMenuBackdrop?.classList.add('is-open'); mobileMenu?.setAttribute('aria-hidden', 'false'); document.body.classList.add('mobile-menu-is-open'); menuToggle.setAttribute('aria-expanded', 'true'); }
});
document.querySelectorAll('[data-mobile-menu-close]').forEach((element) => element.addEventListener('click', closeMobileMenu));
document.querySelectorAll('[data-mobile-panel]').forEach((button) => button.addEventListener('click', () => showMobilePanel(button.dataset.mobilePanel)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMobileMenu(); });

document.querySelectorAll('.favorite-button').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    button.classList.toggle('is-favorite');
    button.textContent = button.classList.contains('is-favorite') ? '♥' : '♡';
  });
});

document.querySelectorAll('.collection-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.collection-tab').forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-selected');
    tab.setAttribute('aria-selected', 'true');
    const heading = document.querySelector('#trending-heading');
    if (heading) heading.textContent = tab.textContent + ' products';
  });
});

const megaPanels = document.querySelector('.mega-panels');
const navItems = document.querySelectorAll('.nav-item');
let closeTimer;

const pageRoutes = {
  '#collections': 'products.html',
  'index.html#collections': 'products.html',
  '#brand': 'about.html',
  'index.html#brand': 'about.html',
  'about.html#environment': 'environment.html',
  '#values': 'values.html',
  '#ingredients': 'ingredients.html',
  '#environment': 'environment.html',
  '#stores': 'stores.html',
  'index.html#stores': 'stores.html',
  '#favorites': 'favorites.html',
  'index.html#favorites': 'favorites.html',
  '#stockists': 'stockists.html',
  'index.html#stockists': 'stockists.html',
  '#faqs': 'faqs.html',
  'index.html#faqs': 'faqs.html',
  '#contact': 'contact.html',
  'index.html#contact': 'contact.html'
};
Object.entries(pageRoutes).forEach(([source, destination]) => {
  document.querySelectorAll(`a[href="${source}"]`).forEach((link) => { link.href = destination; });
});

const sharedPanelMarkup = {
  collections: '<section class="mega-panel mega-panel--collections" data-panel-content="collections" aria-label="Collections"><div class="panel-cards panel-cards--four"><a class="panel-card panel-card--blue" href="products.html"><span>Body Care</span></a><a class="panel-card panel-card--olive" href="products.html"><span>Skin Care</span></a><a class="panel-card panel-card--rose" href="products.html"><span>Hair Care</span></a><a class="panel-card panel-card--stone" href="products.html"><span>Kits</span></a></div></section>',
  products: '<section class="mega-panel mega-panel--products" data-panel-content="products" aria-label="Products"><div class="product-menu-links"><div><small>Shop</small><a href="products.html">All Products</a><a href="products.html">New Arrivals</a><a href="products.html">Bestsellers</a><a href="products.html">On Sale</a></div><div><small>Category</small><a href="products.html">Body</a><a href="products.html">Skin</a><a href="products.html">Hair</a></div></div></section>'
};
Object.entries(sharedPanelMarkup).forEach(([name, markup]) => {
  if (megaPanels && !megaPanels.querySelector(`[data-panel-content="${name}"]`)) megaPanels.insertAdjacentHTML('beforeend', markup);
});
document.querySelectorAll('[data-panel-content="brand"] .panel-other').forEach((other) => {
  other.innerHTML = '<small>Other</small><a href="stores.html">Stores</a><a href="stockists.html">Stockists</a><a href="faqs.html">FAQ\'s</a><a href="contact.html">Contact</a>';
});

const openMegaPanel = (name) => {
  window.clearTimeout(closeTimer);
  document.querySelectorAll('[data-panel-content]').forEach((panel) => {
    panel.classList.toggle('is-open', panel.dataset.panelContent === name);
  });
  megaPanels?.classList.add('is-open');
};

const closeMegaPanel = () => {
  closeTimer = window.setTimeout(() => {
    megaPanels?.classList.remove('is-open');
    document.querySelectorAll('[data-panel-content]').forEach((panel) => panel.classList.remove('is-open'));
  }, 100);
};

navItems.forEach((item) => {
  item.addEventListener('mouseenter', () => openMegaPanel(item.querySelector('.nav-trigger')?.dataset.panel));
  item.addEventListener('mouseleave', closeMegaPanel);
  item.addEventListener('focusin', () => openMegaPanel(item.querySelector('.nav-trigger')?.dataset.panel));
});
megaPanels?.addEventListener('mouseenter', () => window.clearTimeout(closeTimer));
megaPanels?.addEventListener('mouseleave', closeMegaPanel);

const carouselViewport = document.querySelector('[data-carousel-viewport]');
const featuredTrack = document.querySelector('[data-featured-track]');
const previousButton = document.querySelector('[data-carousel-prev]');
const nextButton = document.querySelector('[data-carousel-next]');
let originalFeaturedCards = featuredTrack ? [...featuredTrack.children] : [];
let featuredCardCount = originalFeaturedCards.length;
let carouselIndex = featuredCardCount;
let dragStartX = 0;
let dragStartOffset = 0;
let dragOffset = 0;
let isDragging = false;

function initializeFeaturedCarousel() {
  if (!featuredTrack) return;
  originalFeaturedCards = [...featuredTrack.children];
  featuredCardCount = originalFeaturedCards.length;
  carouselIndex = featuredCardCount;
  featuredTrack.style.transform = 'translate3d(0, 0, 0)';
  if (!featuredCardCount) return;
  featuredTrack.prepend(...originalFeaturedCards.map((card) => card.cloneNode(true)));
  featuredTrack.append(...originalFeaturedCards.map((card) => card.cloneNode(true)));
  updateCarousel();
}

const getCarouselStep = () => {
  const card = featuredTrack?.querySelector('.featured-card');
  return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(featuredTrack).gap) : 0;
};

const updateCarousel = (offset = null) => {
  if (!featuredTrack || !carouselViewport) return;
  const step = getCarouselStep();
  const x = offset === null ? -(carouselIndex * step) : offset;
  featuredTrack.style.transform = `translate3d(${x}px, 0, 0)`;
};

initializeFeaturedCarousel();

const resetCarouselPosition = () => {
  if (!featuredTrack || !featuredCardCount) return;
  if (carouselIndex >= featuredCardCount * 2) carouselIndex -= featuredCardCount;
  if (carouselIndex < featuredCardCount) carouselIndex += featuredCardCount;
  featuredTrack.style.transition = 'none';
  updateCarousel();
  window.requestAnimationFrame(() => { featuredTrack.style.transition = ''; });
};

const slideCarousel = (direction) => {
  if (!featuredTrack) return;
  carouselIndex += direction;
  featuredTrack.classList.add('is-sliding');
  window.requestAnimationFrame(() => updateCarousel());
};

previousButton?.addEventListener('click', () => slideCarousel(-1));
nextButton?.addEventListener('click', () => slideCarousel(1));
featuredTrack?.addEventListener('transitionend', (event) => {
  if (event.propertyName === 'transform') resetCarouselPosition();
});

const startDrag = (event) => {
  if (!carouselViewport || !featuredTrack) return;
  isDragging = true;
  dragStartX = event.clientX ?? event.touches?.[0]?.clientX;
  dragStartOffset = -(carouselIndex * getCarouselStep());
  dragOffset = dragStartOffset;
  carouselViewport.classList.add('is-dragging');
  carouselViewport.setPointerCapture?.(event.pointerId);
};
const moveDrag = (event) => {
  if (!isDragging) return;
  const currentX = event.clientX ?? event.touches?.[0]?.clientX;
  dragOffset = dragStartOffset + currentX - dragStartX;
  updateCarousel(dragOffset);
};
const endDrag = () => {
  if (!isDragging) return;
  isDragging = false;
  carouselViewport?.classList.remove('is-dragging');
  const distance = dragOffset - dragStartOffset;
  if (Math.abs(distance) > 50) carouselIndex += distance < 0 ? 1 : -1;
  updateCarousel();
};

carouselViewport?.addEventListener('pointerdown', startDrag);
carouselViewport?.addEventListener('pointermove', moveDrag);
carouselViewport?.addEventListener('pointerup', endDrag);
carouselViewport?.addEventListener('pointercancel', endDrag);
carouselViewport?.addEventListener('pointerleave', () => { if (isDragging) endDrag(); });
window.addEventListener('resize', () => updateCarousel());
updateCarousel();

const shopSlides = [...document.querySelectorAll('.shops-slide')];
const shopPrevious = document.querySelector('[data-shop-prev]');
const shopNext = document.querySelector('[data-shop-next]');
let shopIndex = 0;
let shopTimer;

const showShopSlide = (nextIndex) => {
  if (!shopSlides.length) return;
  shopIndex = (nextIndex + shopSlides.length) % shopSlides.length;
  shopSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === shopIndex));
};
const restartShopTimer = () => {
  window.clearInterval(shopTimer);
  shopTimer = window.setInterval(() => showShopSlide(shopIndex + 1), 5000);
};

shopPrevious?.addEventListener('click', () => { showShopSlide(shopIndex - 1); restartShopTimer(); });
shopNext?.addEventListener('click', () => { showShopSlide(shopIndex + 1); restartShopTimer(); });
if (shopSlides.length > 1) restartShopTimer();

const testimonialCards = [...document.querySelectorAll('.testimonial-card')];
const testimonialDots = [...document.querySelectorAll('.testimonial-dot')];
let testimonialIndex = 1;
const showTestimonial = (index) => {
  if (!testimonialCards.length) return;
  testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
  testimonialCards.forEach((card, cardIndex) => card.classList.toggle('is-current', cardIndex === testimonialIndex));
  testimonialDots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === testimonialIndex));
  if (window.matchMedia('(min-width: 781px)').matches) {
    const card = testimonialCards[testimonialIndex];
    const offset = -(card.offsetLeft - (window.innerWidth - card.offsetWidth) / 2);
    document.querySelector('.testimonial-track')?.style.setProperty('transform', `translateX(${offset}px)`);
  }
};
testimonialDots.forEach((dot, index) => dot.addEventListener('click', () => showTestimonial(index)));
if (testimonialCards.length) showTestimonial(testimonialIndex);

const subscribeForm = document.querySelector('[data-subscribe-form]');
const subscribeSuccess = document.querySelector('[data-subscribe-success]');
subscribeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  subscribeForm.hidden = true;
  if (subscribeSuccess) subscribeSuccess.hidden = false;
});

document.querySelectorAll('[data-contact-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.querySelectorAll('input, textarea, button').forEach((field) => { field.disabled = true; });
    const success = form.querySelector('[data-contact-success]');
    if (success) success.hidden = false;
  });
});

const productCatalog = document.querySelector('[data-catalog-grid]');
if (productCatalog) {
  const catalogCards = [...productCatalog.querySelectorAll('[data-product-card]')];
  const filterInputs = [...document.querySelectorAll('.products-filters input')];
  const sortProducts = document.querySelector('[data-sort-products]');
  const resultsCount = document.querySelector('[data-results-count]');
  const clearFilters = document.querySelector('[data-clear-filters]');
  const filterAside = document.querySelector('.products-filters');
  const mobileFilterToggle = document.querySelector('[data-mobile-filter-toggle]');

  mobileFilterToggle?.addEventListener('click', () => {
    const isOpen = filterAside?.classList.toggle('is-open');
    mobileFilterToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });

  const renderCatalog = () => {
    const activeFilters = filterInputs.filter((input) => input.checked);
    const groups = ['collection', 'category', 'type'];
    const matches = (card) => groups.every((group) => {
      const selected = activeFilters.filter((input) => input.name === group).map((input) => input.value);
      return !selected.length || selected.includes(card.dataset[group]);
    });
    const visibleCards = catalogCards.filter(matches);
    const ordered = [...visibleCards].sort((a, b) => {
      if (sortProducts?.value === 'low') return Number(a.dataset.price) - Number(b.dataset.price);
      if (sortProducts?.value === 'high') return Number(b.dataset.price) - Number(a.dataset.price);
      if (sortProducts?.value === 'name') return a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);
      return catalogCards.indexOf(a) - catalogCards.indexOf(b);
    });
    catalogCards.forEach((card) => { card.hidden = true; });
    ordered.forEach((card) => { card.hidden = false; productCatalog.appendChild(card); });
    if (resultsCount) resultsCount.textContent = `${ordered.length} products`;
  };
  document.querySelectorAll('.catalog-image').forEach((link) => {
    const title = link.closest('.catalog-card')?.querySelector('h2')?.textContent.trim();
    if (title) link.href = `product.html?product=${encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`;
  });
  filterInputs.forEach((input) => input.addEventListener('change', renderCatalog));
  sortProducts?.addEventListener('change', renderCatalog);
  clearFilters?.addEventListener('click', () => { filterInputs.forEach((input) => { input.checked = false; }); renderCatalog(); });
  document.querySelectorAll('.filter-group__title').forEach((button) => button.addEventListener('click', () => {
    const group = button.parentElement;
    const collapsed = group.classList.toggle('is-collapsed');
    button.setAttribute('aria-expanded', String(!collapsed));
    group.querySelectorAll('label').forEach((label) => { label.hidden = collapsed; });
    button.querySelector('span').textContent = collapsed ? '⌄' : '⌃';
  }));
  document.querySelectorAll('.catalog-favorite').forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault();
    button.classList.toggle('is-favorite');
    button.textContent = button.classList.contains('is-favorite') ? '♥' : '♡';
  }));
  renderCatalog();
}

document.querySelectorAll('[href="#body-cream"]').forEach((link) => { link.href = 'product.html'; });

const imageStrip = document.querySelector('[data-image-strip]');
const productThumbs = [...document.querySelectorAll('.product-thumb')];
productThumbs.forEach((thumb) => thumb.addEventListener('click', () => {
  const index = Number(thumb.dataset.image);
  productThumbs.forEach((item) => { item.classList.remove('is-selected'); item.setAttribute('aria-selected', 'false'); });
  thumb.classList.add('is-selected');
  thumb.setAttribute('aria-selected', 'true');
  if (imageStrip) imageStrip.style.transform = `translateY(-${index * 100}%)`;
}));

document.querySelectorAll('.size-option').forEach((option) => option.addEventListener('click', () => {
  document.querySelectorAll('.size-option').forEach((item) => item.classList.remove('is-selected'));
  option.classList.add('is-selected');
}));

const quantity = document.querySelector('[data-quantity]');
document.querySelector('[data-quantity-minus]')?.addEventListener('click', () => { if (quantity) quantity.textContent = Math.max(1, Number(quantity.textContent) - 1); });
document.querySelector('[data-quantity-plus]')?.addEventListener('click', () => { if (quantity) quantity.textContent = Number(quantity.textContent) + 1; });
document.querySelector('[data-add-cart]')?.addEventListener('click', (event) => {
  const name = document.querySelector('#product-title')?.textContent.trim() || 'Body Cream';
  const category = document.querySelector('.product-detail-category')?.textContent.trim() || 'Skin';
  const price = Number(document.querySelector('.product-details-panel strong')?.textContent.replace(/[^\d.]/g, '')) || 49;
  const image = document.querySelector('.product-image-strip img')?.src || 'https://framerusercontent.com/images/tuQYhg1jfjMTQ4Baswx5DJGLI.jpg';
  const size = document.querySelector('.size-option.is-selected')?.textContent.trim() || '100 ml';
  addBagItem({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, category, size, price, image }, Number(quantity?.textContent) || 1);
  event.currentTarget.textContent = 'Added to cart';
});
document.querySelectorAll('.detail-accordion').forEach((button) => button.addEventListener('click', () => {
  button.classList.toggle('is-open');
  button.querySelector('span').textContent = button.classList.contains('is-open') ? '−' : '+';
}));

const ingredientTabs = [...document.querySelectorAll('.ingredient-tab')];
const ingredientImage = document.querySelector('[data-ingredient-image]');
const ingredientDescription = document.querySelector('[data-ingredient-description]');
const ingredientData = [
  { name: 'Shea Butter', image: 'https://framerusercontent.com/images/PXt8gPRGYlMI7i88dq23fnBdiQ.jpg', text: 'Rich in vitamins and fatty acids, shea butter deeply nourishes and hydrates the skin while promoting a smooth and supple texture. Known for its soothing and anti-inflammatory properties, it helps protect against dryness, irritation, and environmental damage, making it ideal for all skin types.' },
  { name: 'Hyaluronic Acid', image: 'https://framerusercontent.com/images/STJc5naSqcZ3mkXNvWbqyjqlDHg.jpg', text: 'Hyaluronic acid helps draw in moisture and leaves skin feeling plump, fresh, and comfortably hydrated throughout the day.' },
  { name: 'Vitamin E', image: 'https://framerusercontent.com/images/FMSlLkSksHJIXau0oE8XqJQc0.jpg', text: 'A nourishing antioxidant that helps support the skin barrier and protect the complexion from everyday environmental stress.' },
  { name: 'Cocoa Butter', image: 'https://framerusercontent.com/images/QHePlVBtjDPN3uX14Q2GLZhDM.jpg', text: 'Cocoa butter melts into dry skin to soften rough areas and seal in lasting moisture without a heavy finish.' }
];
ingredientTabs.forEach((tab) => tab.addEventListener('click', () => {
  const index = Number(tab.dataset.ingredient);
  ingredientTabs.forEach((item) => item.classList.remove('is-active'));
  tab.classList.add('is-active');
  if (ingredientImage) { ingredientImage.style.opacity = '0'; window.setTimeout(() => { ingredientImage.src = ingredientData[index].image; ingredientImage.alt = ingredientData[index].name; ingredientImage.style.opacity = '1'; }, 180); }
  if (ingredientDescription) ingredientDescription.textContent = ingredientData[index].text;
}));

const renderRuwaProductAttributes = (product) => {
  if (!product || !ingredientTabs.length) return;
  const attributes = product.attributes && typeof product.attributes === 'object' ? product.attributes : {};
  const labelFor = (key) => String(key).replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const entries = Object.entries(attributes)
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
    .map(([name, value]) => ({ name: labelFor(name), text: Array.isArray(value) ? value.join(', ') : String(value), image: ruwaProductImage(product) }));
  const sharedEntries = [
    ['Category', product.category],
    ['Manufacturer / brand', product.manufacturer],
    ['Pack size / unit', product.pack_size || product.unit_of_sale],
    ['Product code', product.sku]
  ].filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
    .map(([name, value]) => ({ name, text: String(value), image: ruwaProductImage(product) }));
  const information = [...entries, ...sharedEntries].slice(0, ingredientTabs.length);
  while (information.length < ingredientTabs.length) information.push({ name: 'Ruwa product information', text: 'Product details and technical information are available from Ruwa Biosciences.', image: ruwaProductImage(product) });
  ingredientData.splice(0, ingredientData.length, ...information);
  ingredientTabs.forEach((tab, index) => {
    tab.dataset.ingredient = String(index);
    tab.querySelector('span').textContent = information[index].name;
    tab.hidden = false;
  });
  if (ingredientDescription) ingredientDescription.textContent = information[0].text;
  if (ingredientImage) { ingredientImage.src = information[0].image; ingredientImage.alt = `${product.title} product information`; }
  document.querySelector('.see-all-link')?.replaceChildren(document.createTextNode('See all product information '), document.createElement('span'));
};

const productDetails = {
  'body-cream': { name: 'Body Cream', category: 'Skin', price: '$49.00', image: 'https://framerusercontent.com/images/tuQYhg1jfjMTQ4Baswx5DJGLI.jpg', description: 'A rich, deeply moisturizing body cream that hydrates and nourishes your skin. Infused with skin-loving ingredients, it restores softness and elasticity, leaving your skin silky-smooth and replenished.' },
  'eye-serum': { name: 'Eye Serum', category: 'Body', price: '$79.00', image: 'https://framerusercontent.com/images/tuQYhg1jfjMTQ4Baswx5DJGLI.jpg', description: 'A lightweight, brightening serum that smooths the delicate eye area and helps reduce the look of tiredness.' },
  'hair-serum': { name: 'Hair Serum', category: 'Hair', price: '$49.00', image: 'https://framerusercontent.com/images/ISzRY509rGdiVqHU8xK0JXMoYk.jpg', description: 'A weightless finishing serum that smooths frizz, adds shine, and leaves hair soft without a greasy finish.' },
  'eye-repair': { name: 'Eye Repair', category: 'Body', price: '$63.20', image: 'https://framerusercontent.com/images/FMSlLkSksHJIXau0oE8XqJQc0.jpg', description: 'A restorative eye treatment designed to replenish moisture and leave the eye area looking fresh and rested.' },
  'scalp-detox': { name: 'Scalp Detox', category: 'Hair', price: '$49.00', image: 'https://framerusercontent.com/images/QHePlVBtjDPN3uX14Q2GLZhDM.jpg', description: 'A balancing scalp treatment that refreshes the roots and helps create a clean, comfortable foundation for healthy hair.' },
  'body-wash': { name: 'Body Wash', category: 'Body', price: '$49.00', image: 'https://framerusercontent.com/images/ISzRY509rGdiVqHU8xK0JXMoYk.jpg', description: 'A gentle, nourishing body wash that cleanses without stripping the skin of its natural moisture.' },
  'body-serum': { name: 'Body Serum', category: 'Skin', price: '$48.30', image: 'https://framerusercontent.com/images/STJc5naSqcZ3mkXNvWbqyjqlDHg.jpg', description: 'A concentrated body serum that delivers lightweight hydration and a smooth, luminous finish.' },
  'hair-oil': { name: 'Hair Oil', category: 'Hair', price: '$49.00', image: 'https://framerusercontent.com/images/eqgroJMQvwMy92wfars1DTFBta8.jpg', description: 'A nourishing botanical oil that softens dry strands, smooths flyaways, and brings natural-looking shine.' },
  'body-lotion': { name: 'Body Lotion', category: 'Body', price: '$39.00', image: 'https://framerusercontent.com/images/QHePlVBtjDPN3uX14Q2GLZhDM.jpg', description: 'A daily body lotion that absorbs quickly to hydrate, soften, and protect dry skin.' },
  'radiant-cream': { name: 'Radiant Cream', category: 'Skin', price: '$59.00', image: 'https://framerusercontent.com/images/FMSlLkSksHJIXau0oE8XqJQc0.jpg', description: 'A plush face cream that cushions skin with lasting hydration and a healthy, radiant finish.' },
  'body-oil': { name: 'Body Oil', category: 'Body', price: '$46.00', image: 'https://framerusercontent.com/images/STJc5naSqcZ3mkXNvWbqyjqlDHg.jpg', description: 'A silky body oil that locks in moisture and leaves skin supple, smooth, and softly scented.' }
};
const selectedProductKey = new URLSearchParams(window.location.search).get('product');
const selectedProduct = selectedProductKey ? productDetails[selectedProductKey] : null;
if (selectedProduct) {
  const detailName = document.querySelector('#product-title');
  const detailCategory = document.querySelector('.product-detail-category');
  const detailPrice = document.querySelector('.product-detail-heading strong');
  const detailDescription = document.querySelector('.product-description');
  if (detailName) detailName.textContent = selectedProduct.name;
  if (detailCategory) detailCategory.textContent = selectedProduct.category;
  if (detailPrice) detailPrice.textContent = selectedProduct.price;
  if (detailDescription) detailDescription.textContent = selectedProduct.description;
  const leadImage = document.querySelector('.product-image-strip img');
  const leadThumb = document.querySelector('.product-thumb img');
  if (leadImage) { leadImage.src = selectedProduct.image; leadImage.alt = `${selectedProduct.name} product view`; }
  if (leadThumb) { leadThumb.src = selectedProduct.image; leadThumb.alt = `${selectedProduct.name} thumbnail`; }
  document.title = `${selectedProduct.name} — All Natural`;
}

document.addEventListener('click', (event) => {
  const productLink = event.target.closest?.('.catalog-image');
  if (!productLink || event.target.closest('button')) return;
  const title = productLink.closest('.catalog-card')?.querySelector('h2')?.textContent.trim();
  if (!title || !document.querySelector('[data-catalog-grid]')) return;
  event.preventDefault();
  window.location.href = `product.html?product=${encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`;
});

window.renderFavoritesPage = () => {
  const grid = document.querySelector('[data-favorites-grid]');
  const empty = document.querySelector('[data-favorites-empty]');
  const count = document.querySelector('[data-favorites-count]');
  if (!grid) return;
  if (count) count.textContent = `${favoriteItems.length} product${favoriteItems.length === 1 ? '' : 's'}`;
  if (empty) empty.hidden = favoriteItems.length > 0;
  grid.innerHTML = favoriteItems.map((product) => `<article class="catalog-card" data-product-card data-product-id="${product.id}" data-price="${product.price}"><a class="catalog-image" href="product.html?product=${product.id}"><img src="${product.image}" alt="${product.name}" loading="lazy" /><button class="catalog-favorite is-favorite" type="button" aria-label="Remove ${product.name} from favorites">♥</button></a><div class="catalog-info"><div><h2>${product.name}</h2><p title="${product.category}">${product.category}</p></div><strong class="product-price">${formatMoney(product.price)}</strong><button class="card-add-to-bag" type="button" data-product-id="${product.id}" data-product-name="${product.name}" data-product-category="${product.category}" data-product-price="${product.price}" data-product-image="${product.image}">Add to bag</button></div></article>`).join('');
  grid.querySelectorAll('.catalog-favorite').forEach((button) => button.addEventListener('click', handleFavoriteToggle));
};
window.renderFavoritesPage();

const renderRuwaCheckoutSummary = () => {
  const checkoutItems = document.querySelector('[data-checkout-items]');
  const checkoutTotal = document.querySelector('[data-checkout-total]');
  if (!checkoutItems || !checkoutTotal) return;
  const checkoutSubtotal = bagItems.reduce((total, item) => total + item.price * item.quantity, 0);
  checkoutItems.innerHTML = bagItems.length ? bagItems.map((item) => `<div class="checkout-item"><img src="${item.image}" alt="${item.name}" /><div><strong>${item.name}</strong><span>${item.quantity} × ${formatMoney(item.price)}</span></div><b>${formatMoney(item.price * item.quantity)}</b></div>`).join('') : '<p class="checkout-empty">Your bag is empty. Add a product before checking out.</p>';
  checkoutTotal.textContent = formatMoney(checkoutSubtotal);
};
renderRuwaCheckoutSummary();
document.querySelector('[data-mpesa-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const success = form.querySelector('[data-mpesa-success]');
  form.querySelectorAll('input, button').forEach((field) => { field.disabled = true; });
  if (button) button.textContent = 'Prompt sent';
  if (success) success.hidden = false;
});

document.querySelectorAll('.recommendation-favorite').forEach((button) => button.addEventListener('click', (event) => {
  event.preventDefault();
  button.classList.toggle('is-favorite');
  button.textContent = button.classList.contains('is-favorite') ? '♥' : '♡';
}));
const RUWA_CONTENT_VERSION = '1.0';
const ruwaImages = [
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1583912086096-8c60c8a7f7f8?auto=format&fit=crop&w=1200&q=85'
];
const ruwaTextReplacements = new Map([
  ['All Natural', 'Ruwa Biosciences'], ['ALL NATURAL', 'RUWA BIOSCIENCES'], ['AllNaturalSkin', 'RuwaBiosciences'], ['Perfume Store', 'Ruwa Biosciences'],
  ['fragrance', 'medical equipment'], ['Fragrance', 'Medical equipment'], ['skincare', 'healthcare supply'], ['Skincare', 'Healthcare supply'],
  ['skin care', 'healthcare supply'], ['Skin Care', 'Healthcare supply'], ['body care', 'clinic supplies'], ['Body Care', 'Clinic supplies'],
  ['hair care', 'laboratory supplies'], ['Hair Care', 'Laboratory supplies'], ['scent', 'product specification'], ['Scent', 'Product specification'],
  ['ingredients', 'quality information'], ['Ingredients', 'Quality information'], ['Shop All', 'Shop Medical Products'], ['Shop all', 'Shop medical products'],
  ['Stay in the loop', 'Stay informed'], ['Be the first to know about new collections and exclusive offers.', 'Receive product updates and healthcare supply insights.'],
  ['The next wave of natural skincare.', 'Reliable point-of-care and healthcare supply solutions.'], ['Featured in', 'Healthcare solutions'], ['Follow us', 'Connect with Ruwa'],
  ['Journal', 'Resources'], ['Brand', 'About Ruwa'], ['Collections', 'Categories'], ['Stores', 'Service areas'], ['Stockists', 'Distributors'], ['Environment', 'Our standards'],
  ['Body', 'RDT Kits'], ['Skin', 'Laboratory Consumables'], ['Hair', 'POC Equipment'], ['Kits', 'Clinic Infrastructure'], ['New Arrivals', 'New products'],
  ['Bestsellers', 'Popular products'], ['On Sale', 'Available products'], ['Gift Cards', 'Request a quote'], ['Cream', 'Diagnostic kit'], ['Lotion', 'Meter'],
  ['Cleanser', 'Consumable'], ['Oil', 'Equipment'], ['Serum', 'Reagent'], ['Prices shown in USD.', 'Prices shown in Kenyan Shillings (KES).'], ['USD', 'KES'],
  ['US', 'KE'], ['Shopify by Framer Commerce', 'Ruwa Biosciences'], ['Made by ena', 'Nairobi, Kenya']
]);
const ruwaProductReplacements = new Map([
  ['Body Lotion', 'Malaria PF/PAN'], ['Radiant Cream', 'H. Pylori Ag'], ['Nourish Hair Oil', 'Urinalysis Strips (10 Para)'], ['Daily Cleanser', 'Chlamydia Kits'],
  ['Eye Serum', 'Mission Hb Machine'], ['Hair Serum', 'Sinocare Glucose Test Strips'], ['Eye Repair', 'Hepatitis B Strips'], ['Scalp Detox', 'VDRL'],
  ['Body Cream', 'Sinocare Blood Sugar Machine'], ['Body Wash', 'Red Top Vacutainer Tubes'], ['Body Serum', 'PSA Cassette'], ['Hair Oil', 'Fetal Doppler (JPD 100E)'],
  ['Body Essentials Kit', 'Blood Grouping Set'], ['Hair Care Kit', 'Laboratory Consumables Pack'], ['Body Milk', 'Blood Bags (Single)'], ['Brightening Serum', 'Gonorrhea Kits'],
  ['Scalp Cleanser', 'Stool Containers'], ['Skin Ritual Kit', 'Clinic Starter Equipment Kit'], ['Hand Cream', 'Yellow Pipette Tips'], ['Body Oil', 'Blue Pipette Tips']
]);
const replaceRuwaText = (value) => {
  let result = value;
  ruwaProductReplacements.forEach((replacement, original) => { result = result.replaceAll(original, replacement); });
  ruwaTextReplacements.forEach((replacement, original) => { result = result.replaceAll(original, replacement); });
  return result;
};
const applyRuwaContent = () => {
  document.title = replaceRuwaText(document.title);
  document.querySelectorAll('.site-header .brand').forEach((brand) => {
    if (brand.querySelector('.brand-logo')) return;
    brand.textContent = '';
    const logo = document.createElement('img');
    logo.className = 'brand-logo';
    logo.src = 'assets/Logo/Ruwa%20Bioscience%20logo.png';
    logo.alt = 'Ruwa Biosciences';
    brand.appendChild(logo);
  });
  document.querySelectorAll('.site-footer').forEach((footer) => {
    if (footer.querySelector('.footer-wordmark')) return;
    const wordmark = document.createElement('div');
    wordmark.className = 'footer-wordmark';
    wordmark.setAttribute('aria-label', 'Ruwa Biosciences');
    wordmark.innerHTML = '<span class="footer-wordmark__ruwa">Ruwa<sup>™</sup></span> <span class="footer-wordmark__biosciences">Biosciences</span>';
    const footerBottom = footer.querySelector('.footer-bottom');
    if (footerBottom) footerBottom.before(wordmark);
    else footer.appendChild(wordmark);
  });
  document.querySelectorAll('meta[name="description"], [aria-label], [alt], [title], input[placeholder]').forEach((element) => {
    ['content', 'aria-label', 'alt', 'title', 'placeholder'].forEach((attribute) => { if (element.hasAttribute(attribute)) element.setAttribute(attribute, replaceRuwaText(element.getAttribute(attribute))); });
  });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => { if (node.parentElement && !['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) node.nodeValue = replaceRuwaText(node.nodeValue).replace(/\$(\d[\d,.]*)/g, 'KES $1'); });
  document.querySelectorAll('img').forEach((image, index) => {
    const productMedia = image.closest('.admin-product-card, .catalog-card, .product-card, .featured-card, .feature-product-card, .recommendation-card, .mini-product, .environment-mini-product, .bag-item, .checkout-item, [data-favorites-grid], [data-checkout-items], .product-detail');
    if (!productMedia && !image.src.includes('/assets/')) image.src = ruwaImages[index % ruwaImages.length];
  });
  const socialImages = [
    ['assets/Medical%20shop/medical-shop.png', 'Ruwa Biosciences medical equipment display'],
    ['assets/categories/Laboratory%20consumables.jpg', 'Laboratory consumables and sample collection supplies'],
    ['assets/categories/POC.jpg', 'Point-of-care diagnostic equipment and testing supplies'],
    ['assets/categories/RDT%20clinic%20infrasctrructures.jpg', 'Rapid diagnostic testing and clinic infrastructure supplies'],
    ['assets/shop%20healthcare%20supply/Gemini_Generated_Image_zgkcbazgkcbazgkc.jpg', 'Healthcare supply and point-of-care service environment']
  ];
  document.querySelectorAll('.gallery-grid .gallery-item').forEach((item, index) => {
    const [src, alt] = socialImages[index] || socialImages[0];
    const image = item.querySelector('img');
    if (image) { image.src = src; image.alt = alt; }
    item.setAttribute('aria-label', index === 0 ? 'Follow Ruwa Biosciences on Instagram' : `View Ruwa Biosciences healthcare post ${index + 1}`);
  });
  const stayInformedVideos = [
    'assets/stay%20informed/Teal_test_kit_floating_upwards_20260924083918.mp4',
    'assets/stay%20informed/Medical_testing_equipment_and_vials_20260924114432.mp4'
  ];
  const pageSeed = `${window.location.pathname}${window.location.search}`;
  const pageHash = [...pageSeed].reduce((total, character) => total + character.charCodeAt(0), 0);
  const stayInformedVideoIndex = pageHash % stayInformedVideos.length;
  document.querySelectorAll('.newsletter-background').forEach((media) => {
    let video = media;
    if (media.tagName !== 'VIDEO') {
      video = document.createElement('video');
      video.className = media.className;
      video.setAttribute('aria-label', 'Ruwa healthcare testing equipment');
      media.replaceWith(video);
    }
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = stayInformedVideos[stayInformedVideoIndex];
    video.load();
  });
  document.querySelectorAll('video').forEach((video) => { if (!video.getAttribute('src')) video.poster = ruwaImages[0]; });
  const heroHeading = document.querySelector('.hero h1');
  if (heroHeading) heroHeading.innerHTML = 'Point-of-care<br class="desktop-break" /> solutions for better care';
  const heroEyebrow = document.querySelector('.hero .eyebrow');
  if (heroEyebrow) heroEyebrow.textContent = 'Diagnostics & medical equipment';
  const aboutHeading = document.querySelector('#about-title');
  if (aboutHeading) aboutHeading.textContent = 'Reliable medical supply solutions for clinics, laboratories, hospitals, and healthcare professionals.';
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => { link.href = 'mailto:ruwabiosciences@gmail.com'; link.textContent = 'ruwabiosciences@gmail.com'; });
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => { link.href = 'tel:+254796755202'; link.textContent = '0796 755 202'; });
};
applyRuwaContent();

const applyRuwaProductPanelLinks = () => {
  const panelGroups = document.querySelectorAll('.mega-panel--products .product-menu-links > div');
  const groups = [
    [
      ['All Products', 'products.html'],
      ['New products', 'products.html?collection=new'],
      ['Popular products', 'products.html?collection=bestseller'],
      ['Available products', 'products.html?collection=available'],
      ['Clinic Infrastructure', 'products.html?category=clinic-infrastructure']
    ],
    [
      ['RDT Kits & Reagents', 'products.html?category=rdt-kits'],
      ['Laboratory Consumables', 'products.html?category=laboratory-consumables'],
      ['POC Equipment', 'products.html?category=poc-equipment'],
      ['Clinic Infrastructure', 'products.html?category=clinic-infrastructure']
    ],
    [
      ['Diagnostic Kits', 'products.html?category=rdt-kits'],
      ['Meters', 'products.html?category=poc-equipment'],
      ['Consumables', 'products.html?category=laboratory-consumables'],
      ['Clinic Equipment', 'products.html?category=clinic-infrastructure'],
      ['Reagents', 'products.html?category=rdt-kits']
    ]
  ];
  panelGroups.forEach((group, groupIndex) => {
    (groups[groupIndex] || []).forEach(([label, href], index) => {
      const link = group.querySelectorAll('a')[index];
      if (link) { link.textContent = label; link.href = href; }
    });
  });
};
applyRuwaProductPanelLinks();

/* Database-backed storefront catalogue. Static starter cards are replaced once
   active products are loaded from Supabase; the existing CSS and interactions remain. */
const ruwaSlug = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const escapeRuwaHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
const ruwaProductImage = (product) => product.image_urls?.[0] || product.image_url || 'assets/categories/POC.jpg';
const ruwaCategorySlug = (category = '') => {
  if (category.toLowerCase().includes('rdt')) return 'rdt-kits';
  if (category.toLowerCase().includes('laboratory')) return 'laboratory-consumables';
  if (category.toLowerCase().includes('clinic')) return 'clinic-infrastructure';
  return 'poc-equipment';
};
const ruwaProductCard = (product, className = 'catalog-card') => {
  const id = product.id || ruwaSlug(product.title);
  const tags = product.product_tags || [];
  const badge = tags.includes('new') ? '<span class="catalog-badge">New</span>' : tags.includes('featured') ? '<span class="catalog-badge">Featured</span>' : '';
  const image = escapeRuwaHtml(ruwaProductImage(product));
  const title = escapeRuwaHtml(product.title);
  const category = escapeRuwaHtml(product.category || 'Medical product');
  const price = Number(product.price || 0).toFixed(2);
  const imageClass = className === 'catalog-card' ? 'catalog-image' : className === 'featured-card' ? 'featured-image' : className === 'recommendation-card' ? 'recommendation-image' : 'product-image-wrapper';
  const favoriteClass = className === 'catalog-card' ? 'catalog-favorite' : className === 'recommendation-card' ? 'recommendation-favorite' : 'favorite-button';
  const infoClass = className === 'catalog-card' ? 'catalog-info' : className === 'featured-card' ? 'featured-info' : className === 'recommendation-card' ? 'recommendation-info' : 'product-info';
  return `<article class="${className}" data-product-card data-product-id="${escapeRuwaHtml(id)}" data-collection="${escapeRuwaHtml(tags.join(' '))}" data-category="${ruwaCategorySlug(product.category)}" data-type="${ruwaCategorySlug(product.category)}" data-price="${price}"><a class="${imageClass}" href="product.html?product=${encodeURIComponent(id)}" aria-label="View ${title}"><img src="${image}" alt="${title}" loading="lazy" />${badge}<button class="${favoriteClass}" type="button" aria-label="Add ${title} to favorites">♡</button></a><div class="${infoClass}"><div><${className === 'catalog-card' ? 'h2' : 'h3'}>${title}</${className === 'catalog-card' ? 'h2' : 'h3'}><p title="${category}">${category}</p></div><strong>${product.currency || 'KES'} ${price}</strong><button class="card-add-to-bag" type="button" data-product-id="${escapeRuwaHtml(id)}" data-product-name="${title}" data-product-category="${category}" data-product-price="${price}" data-product-image="${image}">Add to bag</button></div></article>`;
};
const renderRuwaFeatureProduct = (products) => {
  const card = document.querySelector('[data-db-feature-product]');
  if (!card) return;
  const hasUploadedImage = (item) => Boolean(item.image_urls?.[0] || item.image_url);
  const product = products.find((item) => Array.isArray(item.product_tags) && item.product_tags.includes('featured') && hasUploadedImage(item)) || products.find(hasUploadedImage);
  if (!product) return;
  const id = product.id || ruwaSlug(product.title);
  const image = ruwaProductImage(product);
  const price = Number(product.price || 0).toFixed(2);
  card.dataset.productId = id;
  card.dataset.price = price;
  card.dataset.category = ruwaCategorySlug(product.category);
  card.querySelector('.feature-product-image').href = `product.html?product=${encodeURIComponent(id)}`;
  card.querySelector('.feature-product-badge').textContent = product.product_tags?.includes('new') ? 'New' : 'Featured';
  const productImage = card.querySelector('.feature-product-image img');
  productImage.src = image;
  productImage.alt = `${product.title} medical product`;
  card.querySelector('.feature-product-image .favorite-button').setAttribute('aria-label', `Add ${product.title} to favorites`);
  card.querySelector('.feature-product-info h3').textContent = product.title || 'Healthcare product';
  card.querySelector('.feature-product-info p').textContent = product.category || 'Medical product';
  card.querySelector('.feature-product-info strong').textContent = `${product.currency || 'KES'} ${price}`;
};
const renderRuwaMiniFeature = (products) => {
  const card = document.querySelector('[data-db-mini-feature]');
  if (!card) return;
  const hasUploadedImage = (item) => Boolean(item.image_urls?.[0] || item.image_url);
  const product = products.find((item) => Array.isArray(item.product_tags) && item.product_tags.includes('featured') && hasUploadedImage(item)) || products.find(hasUploadedImage);
  if (!product) return;
  const id = product.id || ruwaSlug(product.title);
  card.href = `product.html?product=${encodeURIComponent(id)}`;
  const image = card.querySelector('img');
  if (image) { image.src = ruwaProductImage(product); image.alt = `${product.title} medical product`; }
  card.querySelector('h3').textContent = product.title || 'Healthcare product';
  card.querySelector('p').textContent = product.category || 'Medical product';
  card.querySelector('strong').textContent = `${product.currency || 'KES'} ${Number(product.price || 0).toFixed(2)}`;
};
const renderRuwaCategoryPanel = (products) => {
  const categoryCards = document.querySelectorAll('.mega-panel--collections .panel-cards--four .panel-card');
  const categories = [
    ['RDT Kits & Reagents', 'rdt-kits'],
    ['Laboratory Consumables', 'laboratory-consumables'],
    ['POC Equipment', 'poc-equipment'],
    ['Clinic Infrastructure', 'clinic-infrastructure']
  ];
  categoryCards.forEach((card, index) => {
    const [label, slug] = categories[index] || categories[0];
    const product = products.find((item) => ruwaCategorySlug(item.category) === slug && (item.image_urls?.[0] || item.image_url));
    card.href = `products.html?category=${slug}`;
    const text = card.querySelector('span');
    if (text) text.textContent = label;
    const image = card.querySelector('img');
    if (image && product) { image.src = ruwaProductImage(product); image.alt = `${product.title} in ${label}`; }
  });
};
const ensureRuwaSupabase = () => new Promise((resolve, reject) => {
  if (window.supabaseRequest) return resolve();
  const existing = document.querySelector('script[data-ruwa-supabase]');
  if (existing) { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', reject, { once: true }); return; }
  const configScript = document.createElement('script');
  configScript.src = 'supabase-config.js';
  configScript.dataset.ruwaSupabase = 'true';
  configScript.onload = resolve;
  configScript.onerror = () => reject(new Error('Could not load Supabase configuration.'));
  document.head.appendChild(configScript);
});
const showRuwaCatalogMessage = (message) => {
  document.querySelectorAll('[data-catalog-grid], [data-product-grid], [data-featured-track], .recommendations-grid').forEach((grid) => {
    if (grid) grid.innerHTML = `<p class="catalog-empty">${escapeRuwaHtml(message)}</p>`;
  });
};
const renderRuwaDatabaseProducts = (products) => {
  window.__ruwaProducts = products;
  const syncSavedItems = (items) => {
    items.forEach((saved) => {
      const current = products.find((product) => product.id === saved.id || ruwaSlug(product.title) === saved.id || product.title === saved.name);
      if (!current) return;
      saved.id = current.id;
      saved.name = current.title;
      saved.category = current.category;
      saved.price = Number(current.price || 0);
      saved.image = ruwaProductImage(current);
    });
  };
  syncSavedItems(favoriteItems);
  syncSavedItems(bagItems);
  saveFavorites();
  saveBag();
  renderBag();
  renderRuwaCheckoutSummary();
  window.renderFavoritesPage?.();
  const productsHero = document.querySelector('[data-db-products-hero]');
  const requestedCategory = new URLSearchParams(window.location.search).get('category') || new URLSearchParams(window.location.search).get('type');
  const heroProduct = products.find((item) => requestedCategory && ruwaCategorySlug(item.category) === requestedCategory && (item.image_urls?.[0] || item.image_url)) || products.find((item) => item.image_urls?.[0] || item.image_url);
  if (productsHero && heroProduct) {
    productsHero.src = ruwaProductImage(heroProduct);
    productsHero.alt = `${heroProduct.title} medical product`;
  }
  const categoryLabels = { 'rdt-kits': 'RDT Kits & Reagents', 'laboratory-consumables': 'Laboratory Consumables', 'poc-equipment': 'POC Equipment', 'clinic-infrastructure': 'Clinic Infrastructure' };
  const introHeading = document.querySelector('#shop-all-heading');
  const introCopy = document.querySelector('.shop-all-copy p');
  if (introHeading) introHeading.textContent = categoryLabels[requestedCategory] || 'Shop Medical Products';
  if (introCopy) introCopy.textContent = requestedCategory && categoryLabels[requestedCategory] ? `Browse ${categoryLabels[requestedCategory].toLowerCase()} supplied by Ruwa Biosciences.` : 'Point-of-care diagnostics, laboratory consumables, and clinic equipment for healthcare professionals.';
  renderRuwaFeatureProduct(products);
  renderRuwaMiniFeature(products);
  renderRuwaCategoryPanel(products);
  searchProducts.splice(0, searchProducts.length, ...products.map((product) => ({ id: product.id, name: product.title, category: product.category, price: `${product.currency || 'KES'} ${Number(product.price || 0).toFixed(2)}`, image: ruwaProductImage(product) })));
  const catalogGrid = document.querySelector('[data-catalog-grid]');
  if (catalogGrid) catalogGrid.innerHTML = products.map((product) => ruwaProductCard(product)).join('');
  const productGrid = document.querySelector('[data-product-grid]');
  if (productGrid) productGrid.innerHTML = products.slice(0, 4).map((product) => ruwaProductCard(product, 'product-card')).join('');
  const featuredTrack = document.querySelector('[data-featured-track]');
  if (featuredTrack) {
    const taggedFeatured = products.filter((product) => Array.isArray(product.product_tags) && product.product_tags.includes('featured'));
    const featuredProducts = (taggedFeatured.length ? taggedFeatured : products).slice(0, 6);
    featuredTrack.innerHTML = featuredProducts.map((product) => ruwaProductCard(product, 'featured-card')).join('');
    initializeFeaturedCarousel();
  }
  document.querySelectorAll('.recommendations-grid').forEach((recommendations) => { recommendations.innerHTML = products.slice(0, 4).map((product) => ruwaProductCard(product, 'recommendation-card')).join(''); });
  document.querySelectorAll('.products-filters input[name="category"], .products-filters input[name="type"]').forEach((input) => {
    const labels = { 'rdt-kits': 'RDT Kits & Reagents', 'laboratory-consumables': 'Laboratory Consumables', 'poc-equipment': 'POC Equipment', 'clinic-infrastructure': 'Clinic Infrastructure' };
    input.value = input.value in labels ? input.value : ruwaCategorySlug(input.value);
    const label = input.closest('label'); if (label) label.lastChild.textContent = ` ${labels[input.value] || input.value}`;
  });
  const count = document.querySelector('[data-results-count]'); if (count) count.textContent = `${products.length} products`;
  const filterDatabaseCatalog = () => {
    const selected = [...document.querySelectorAll('.products-filters input:checked')].map((input) => input.value);
    const sort = document.querySelector('[data-sort-products]')?.value || 'featured';
    const cards = [...(document.querySelector('[data-catalog-grid]')?.querySelectorAll('.catalog-card') || [])];
    const ordered = cards.filter((card) => !selected.length || selected.some((value) => value === 'available' || value === 'all' || value === card.dataset.category || value === card.dataset.type || card.dataset.collection.split(' ').includes(value))).sort((a, b) => sort === 'low' ? Number(a.dataset.price) - Number(b.dataset.price) : sort === 'high' ? Number(b.dataset.price) - Number(a.dataset.price) : sort === 'name' ? a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent) : cards.indexOf(a) - cards.indexOf(b));
    cards.forEach((card) => { card.hidden = true; }); ordered.forEach((card) => { card.hidden = false; document.querySelector('[data-catalog-grid]').appendChild(card); });
    if (count) count.textContent = `${ordered.length} products`;
  };
  document.querySelectorAll('.products-filters input').forEach((input) => input.addEventListener('change', filterDatabaseCatalog));
  document.querySelector('[data-sort-products]')?.addEventListener('change', filterDatabaseCatalog);
  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => { document.querySelectorAll('.products-filters input').forEach((input) => { input.checked = false; }); filterDatabaseCatalog(); });
  const requestedFilter = new URLSearchParams(window.location.search).get('category') || new URLSearchParams(window.location.search).get('type') || new URLSearchParams(window.location.search).get('collection');
  if (requestedFilter) {
    filterAside?.classList.add('is-open');
    mobileFilterToggle?.setAttribute('aria-expanded', 'true');
    const matchingInput = [...document.querySelectorAll('.products-filters input')].find((input) => input.value === requestedFilter);
    if (matchingInput) { matchingInput.checked = true; filterDatabaseCatalog(); }
  }
  document.querySelectorAll('.catalog-card, .product-card, .featured-card, .recommendation-card, .feature-product-card').forEach((card) => {
    card.querySelectorAll('.catalog-favorite, .favorite-button, .recommendation-favorite').forEach((button) => button.addEventListener('click', handleFavoriteToggle));
  });
};
const renderRuwaProductDetail = (products) => {
  const key = new URLSearchParams(window.location.search).get('product');
  if (!key || !document.querySelector('.product-detail')) return;
  const product = products.find((item) => item.id === key || ruwaSlug(item.title) === key);
  if (!product) { document.querySelector('#product-title')?.replaceChildren(document.createTextNode('Product unavailable')); return; }
  const image = ruwaProductImage(product);
  const title = document.querySelector('#product-title'); const category = document.querySelector('.product-detail-category'); const price = document.querySelector('.product-detail-heading strong'); const description = document.querySelector('.product-description');
  if (title) title.textContent = product.title;
  if (category) category.textContent = product.category;
  if (price) price.textContent = `${product.currency || 'KES'} ${Number(product.price || 0).toFixed(2)}`;
  if (description) description.textContent = product.description || product.short_description || 'Product information available from Ruwa Biosciences.';
  renderRuwaProductAttributes(product);
  document.title = `${product.title} — Ruwa Biosciences`;
  document.querySelectorAll('.product-image-strip img, .product-thumb img').forEach((element) => { element.src = image; element.alt = `${product.title} product image`; });
};
const loadRuwaDatabaseProducts = async () => {
  try {
    await ensureRuwaSupabase();
    const products = await window.supabaseRequest('products?select=*&is_active=eq.true&order=created_at.desc');
    renderRuwaDatabaseProducts(products || []);
    renderRuwaProductDetail(products || []);
    document.documentElement.classList.remove('ruwa-data-pending');
  } catch (error) {
    console.error(error);
    document.documentElement.classList.remove('ruwa-data-pending');
    showRuwaCatalogMessage('The Ruwa catalogue is currently unavailable. Please run the Supabase products migration or try again later.');
  }
};
loadRuwaDatabaseProducts();
