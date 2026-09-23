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
document.querySelector('[data-add-cart]')?.addEventListener('click', (event) => { event.currentTarget.textContent = 'Added to cart'; });
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

document.querySelectorAll('.recommendation-favorite').forEach((button) => button.addEventListener('click', (event) => {
  event.preventDefault();
  button.classList.toggle('is-favorite');
  button.textContent = button.classList.contains('is-favorite') ? '♥' : '♡';
}));
