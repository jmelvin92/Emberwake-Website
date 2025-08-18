/**
 * Shopify Integration Module
 * Handles all Shopify Buy Button SDK functionality
 */

let shopifyClient = null;
let shopifyCart = null;
let productCache = {};
let currentPage = 1;

/**
 * Initialize Shopify client and cart
 */
window.initializeShopify = async function() {
    // Check if configuration is available
    if (typeof SHOPIFY_CONFIG === 'undefined' || !SHOPIFY_CONFIG.domain || !SHOPIFY_CONFIG.storefrontAccessToken) {
        console.warn('Shopify configuration not found or incomplete');
        showFallbackMerch();
        return;
    }
    
    // Check if SDK is loaded
    if (!window.ShopifyBuy) {
        console.error('Shopify Buy SDK not loaded');
        showFallbackMerch();
        return;
    }
    
    try {
        // Initialize Shopify client
        shopifyClient = window.ShopifyBuy.buildClient({
            domain: SHOPIFY_CONFIG.domain,
            storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
            language: 'en'
        });
        
        // Initialize UI components
        const ui = window.ShopifyBuy.UI.init(shopifyClient);
        
        // Load existing cart or create new one
        await initializeCart();
        
        // Load products
        await loadProducts();
        
        // Show cart toggle button
        document.getElementById('cart-toggle').style.display = 'flex';
        
    } catch (error) {
        console.error('Failed to initialize Shopify:', error);
        showFallbackMerch();
    }
};

/**
 * Initialize shopping cart
 */
async function initializeCart() {
    try {
        // Check for existing cart in localStorage
        const existingCartId = localStorage.getItem('shopify_cart_id');
        
        if (existingCartId) {
            // Fetch existing cart
            shopifyCart = await shopifyClient.checkout.fetch(existingCartId);
            
            // Check if cart is still valid
            if (shopifyCart.completedAt) {
                // Cart has been completed, create new one
                shopifyCart = await shopifyClient.checkout.create();
                localStorage.setItem('shopify_cart_id', shopifyCart.id);
            }
        } else {
            // Create new cart
            shopifyCart = await shopifyClient.checkout.create();
            localStorage.setItem('shopify_cart_id', shopifyCart.id);
        }
        
        // Update cart UI
        updateCartUI();
        
    } catch (error) {
        console.error('Failed to initialize cart:', error);
        // Create new cart on error
        shopifyCart = await shopifyClient.checkout.create();
        localStorage.setItem('shopify_cart_id', shopifyCart.id);
    }
}

/**
 * Load and display products
 */
async function loadProducts(append = false) {
    const gridContainer = document.getElementById('shopify-product-grid');
    const loadingDiv = gridContainer.querySelector('.merch-loading');
    
    try {
        // Show loading state
        if (!append) {
            loadingDiv.style.display = 'block';
        }
        
        // Check cache first
        const cacheKey = `products_page_${currentPage}`;
        let products;
        
        if (productCache[cacheKey] && SHOPIFY_CONFIG.performance.cacheProducts) {
            products = productCache[cacheKey];
        } else {
            // Fetch products from Shopify
            if (SHOPIFY_CONFIG.featuredCollectionId) {
                // Load from specific collection
                const collection = await shopifyClient.collection.fetchWithProducts(
                    SHOPIFY_CONFIG.featuredCollectionId,
                    { productsFirst: SHOPIFY_CONFIG.productsPerPage }
                );
                products = collection.products;
            } else {
                // Load all products
                products = await shopifyClient.product.fetchAll(SHOPIFY_CONFIG.productsPerPage);
            }
            
            // Cache products
            productCache[cacheKey] = products;
        }
        
        // Hide loading state
        loadingDiv.style.display = 'none';
        
        // Clear grid if not appending
        if (!append) {
            gridContainer.innerHTML = '';
        }
        
        // Display products
        products.forEach(product => {
            const productCard = createProductCard(product);
            gridContainer.appendChild(productCard);
        });
        
        // Show/hide load more button
        const loadMoreBtn = document.querySelector('.merch-actions');
        if (products.length === SHOPIFY_CONFIG.productsPerPage) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Failed to load products:', error);
        loadingDiv.innerHTML = '<p>' + ERROR_MESSAGES.loadError + '</p>';
    }
}

/**
 * Create product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'merch-item shopify-product';
    card.dataset.productId = product.id;
    
    // Get first variant for pricing
    const firstVariant = product.variants[0];
    const imageUrl = product.images[0]?.src || '/Assets/placeholder-product.jpg';
    
    // Check if product is on sale
    const onSale = firstVariant.compareAtPrice && 
                   parseFloat(firstVariant.compareAtPrice) > parseFloat(firstVariant.price);
    
    // Check if product is new (within last 30 days)
    const isNew = isProductNew(product.createdAt);
    
    card.innerHTML = `
        <div class="merch-image">
            <img src="${imageUrl}" alt="${product.title}" loading="lazy">
            ${!firstVariant.available ? '<div class="badge badge-soldout">SOLD OUT</div>' : ''}
            ${onSale ? '<div class="badge badge-sale">SALE</div>' : ''}
            ${isNew && firstVariant.available ? '<div class="badge badge-new">NEW</div>' : ''}
        </div>
        <div class="merch-info">
            <h4>${product.title}</h4>
            <div class="price-container">
                ${onSale ? `<span class="price-compare">$${firstVariant.compareAtPrice}</span>` : ''}
                <span class="price">$${firstVariant.price}</span>
            </div>
        </div>
        <div class="merch-overlay">
            ${firstVariant.available ? 
                `<button class="btn btn-primary add-to-cart" data-variant-id="${firstVariant.id}">
                    ${product.variants.length > 1 ? 'Select Options' : 'Add to Cart'}
                </button>` :
                '<button class="btn btn-outline" disabled>Out of Stock</button>'
            }
            <button class="btn btn-outline quick-view-btn">Quick View</button>
        </div>
    `;
    
    // Add event listeners
    const addToCartBtn = card.querySelector('.add-to-cart');
    const quickViewBtn = card.querySelector('.quick-view-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (product.variants.length > 1) {
                showProductModal(product);
            } else {
                addToCart(firstVariant.id);
            }
        });
    }
    
    if (quickViewBtn) {
        quickViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showProductModal(product);
        });
    }
    
    return card;
}

/**
 * Check if product is new
 */
function isProductNew(createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= PRODUCT_DISPLAY_CONFIG.badges.newProductDays;
}

/**
 * Show product modal for variant selection
 */
function showProductModal(product) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'shopify-product-modal';
    
    // Build variant options HTML
    let variantOptionsHTML = '';
    if (product.options && product.options.length > 0) {
        product.options.forEach(option => {
            variantOptionsHTML += `
                <div class="variant-option">
                    <label>${option.name}:</label>
                    <select class="variant-select" data-option="${option.name}">
                        ${option.values.map(value => 
                            `<option value="${value}">${value}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        });
    }
    
    // Get first available variant
    const firstVariant = product.variants.find(v => v.available) || product.variants[0];
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body">
                <div class="modal-images">
                    <img src="${product.images[0]?.src || '/Assets/placeholder-product.jpg'}" 
                         alt="${product.title}" class="main-image">
                    ${product.images.length > 1 ? `
                        <div class="image-thumbnails">
                            ${product.images.slice(0, 4).map((img, index) => 
                                `<img src="${img.src}" alt="${product.title} ${index + 1}" 
                                      class="thumbnail ${index === 0 ? 'active' : ''}">`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="modal-details">
                    <h2>${product.title}</h2>
                    <div class="modal-price">
                        <span class="variant-price">$${firstVariant.price}</span>
                        ${firstVariant.compareAtPrice ? 
                            `<span class="variant-compare-price">$${firstVariant.compareAtPrice}</span>` : ''}
                    </div>
                    ${product.descriptionHtml ? 
                        `<div class="product-description">${product.descriptionHtml}</div>` : ''}
                    <div class="variant-options">
                        ${variantOptionsHTML}
                    </div>
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button class="qty-decrease">-</button>
                            <input type="number" class="quantity-input" value="1" min="1" max="10">
                            <button class="qty-increase">+</button>
                        </div>
                    </div>
                    <button class="btn btn-primary modal-add-to-cart" data-variant-id="${firstVariant.id}">
                        ${firstVariant.available ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    setupModalEventListeners(modal, product);
    
    // Show modal with animation
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
}

/**
 * Setup modal event listeners
 */
function setupModalEventListeners(modal, product) {
    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Thumbnail clicks
    const thumbnails = modal.querySelectorAll('.thumbnail');
    const mainImage = modal.querySelector('.main-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
    
    // Quantity controls
    const qtyInput = modal.querySelector('.quantity-input');
    const qtyDecrease = modal.querySelector('.qty-decrease');
    const qtyIncrease = modal.querySelector('.qty-increase');
    
    qtyDecrease.addEventListener('click', () => {
        const currentQty = parseInt(qtyInput.value);
        if (currentQty > 1) {
            qtyInput.value = currentQty - 1;
        }
    });
    
    qtyIncrease.addEventListener('click', () => {
        const currentQty = parseInt(qtyInput.value);
        if (currentQty < 10) {
            qtyInput.value = currentQty + 1;
        }
    });
    
    // Variant selection
    const variantSelects = modal.querySelectorAll('.variant-select');
    const addToCartBtn = modal.querySelector('.modal-add-to-cart');
    const priceElement = modal.querySelector('.variant-price');
    const comparePriceElement = modal.querySelector('.variant-compare-price');
    
    variantSelects.forEach(select => {
        select.addEventListener('change', () => {
            // Get selected options
            const selectedOptions = {};
            variantSelects.forEach(s => {
                selectedOptions[s.dataset.option] = s.value;
            });
            
            // Find matching variant
            const matchingVariant = product.variants.find(variant => {
                return product.options.every(option => {
                    const variantOption = variant.selectedOptions.find(o => o.name === option.name);
                    return variantOption && variantOption.value === selectedOptions[option.name];
                });
            });
            
            if (matchingVariant) {
                // Update price
                priceElement.textContent = `$${matchingVariant.price}`;
                
                if (matchingVariant.compareAtPrice) {
                    if (!comparePriceElement) {
                        const newComparePrice = document.createElement('span');
                        newComparePrice.className = 'variant-compare-price';
                        newComparePrice.textContent = `$${matchingVariant.compareAtPrice}`;
                        priceElement.parentNode.appendChild(newComparePrice);
                    } else {
                        comparePriceElement.textContent = `$${matchingVariant.compareAtPrice}`;
                    }
                } else if (comparePriceElement) {
                    comparePriceElement.remove();
                }
                
                // Update button
                addToCartBtn.dataset.variantId = matchingVariant.id;
                addToCartBtn.textContent = matchingVariant.available ? 'Add to Cart' : 'Out of Stock';
                addToCartBtn.disabled = !matchingVariant.available;
            }
        });
    });
    
    // Add to cart
    addToCartBtn.addEventListener('click', async () => {
        const variantId = addToCartBtn.dataset.variantId;
        const quantity = parseInt(qtyInput.value);
        
        if (variantId) {
            await addToCart(variantId, quantity);
            closeModal(modal);
        }
    });
}

/**
 * Close modal
 */
function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

/**
 * Add product to cart
 */
async function addToCart(variantId, quantity = 1) {
    try {
        // Show loading state on button
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Adding...';
        button.disabled = true;
        
        // Add to cart
        const lineItemsToAdd = [{
            variantId: variantId,
            quantity: quantity
        }];
        
        shopifyCart = await shopifyClient.checkout.addLineItems(shopifyCart.id, lineItemsToAdd);
        
        // Update cart UI
        updateCartUI();
        
        // Show cart if configured
        if (SHOPIFY_CONFIG.cartBehavior.openOnAdd) {
            openCart();
        }
        
        // Show success message
        showNotification('Product added to cart!', 'success');
        
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
        
    } catch (error) {
        console.error('Failed to add to cart:', error);
        showNotification(ERROR_MESSAGES.addToCartError, 'error');
        
        // Reset button
        event.target.textContent = 'Add to Cart';
        event.target.disabled = false;
    }
}

/**
 * Update cart UI
 */
function updateCartUI() {
    if (!shopifyCart) return;
    
    // Update cart count
    const cartCount = shopifyCart.lineItems.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
    
    // Update cart items
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';
    
    if (shopifyCart.lineItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    } else {
        shopifyCart.lineItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.variant.image.src}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>${item.variant.title !== 'Default Title' ? item.variant.title : ''}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" data-action="decrease" data-item-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-item-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <span>$${(parseFloat(item.variant.price) * item.quantity).toFixed(2)}</span>
                    <button class="cart-item-remove" data-item-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add quantity event listeners
        setupCartItemListeners();
    }
    
    // Update total
    document.querySelector('.cart-total-price').textContent = `$${shopifyCart.totalPrice}`;
}

/**
 * Setup cart item event listeners
 */
function setupCartItemListeners() {
    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = e.target.dataset.itemId;
            const action = e.target.dataset.action;
            const item = shopifyCart.lineItems.find(i => i.id === itemId);
            
            if (item) {
                const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                
                if (newQuantity > 0) {
                    await updateCartItemQuantity(itemId, newQuantity);
                } else {
                    await removeCartItem(itemId);
                }
            }
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = e.target.closest('.cart-item-remove').dataset.itemId;
            await removeCartItem(itemId);
        });
    });
}

/**
 * Update cart item quantity
 */
async function updateCartItemQuantity(itemId, quantity) {
    try {
        shopifyCart = await shopifyClient.checkout.updateLineItems(shopifyCart.id, [
            { id: itemId, quantity: quantity }
        ]);
        updateCartUI();
    } catch (error) {
        console.error('Failed to update quantity:', error);
        showNotification('Failed to update quantity', 'error');
    }
}

/**
 * Remove cart item
 */
async function removeCartItem(itemId) {
    try {
        shopifyCart = await shopifyClient.checkout.removeLineItems(shopifyCart.id, [itemId]);
        updateCartUI();
        showNotification('Item removed from cart', 'info');
    } catch (error) {
        console.error('Failed to remove item:', error);
        showNotification('Failed to remove item', 'error');
    }
}

/**
 * Open cart overlay
 */
function openCart() {
    const cartOverlay = document.getElementById('shopify-cart');
    cartOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Close cart overlay
 */
function closeCart() {
    const cartOverlay = document.getElementById('shopify-cart');
    cartOverlay.style.display = 'none';
    document.body.style.overflow = '';
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Show fallback merchandise section
 */
function showFallbackMerch() {
    document.getElementById('shopify-product-grid').style.display = 'none';
    document.getElementById('merch-fallback').style.display = 'block';
    document.querySelector('.merch-actions').style.display = 'none';
}

// Cart toggle button listener
document.addEventListener('DOMContentLoaded', () => {
    const cartToggle = document.getElementById('cart-toggle');
    const cartOverlay = document.getElementById('shopify-cart');
    const cartClose = document.querySelector('.cart-close');
    const checkoutBtn = document.getElementById('checkout-button');
    const loadMoreBtn = document.getElementById('load-more-products');
    
    if (cartToggle) {
        cartToggle.addEventListener('click', openCart);
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                closeCart();
            }
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (shopifyCart && shopifyCart.webUrl) {
                window.location.href = shopifyCart.webUrl;
            }
        });
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            loadProducts(true);
        });
    }
    
    // ESC key to close cart
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
});