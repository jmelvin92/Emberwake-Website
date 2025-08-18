/**
 * Demo Mode for Merchandise Page
 * Allows testing the shopping cart functionality without Shopify configuration
 */

let demoCart = [];
let demoMode = false;

// Demo products data
const DEMO_PRODUCTS = [
    {
        id: 'demo-1',
        title: 'Anhedonia Tour T-Shirt',
        price: 25.00,
        comparePrice: 35.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ff6b35?text=Tour+Shirt',
        category: 'apparel',
        description: 'Limited edition tour shirt featuring exclusive Anhedonia artwork.',
        variants: [
            { id: 'v1-s', title: 'Small', available: true },
            { id: 'v1-m', title: 'Medium', available: true },
            { id: 'v1-l', title: 'Large', available: true },
            { id: 'v1-xl', title: 'XL', available: true },
            { id: 'v1-xxl', title: 'XXL', available: false }
        ],
        badge: 'sale'
    },
    {
        id: 'demo-2',
        title: 'Emberwake Logo Hoodie',
        price: 45.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ff6b35?text=Logo+Hoodie',
        category: 'apparel',
        description: 'Premium quality hoodie with embroidered Emberwake logo.',
        variants: [
            { id: 'v2-s', title: 'Small', available: true },
            { id: 'v2-m', title: 'Medium', available: true },
            { id: 'v2-l', title: 'Large', available: true },
            { id: 'v2-xl', title: 'XL', available: true }
        ],
        badge: 'new'
    },
    {
        id: 'demo-3',
        title: 'Anhedonia Vinyl LP',
        price: 30.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ff6b35?text=Vinyl+LP',
        category: 'music',
        description: 'Limited edition colored vinyl pressing of Anhedonia.',
        variants: [
            { id: 'v3-black', title: 'Black Vinyl', available: true },
            { id: 'v3-red', title: 'Red Marble (Limited)', available: true },
            { id: 'v3-clear', title: 'Clear (Sold Out)', available: false }
        ]
    },
    {
        id: 'demo-4',
        title: 'Band Logo Snapback',
        price: 20.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ff6b35?text=Snapback',
        category: 'accessories',
        description: 'Adjustable snapback with embroidered logo.',
        variants: [
            { id: 'v4-one', title: 'One Size', available: true }
        ]
    },
    {
        id: 'demo-5',
        title: 'Anhedonia CD',
        price: 15.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ff6b35?text=CD',
        category: 'music',
        description: 'Physical CD with 12-page booklet and bonus tracks.',
        variants: [
            { id: 'v5-standard', title: 'Standard Edition', available: true },
            { id: 'v5-deluxe', title: 'Deluxe Edition', available: false }
        ],
        badge: 'soldout'
    },
    {
        id: 'demo-6',
        title: 'Metal Band Tank Top',
        price: 22.00,
        comparePrice: 28.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ff6b35?text=Tank+Top',
        category: 'apparel',
        description: 'Summer essential tank top with bold graphics.',
        variants: [
            { id: 'v6-s', title: 'Small', available: true },
            { id: 'v6-m', title: 'Medium', available: true },
            { id: 'v6-l', title: 'Large', available: true },
            { id: 'v6-xl', title: 'XL', available: true }
        ],
        badge: 'sale'
    },
    {
        id: 'demo-7',
        title: 'Guitar Pick Set',
        price: 10.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ff6b35?text=Pick+Set',
        category: 'accessories',
        description: 'Set of 6 custom Emberwake guitar picks.',
        variants: [
            { id: 'v7-standard', title: 'Standard Set', available: true }
        ]
    },
    {
        id: 'demo-8',
        title: 'Tour Poster',
        price: 18.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ff6b35?text=Tour+Poster',
        category: 'accessories',
        description: '18"x24" high-quality tour poster.',
        variants: [
            { id: 'v8-unsigned', title: 'Unsigned', available: true },
            { id: 'v8-signed', title: 'Signed by Band', available: false }
        ],
        badge: 'new'
    }
];

// Enable demo mode
function enableDemoMode() {
    demoMode = true;
    localStorage.setItem('merchDemoMode', 'true');
    
    // Show demo banner
    document.getElementById('demo-banner').style.display = 'block';
    
    // Hide fallback
    document.getElementById('merch-fallback').style.display = 'none';
    
    // Show cart button
    document.getElementById('cart-toggle').style.display = 'flex';
    
    // Load demo products
    loadDemoProducts();
    
    // Initialize demo cart
    initializeDemoCart();
}

// Load demo products
function loadDemoProducts(filter = 'all') {
    const gridContainer = document.getElementById('shopify-product-grid');
    gridContainer.innerHTML = '';
    
    // Filter products
    let products = DEMO_PRODUCTS;
    if (filter !== 'all') {
        products = DEMO_PRODUCTS.filter(p => p.category === filter);
    }
    
    // Search filter
    const searchInput = document.getElementById('product-search');
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        products = products.filter(p => 
            p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Display products
    products.forEach(product => {
        const card = createDemoProductCard(product);
        gridContainer.appendChild(card);
    });
    
    // Show/hide load more button
    document.querySelector('.merch-actions').style.display = 'none';
}

// Create demo product card
function createDemoProductCard(product) {
    const card = document.createElement('div');
    card.className = 'merch-item shopify-product';
    
    const firstVariant = product.variants[0];
    const onSale = product.comparePrice && product.comparePrice > product.price;
    
    card.innerHTML = `
        <div class="merch-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            ${product.badge === 'soldout' || !firstVariant.available ? '<div class="badge badge-soldout">SOLD OUT</div>' : ''}
            ${product.badge === 'sale' || onSale ? '<div class="badge badge-sale">SALE</div>' : ''}
            ${product.badge === 'new' ? '<div class="badge badge-new">NEW</div>' : ''}
        </div>
        <div class="merch-info">
            <h4>${product.title}</h4>
            <div class="price-container">
                ${product.comparePrice ? `<span class="price-compare">$${product.comparePrice.toFixed(2)}</span>` : ''}
                <span class="price">$${product.price.toFixed(2)}</span>
            </div>
        </div>
        <div class="merch-overlay">
            ${firstVariant.available ? 
                `<button class="btn btn-primary demo-add-to-cart" data-product-id="${product.id}">
                    ${product.variants.length > 1 ? 'Select Options' : 'Add to Cart'}
                </button>` :
                '<button class="btn btn-outline" disabled>Out of Stock</button>'
            }
            <button class="btn btn-outline demo-quick-view" data-product-id="${product.id}">Quick View</button>
        </div>
    `;
    
    // Add event listeners
    const addBtn = card.querySelector('.demo-add-to-cart');
    const quickViewBtn = card.querySelector('.demo-quick-view');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (product.variants.length > 1) {
                showDemoProductModal(product);
            } else {
                addToDemoCart(product, product.variants[0]);
            }
        });
    }
    
    if (quickViewBtn) {
        quickViewBtn.addEventListener('click', () => showDemoProductModal(product));
    }
    
    return card;
}

// Show demo product modal
function showDemoProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'shopify-product-modal';
    
    let variantOptionsHTML = '';
    if (product.variants.length > 1) {
        variantOptionsHTML = `
            <div class="variant-option">
                <label>Options:</label>
                <select class="variant-select" id="demo-variant-select">
                    ${product.variants.map(v => 
                        `<option value="${v.id}" ${!v.available ? 'disabled' : ''}>
                            ${v.title} ${!v.available ? '(Sold Out)' : ''}
                        </option>`
                    ).join('')}
                </select>
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body">
                <div class="modal-images">
                    <img src="${product.image}" alt="${product.title}" class="main-image">
                </div>
                <div class="modal-details">
                    <h2>${product.title}</h2>
                    <div class="modal-price">
                        <span class="variant-price">$${product.price.toFixed(2)}</span>
                        ${product.comparePrice ? 
                            `<span class="variant-compare-price">$${product.comparePrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-description">
                        <p>${product.description}</p>
                    </div>
                    ${variantOptionsHTML}
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button class="qty-decrease">-</button>
                            <input type="number" class="quantity-input" value="1" min="1" max="10">
                            <button class="qty-increase">+</button>
                        </div>
                    </div>
                    <button class="btn btn-primary modal-add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup event listeners
    setupDemoModalListeners(modal, product);
    
    // Show modal
    requestAnimationFrame(() => modal.classList.add('active'));
}

// Setup demo modal listeners
function setupDemoModalListeners(modal, product) {
    // Close button
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    // Quantity controls
    const qtyInput = modal.querySelector('.quantity-input');
    const qtyDecrease = modal.querySelector('.qty-decrease');
    const qtyIncrease = modal.querySelector('.qty-increase');
    
    qtyDecrease.addEventListener('click', () => {
        if (qtyInput.value > 1) qtyInput.value--;
    });
    
    qtyIncrease.addEventListener('click', () => {
        if (qtyInput.value < 10) qtyInput.value++;
    });
    
    // Add to cart
    modal.querySelector('.modal-add-to-cart').addEventListener('click', () => {
        const variantSelect = modal.querySelector('#demo-variant-select');
        const variantId = variantSelect ? variantSelect.value : product.variants[0].id;
        const variant = product.variants.find(v => v.id === variantId);
        const quantity = parseInt(qtyInput.value);
        
        if (variant && variant.available) {
            addToDemoCart(product, variant, quantity);
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Initialize demo cart
function initializeDemoCart() {
    const savedCart = localStorage.getItem('demoCart');
    if (savedCart) {
        demoCart = JSON.parse(savedCart);
    }
    updateDemoCartUI();
}

// Add to demo cart
function addToDemoCart(product, variant, quantity = 1) {
    // Check if item already in cart
    const existingItem = demoCart.find(item => 
        item.productId === product.id && item.variantId === variant.id
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        demoCart.push({
            productId: product.id,
            variantId: variant.id,
            title: product.title,
            variant: variant.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('demoCart', JSON.stringify(demoCart));
    
    // Update UI
    updateDemoCartUI();
    
    // Open cart
    openCart();
    
    // Show notification
    showNotification('Product added to cart!', 'success');
}

// Update demo cart UI
function updateDemoCartUI() {
    // Update cart count
    const totalItems = demoCart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
    
    // Update cart items
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';
    
    if (demoCart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    } else {
        demoCart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>${item.variant !== 'Default Title' ? item.variant : ''}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn demo-qty-decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn demo-qty-increase" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="cart-item-remove demo-remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners
        setupDemoCartListeners();
    }
    
    // Update total
    const total = demoCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.querySelector('.cart-total-price').textContent = `$${total.toFixed(2)}`;
}

// Setup demo cart listeners
function setupDemoCartListeners() {
    // Quantity decrease
    document.querySelectorAll('.demo-qty-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (demoCart[index].quantity > 1) {
                demoCart[index].quantity--;
            } else {
                demoCart.splice(index, 1);
            }
            localStorage.setItem('demoCart', JSON.stringify(demoCart));
            updateDemoCartUI();
        });
    });
    
    // Quantity increase
    document.querySelectorAll('.demo-qty-increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (demoCart[index].quantity < 10) {
                demoCart[index].quantity++;
                localStorage.setItem('demoCart', JSON.stringify(demoCart));
                updateDemoCartUI();
            }
        });
    });
    
    // Remove item
    document.querySelectorAll('.demo-remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.demo-remove-item').dataset.index);
            demoCart.splice(index, 1);
            localStorage.setItem('demoCart', JSON.stringify(demoCart));
            updateDemoCartUI();
            showNotification('Item removed from cart', 'info');
        });
    });
}

// Check if demo mode on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if Shopify is configured
    const isShopifyConfigured = typeof SHOPIFY_CONFIG !== 'undefined' && 
                                SHOPIFY_CONFIG.domain !== 'YOUR-STORE.myshopify.com';
    
    if (!isShopifyConfigured) {
        // Check if demo mode was previously enabled
        if (localStorage.getItem('merchDemoMode') === 'true') {
            enableDemoMode();
        } else {
            // Show fallback with demo button
            document.getElementById('merch-fallback').style.display = 'block';
            document.querySelector('.merch-loading').style.display = 'none';
        }
    }
    
    // Enable demo button
    const demoBtn = document.getElementById('enable-demo');
    if (demoBtn) {
        demoBtn.addEventListener('click', enableDemoMode);
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter products
            if (demoMode) {
                loadDemoProducts(e.target.dataset.filter);
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (demoMode) {
                const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                loadDemoProducts(activeFilter);
            }
        });
    }
    
    // Cart toggle
    const cartToggle = document.getElementById('cart-toggle');
    const cartOverlay = document.getElementById('shopify-cart');
    const cartClose = document.querySelector('.cart-close');
    
    if (cartToggle) {
        cartToggle.addEventListener('click', openCart);
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) closeCart();
        });
    }
    
    // Checkout button (demo mode)
    document.getElementById('checkout-button').addEventListener('click', () => {
        if (demoMode) {
            showNotification('Demo Mode: Checkout would redirect to Shopify', 'info');
        }
    });
});

// Helper functions
function openCart() {
    const cartOverlay = document.getElementById('shopify-cart');
    cartOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartOverlay = document.getElementById('shopify-cart');
    cartOverlay.style.display = 'none';
    document.body.style.overflow = '';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}