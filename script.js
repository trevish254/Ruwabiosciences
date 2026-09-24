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
const formatMoney = (value) => `$${value.toFixed(2)}`;
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
  { id: 'body-serum', name: 'Body Serum', category: 'Serum', price: '$48.30 USD', compareAt: '$69.00 USD', image: 'https://framerusercontent.com/images/STJc5naSqcZ3mkXNvWbqyjqlDHg.jpg' },
  { id: 'eye-serum', name: 'Eye Serum', category: 'Serum', price: '$79.00 USD', image: 'https://framerusercontent.com/images/tuQYhg1jfjMTQ4Baswx5DJGLI.jpg' },
  { id: 'hair-serum', name: 'Hair Serum', category: 'Serum', price: '$49.00 USD', image: 'https://framerusercontent.com/images/ISzRY509rGdiVqHU8xK0JXMoYk.jpg' },
  { id: 'scalp-detox', name: 'Scalp Detox', category: 'Serum', price: '$49.00 USD', image: 'https://framerusercontent.com/images/QHePlVBtjDPN3uX14Q2GLZhDM.jpg' },
  { id: 'balance-kit', name: 'Balance Kit', category: 'Serum', price: '$89.00 USD', image: 'https://framerusercontent.com/images/FMSlLkSksHJIXau0oE8XqJQc0.jpg' },
  { id: 'body-cream', name: 'Body Cream', category: 'Skin', price: '$49.00 USD', image: 'https://framerusercontent.com/images/tuQYhg1jfjMTQ4Baswx5DJGLI.jpg' },
  { id: 'body-wash', name: 'Body Wash', category: 'Body', price: '$49.00 USD', image: 'https://framerusercontent.com/images/ISzRY509rGdiVqHU8xK0JXMoYk.jpg' },
  { id: 'face-toner', name: 'Face Toner', category: 'Skin', price: '$69.00 USD', image: 'https://framerusercontent.com/images/FMSlLkSksHJIXau0oE8XqJQc0.jpg' }
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
  const category = card?.querySelector('.product-info p, .catalog-info p, .featured-info p, .feature-product-info p, .recommendation-card p, .mini-product__details p, .environment-mini-product small')?.textContent.trim() || 'Skin';
  const image = card?.querySelector('img')?.src || '';
  const priceElement = card?.querySelector('.product-info strong, .catalog-info strong, .featured-info strong, .feature-product-info strong, .recommendation-card strong, .mini-product__details strong, .environment-mini-product b');
  const priceText = priceElement?.textContent.match(/\$\s*[\d,.]+\s*$/)?.[0] || priceElement?.textContent.match(/\$\s*[\d,.]+/)?.[0];
  const price = Number(priceText?.replace(/[^\d.]/g, '')) || Number(card?.dataset.price) || 0;
  return name && price ? { id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, category, price, image } : null;
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
menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
});

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
const originalFeaturedCards = featuredTrack ? [...featuredTrack.children] : [];
const featuredCardCount = originalFeaturedCards.length;
let carouselIndex = featuredCardCount;
let dragStartX = 0;
let dragStartOffset = 0;
let dragOffset = 0;
let isDragging = false;

if (featuredTrack && featuredCardCount) {
  featuredTrack.prepend(...originalFeaturedCards.map((card) => card.cloneNode(true)));
  featuredTrack.append(...originalFeaturedCards.map((card) => card.cloneNode(true)));
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
  grid.innerHTML = favoriteItems.map((product) => `<article class="catalog-card" data-price="${product.price}"><a class="catalog-image" href="product.html?product=${product.id}"><img src="${product.image}" alt="${product.name}" loading="lazy" /><button class="catalog-favorite is-favorite" type="button" aria-label="Remove ${product.name} from favorites">♥</button></a><div class="catalog-info"><div><h2>${product.name}</h2><p>${product.category}</p></div><strong class="product-price">$${Number(product.price).toFixed(2)}</strong><button class="card-add-to-bag" type="button" data-product-id="${product.id}" data-product-name="${product.name}" data-product-category="${product.category}" data-product-price="${product.price}" data-product-image="${product.image}">Add to bag</button></div></article>`).join('');
  grid.querySelectorAll('.catalog-favorite').forEach((button) => button.addEventListener('click', handleFavoriteToggle));
};
window.renderFavoritesPage();

const checkoutItems = document.querySelector('[data-checkout-items]');
const checkoutTotal = document.querySelector('[data-checkout-total]');
if (checkoutItems && checkoutTotal) {
  const checkoutSubtotal = bagItems.reduce((total, item) => total + item.price * item.quantity, 0);
  checkoutItems.innerHTML = bagItems.length ? bagItems.map((item) => `<div class="checkout-item"><img src="${item.image}" alt="${item.name}" /><div><strong>${item.name}</strong><span>${item.quantity} × ${formatMoney(item.price)}</span></div><b>${formatMoney(item.price * item.quantity)}</b></div>`).join('') : '<p class="checkout-empty">Your bag is empty. Add a product before checking out.</p>';
  checkoutTotal.textContent = formatMoney(checkoutSubtotal);
}
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
