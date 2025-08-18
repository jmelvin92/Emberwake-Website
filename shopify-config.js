/**
 * Shopify Buy Button SDK Configuration
 * This file contains the configuration for the Shopify integration
 * Replace the placeholder values with your actual Shopify store details
 */

const SHOPIFY_CONFIG = {
    // Your Shopify store domain (e.g., 'emberwake.myshopify.com')
    domain: 'YOUR-STORE.myshopify.com',
    
    // Storefront Access Token (get this from Shopify Admin > Apps > Manage private apps)
    storefrontAccessToken: 'YOUR-STOREFRONT-ACCESS-TOKEN',
    
    // Collection ID for featured products (optional)
    featuredCollectionId: 'YOUR-COLLECTION-ID',
    
    // Number of products to display initially
    productsPerPage: 8,
    
    // Cart behavior
    cartBehavior: {
        openOnAdd: true,
        persistCart: true,
        cartCookieExpiration: 7 // days
    },
    
    // UI Configuration
    ui: {
        showVariantImages: true,
        showQuantitySelector: true,
        enableQuickView: true,
        loadingAnimation: true
    },
    
    // Performance settings
    performance: {
        lazyLoadProducts: true,
        cacheProducts: true,
        cacheExpiration: 3600000, // 1 hour in milliseconds
        preconnectToShopify: true
    },
    
    // Custom styling options
    styling: {
        primaryColor: '#ff6b35',
        buttonTextColor: '#ffffff',
        cartBackgroundColor: '#1a1a1a',
        cartTextColor: '#ffffff',
        borderColor: '#333333'
    }
};

// Product display configuration
const PRODUCT_DISPLAY_CONFIG = {
    // Product card options
    card: {
        showPrice: true,
        showComparePrice: true,
        showVendor: false,
        showProductType: false,
        imageAspectRatio: '1:1'
    },
    
    // Badge configurations
    badges: {
        showSoldOut: true,
        showSale: true,
        showNew: true,
        newProductDays: 30 // Products created within last 30 days
    },
    
    // Quick view modal options
    quickView: {
        showDescription: true,
        showImages: true,
        maxImages: 5,
        showReviews: false
    }
};

// Checkout configuration
const CHECKOUT_CONFIG = {
    // Checkout behavior
    behavior: {
        openInNewTab: false,
        requireShipping: true,
        allowGuestCheckout: true
    },
    
    // Custom checkout message
    message: {
        enabled: true,
        text: 'Thank you for supporting Emberwake! All merch ships worldwide.',
        position: 'top'
    },
    
    // Discount codes (if any)
    discounts: {
        autoApply: [],
        promotional: []
    }
};

// Error messages
const ERROR_MESSAGES = {
    loadError: 'Unable to load products. Please try again later.',
    addToCartError: 'Unable to add item to cart. Please try again.',
    networkError: 'Connection error. Please check your internet and try again.',
    outOfStock: 'This item is currently out of stock.',
    invalidVariant: 'Please select all options before adding to cart.'
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SHOPIFY_CONFIG,
        PRODUCT_DISPLAY_CONFIG,
        CHECKOUT_CONFIG,
        ERROR_MESSAGES
    };
}