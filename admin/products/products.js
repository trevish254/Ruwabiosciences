const grid = document.querySelector('#admin-products-grid');
const productSearch = document.querySelector('#product-search');
const productFilter = document.querySelector('#product-filter');
const emptyProducts = document.querySelector('#empty-products');
const productModal = document.querySelector('#product-modal');
const productForm = document.querySelector('#product-form');
const databaseStatus = document.querySelector('#database-status');
let selectedImages = [];
let existingImageUrls = [];
const productsById = new Map();
grid.replaceChildren();

const setDatabaseStatus = (message, state = '') => { if (databaseStatus) { databaseStatus.textContent = message; databaseStatus.className = `database-status ${state}`; } };
const getProductCards = () => [...grid.querySelectorAll('.admin-product-card')];
if (productFilter && !productFilter.querySelector('[value="draft"]')) productFilter.insertAdjacentHTML('beforeend', '<option value="live">Live products</option><option value="draft">Drafts</option>');
const filterProducts = () => { const query = productSearch.value.toLowerCase().trim(); const filter = productFilter.value; let visible = 0; getProductCards().forEach((card) => { const matchesQuery = card.dataset.name.toLowerCase().includes(query); const matchesFilter = filter === 'all' || (filter === 'live' && card.dataset.status === 'live') || (filter === 'draft' && card.dataset.status === 'draft') || card.dataset.tag === filter || (filter === 'low' && card.dataset.stock === 'low'); card.hidden = !(matchesQuery && matchesFilter); if (!card.hidden) visible += 1; }); emptyProducts.hidden = visible > 0; };

const createProductCard = (product) => {
  const tags = product.product_tags || []; const badge = !product.is_active ? 'Draft' : tags.includes('bestseller') ? 'Bestseller' : tags.includes('new') ? 'New' : tags.includes('featured') ? 'Featured' : '';
  const card = document.createElement('article'); card.className = 'admin-product-card'; card.dataset.id = product.id || ''; card.dataset.name = product.title; card.dataset.tag = tags[0] || 'all'; card.dataset.status = product.is_active === false ? 'draft' : 'live'; card.dataset.stock = Number(product.stock_quantity) < 10 ? 'low' : 'ok';
  const image = document.createElement('div'); image.className = 'admin-product-image'; if (badge) { const badgeElement = document.createElement('span'); badgeElement.textContent = badge; image.append(badgeElement); }
  const options = document.createElement('button'); options.type = 'button'; options.setAttribute('aria-label', 'Edit product'); options.textContent = '→'; const imageElement = document.createElement('img'); imageElement.src = product.image_urls?.[0] || product.image_url || 'https://framerusercontent.com/images/S9bF5xZAKeF1uY3MNzTaUj2jts.png'; imageElement.alt = product.title; image.append(options, imageElement);
  const info = document.createElement('div'); info.className = 'admin-product-info'; const title = document.createElement('strong'); title.textContent = product.title; const price = document.createElement('span'); price.textContent = `${product.currency || 'KES'} ${Number(product.price).toFixed(2)} · ${product.category || 'Medical product'}`; info.append(title, price); card.append(image, info); return card;
};

const createImageRemoveButton = (kind, index) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'image-preview-remove'; button.dataset.removeImage = kind; button.dataset.imageIndex = String(index); button.setAttribute('aria-label', `Remove ${kind} image ${index + 1}`); button.textContent = '×'; return button; };
const renderImagePreviews = (previewGrid) => { previewGrid.replaceChildren(); selectedImages.forEach((file, index) => { const preview = document.createElement('div'); preview.className = 'image-preview'; const image = document.createElement('img'); image.src = URL.createObjectURL(file); image.alt = `Product image ${index + 1}`; const label = document.createElement('small'); label.textContent = `${index + 1} / 3`; preview.append(image, label, createImageRemoveButton('selected', index)); previewGrid.append(preview); }); };
const renderExistingImagePreviews = (previewGrid, urls) => { previewGrid.replaceChildren(); urls.forEach((url, index) => { const preview = document.createElement('div'); preview.className = 'image-preview'; const image = document.createElement('img'); image.src = url; image.alt = `Current product image ${index + 1}`; const label = document.createElement('small'); label.textContent = `${index + 1} / ${urls.length}`; preview.append(image, label, createImageRemoveButton('existing', index)); previewGrid.append(preview); }); };

const setupImageUploader = () => {
  const field = document.createElement('fieldset'); field.className = 'image-upload-fieldset'; field.innerHTML = '<legend>Product images <span>(up to 3)</span></legend><label class="image-dropzone" tabindex="0"><input id="product-images" type="file" accept="image/*" multiple /><strong>Add 1–3 images</strong><small>Choose or drop images one at a time</small></label><div class="image-preview-grid" id="image-preview-grid"></div><p class="image-upload-message" id="image-upload-message">Select at least 1 image. You can add up to 3.</p>';
  productForm.insertBefore(field, productForm.querySelector('.tag-fieldset')); const input = field.querySelector('#product-images'); const dropzone = field.querySelector('.image-dropzone'); const previewGrid = field.querySelector('#image-preview-grid'); const message = field.querySelector('#image-upload-message');
  const acceptFiles = (files) => { const incoming = [...files].filter((file) => file.type.startsWith('image/')); const combined = [...selectedImages, ...incoming]; if (incoming.length !== files.length || combined.length > 3) { message.textContent = 'Please add image files only, with a maximum of 3 images.'; message.className = 'image-upload-message error'; return; } selectedImages = combined; renderImagePreviews(previewGrid); message.textContent = `${selectedImages.length} image${selectedImages.length === 1 ? '' : 's'} ready. You can add ${3 - selectedImages.length} more.`; message.className = 'image-upload-message ready'; };
  input.addEventListener('change', () => acceptFiles(input.files)); dropzone.addEventListener('dragover', (event) => { event.preventDefault(); dropzone.classList.add('dragging'); }); dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragging')); dropzone.addEventListener('drop', (event) => { event.preventDefault(); dropzone.classList.remove('dragging'); acceptFiles(event.dataTransfer.files); }); dropzone.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') input.click(); }); return message;
};

const imageUploadMessage = setupImageUploader();
const imagePreviewGrid = document.querySelector('#image-preview-grid');
imagePreviewGrid?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-image]');
  if (!button) return;
  const index = Number(button.dataset.imageIndex);
  if (button.dataset.removeImage === 'selected') {
    selectedImages.splice(index, 1);
    renderImagePreviews(imagePreviewGrid);
    imageUploadMessage.textContent = selectedImages.length ? `${selectedImages.length} image${selectedImages.length === 1 ? '' : 's'} ready.` : 'No new images selected.';
  } else {
    existingImageUrls.splice(index, 1);
    renderExistingImagePreviews(imagePreviewGrid, existingImageUrls);
    imageUploadMessage.textContent = existingImageUrls.length ? `${existingImageUrls.length} existing image${existingImageUrls.length === 1 ? '' : 's'} will be kept.` : 'All existing images removed. Save to update the product.';
  }
  imageUploadMessage.className = 'image-upload-message ready';
});
const categoryAttributes = document.querySelector('#category-attributes');
const updateCategoryAttributes = () => {
  const category = document.querySelector('[name="category"]')?.value || '';
  const key = category.startsWith('RDT') ? 'rdt' : category.startsWith('Laboratory') ? 'consumable' : category.startsWith('POC') ? 'poc' : 'infrastructure';
  categoryAttributes?.querySelectorAll('[data-category]').forEach((field) => { field.hidden = field.dataset.category !== key; });
};
document.querySelector('[name="category"]')?.addEventListener('change', updateCategoryAttributes);
const uploadImagesToCloudinary = async () => {
  if (selectedImages.length < 1 || selectedImages.length > 3) throw new Error('Please select between 1 and 3 product images.');
  const config = window.SUPABASE_CONFIG;
  if (!config.cloudinaryCloudName || config.cloudinaryCloudName.startsWith('REPLACE_')) throw new Error('Add your Cloudinary cloud name in supabase-config.js.');
  if (!config.cloudinaryUploadPreset || config.cloudinaryUploadPreset.startsWith('REPLACE_')) throw new Error('Add your unsigned Cloudinary upload preset in supabase-config.js.');
  if (config.cloudinaryCloudName === config.cloudinaryUploadPreset) throw new Error('Cloudinary cloud name and upload preset cannot be the same. Use your Cloud name for cloudinaryCloudName and your unsigned preset name for cloudinaryUploadPreset.');
  return Promise.all(selectedImages.map(async (file) => {
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', config.cloudinaryUploadPreset);
    if (config.cloudinaryFolder) body.append('folder', config.cloudinaryFolder);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`, { method: 'POST', body });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.secure_url) throw new Error(result.error?.message || 'Cloudinary upload failed.');
    return result.secure_url;
  }));
};

const loadProducts = async () => { try { const products = await window.supabaseRequest('products?select=*&order=created_at.desc'); products.forEach((product) => productsById.set(product.id, product)); grid.replaceChildren(...products.map(createProductCard)); setDatabaseStatus(products.length ? `${products.length} saved products loaded` : 'Connected — ready for your first product', 'connected'); filterProducts(); } catch (error) { console.error(error); grid.replaceChildren(); setDatabaseStatus('Catalog is offline — run supabase-products.sql to connect it', 'error'); filterProducts(); } };

const deleteButton = document.createElement('button'); deleteButton.className = 'modal-delete'; deleteButton.type = 'button'; deleteButton.textContent = 'Delete product'; deleteButton.hidden = true; productForm.querySelector('.modal-actions').prepend(deleteButton);
const duplicateButton = document.createElement('button'); duplicateButton.className = 'modal-cancel'; duplicateButton.type = 'button'; duplicateButton.textContent = 'Duplicate product'; duplicateButton.hidden = true; productForm.querySelector('.modal-actions').prepend(duplicateButton);
const closeProductModal = () => { productModal.hidden = true; document.body.style.overflow = ''; productForm.removeAttribute('data-editing-id'); selectedImages = []; existingImageUrls = []; };
const openProductModal = (product = null) => {
  const statusInput = productForm.querySelector('[name="status"]');
  if (statusInput) statusInput.value = product?.is_active === false ? 'draft' : 'live';
  productForm.reset(); selectedImages = []; existingImageUrls = product?.image_urls?.length ? product.image_urls : (product?.image_url ? [product.image_url] : []); productForm.dataset.editingId = product?.id || ''; productModal.querySelector('#modal-title').textContent = product ? 'Edit product' : 'Add a product'; productForm.querySelector('.modal-submit').innerHTML = product ? 'Update product <span>→</span>' : 'Save product <span>→</span>'; deleteButton.hidden = !product; duplicateButton.hidden = !product;
  if (product) { productForm.querySelector('[name="title"]').value = product.title || ''; productForm.querySelector('[name="sku"]').value = product.sku || ''; productForm.querySelector('[name="category"]').value = product.category || 'POC meters and diagnostic equipment'; productForm.querySelector('[name="manufacturer"]').value = product.manufacturer || ''; productForm.querySelector('[name="price"]').value = product.price ?? ''; productForm.querySelector('[name="unit_of_sale"]').value = product.unit_of_sale || 'Unit'; productForm.querySelector('[name="pack_size"]').value = product.pack_size || ''; productForm.querySelector('[name="stock"]').value = product.stock_quantity ?? ''; productForm.querySelector('[name="minimum_order_quantity"]').value = product.minimum_order_quantity ?? 1; productForm.querySelector('[name="short_description"]').value = product.short_description || ''; productForm.querySelector('[name="description"]').value = product.description || ''; productForm.querySelector('[name="delivery_notes"]').value = product.delivery_notes || ''; productForm.querySelectorAll('[name="flag"]').forEach((input) => { input.checked = (product.product_tags || []).includes(input.value); }); productForm.querySelector('[name="request_quote"]').checked = Boolean(product.request_quote); Object.entries(product.attributes || {}).forEach(([key, value]) => { const input = productForm.querySelector(`[name="attr_${key}"]`); if (input) input.value = value; }); renderExistingImagePreviews(imagePreviewGrid, existingImageUrls); imageUploadMessage.textContent = existingImageUrls.length ? 'Current images shown. Add new images only if you want to replace them.' : 'No current images. Add 1–3 images.'; } else { imagePreviewGrid.replaceChildren(); imageUploadMessage.textContent = 'Select at least 1 image. You can add up to 3.'; }
  updateCategoryAttributes();
  productModal.hidden = false; document.body.style.overflow = 'hidden'; productForm.querySelector('input[name="title"]').focus();
};
document.querySelector('#open-product-modal').addEventListener('click', () => openProductModal()); grid.addEventListener('click', (event) => { const card = event.target.closest('.admin-product-card'); if (!card) return; const product = productsById.get(card.dataset.id); if (product) openProductModal(product); }); productModal.querySelectorAll('[data-close-modal]').forEach((element) => element.addEventListener('click', closeProductModal)); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !productModal.hidden) closeProductModal(); });

deleteButton.addEventListener('click', async () => { const id = productForm.dataset.editingId; if (!id || !window.confirm('Delete this product permanently?')) return; deleteButton.disabled = true; deleteButton.textContent = 'Deleting...'; try { await window.supabaseRequest(`products?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' }); grid.querySelector(`[data-id="${id}"]`)?.remove(); productsById.delete(id); closeProductModal(); filterProducts(); setDatabaseStatus('Product permanently deleted', 'connected'); } catch (error) { console.error(error); setDatabaseStatus('Could not delete product — check Supabase policies', 'error'); } finally { deleteButton.disabled = false; deleteButton.textContent = 'Delete product'; } });

productForm.addEventListener('submit', async (event) => {
  event.preventDefault(); const submitButton = productForm.querySelector('.modal-submit'); const data = new FormData(productForm); const editingId = productForm.dataset.editingId; const attributes = {}; ['test_name', 'specimen', 'storage', 'expiry', 'material', 'sterile', 'equipment_type', 'power_warranty', 'compatibility', 'dimensions', 'material_capacity', 'installation'].forEach((key) => { const value = data.get(`attr_${key}`)?.trim(); if (value) attributes[key] = value; }); const product = { title: data.get('title').trim(), sku: data.get('sku').trim(), category: data.get('category'), manufacturer: data.get('manufacturer').trim(), short_description: data.get('short_description').trim(), price: Number(data.get('price')), currency: 'KES', unit_of_sale: data.get('unit_of_sale').trim() || 'Unit', pack_size: data.get('pack_size').trim(), description: data.get('description').trim(), stock_quantity: Number(data.get('stock')), minimum_order_quantity: Number(data.get('minimum_order_quantity')) || 1, delivery_notes: data.get('delivery_notes').trim(), request_quote: data.get('request_quote') === 'true', attributes, product_tags: data.getAll('flag'), image_urls: existingImageUrls };
  product.is_active = data.get('status') === 'live';
  submitButton.disabled = true; submitButton.textContent = editingId ? 'Updating...' : 'Saving...';
  try { imageUploadMessage.textContent = selectedImages.length ? 'Uploading images to Cloudinary...' : 'Saving product...'; imageUploadMessage.className = 'image-upload-message ready'; if (selectedImages.length) { product.image_urls = await uploadImagesToCloudinary(); imageUploadMessage.textContent = 'Images uploaded. Saving their URLs to Supabase...'; } else if (!editingId && !product.image_urls.length) throw new Error('Please select at least 1 product image.'); const savedProducts = await window.supabaseRequest(editingId ? `products?id=eq.${encodeURIComponent(editingId)}` : 'products', { method: editingId ? 'PATCH' : 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(product) }); const savedProduct = savedProducts[0]; productsById.set(savedProduct.id, savedProduct); const updatedCard = createProductCard(savedProduct); const oldCard = [...grid.querySelectorAll('.admin-product-card')].find((card) => card.dataset.id === savedProduct.id); if (oldCard) oldCard.replaceWith(updatedCard); else grid.prepend(updatedCard); productForm.reset(); selectedImages = []; imagePreviewGrid.replaceChildren(); imageUploadMessage.textContent = 'No images selected.'; imageUploadMessage.className = 'image-upload-message'; closeProductModal(); setDatabaseStatus(editingId ? 'Product updated' : 'Product saved to catalog', 'connected'); filterProducts(); } catch (error) { console.error(error); imageUploadMessage.textContent = error.message; imageUploadMessage.className = 'image-upload-message error'; setDatabaseStatus('Could not save product — check Cloudinary, Supabase, and RLS settings', 'error'); } finally { submitButton.disabled = false; submitButton.innerHTML = editingId ? 'Update product <span>→</span>' : 'Save product <span>→</span>'; }
});

productSearch.addEventListener('input', filterProducts); productFilter.addEventListener('change', filterProducts); loadProducts();

duplicateButton.addEventListener('click', async () => {
  const original = productsById.get(productForm.dataset.editingId);
  if (!original) return;
  duplicateButton.disabled = true;
  duplicateButton.textContent = 'Duplicating...';
  try {
    const duplicate = { ...original, title: `${original.title} (Copy)`, sku: original.sku ? `${original.sku}-COPY` : '', image_urls: [...(original.image_urls || [])], product_tags: [...(original.product_tags || [])], attributes: { ...(original.attributes || {}) } };
    delete duplicate.id;
    delete duplicate.created_at;
    delete duplicate.updated_at;
    const savedProducts = await window.supabaseRequest('products', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(duplicate) });
    const savedProduct = savedProducts?.[0];
    if (!savedProduct) throw new Error('Supabase did not return the duplicated product. Check the products table INSERT policy.');
    productsById.set(savedProduct.id, savedProduct);
    grid.prepend(createProductCard(savedProduct));
    closeProductModal();
    filterProducts();
    setDatabaseStatus('Product duplicated successfully', 'connected');
  } catch (error) {
    console.error(error);
    setDatabaseStatus('Could not duplicate product — check Supabase policies', 'error');
  } finally {
    duplicateButton.disabled = false;
    duplicateButton.textContent = 'Duplicate product';
  }
});
