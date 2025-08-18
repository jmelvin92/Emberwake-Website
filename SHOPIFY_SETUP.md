# Shopify Buy Button Integration Setup

## Quick Start Guide

The Emberwake website is now configured to display products directly from your Shopify store using the embedded Buy Button SDK. This guide walks you through completing the setup.

## Prerequisites
1. A Shopify account (https://www.shopify.com)
2. Products added to your Shopify store
3. Access to Shopify admin panel

## Setup Steps

### 1. Create a Shopify Store
1. Sign up for Shopify at https://www.shopify.com
2. Choose a plan that fits your needs
3. Complete store setup wizard

### 2. Add Products
1. Navigate to **Products** in Shopify admin
2. Click **Add product**
3. For each product, add:
   - Product title
   - Description
   - Images (recommended: 1:1 aspect ratio, min 1000x1000px)
   - Price
   - Inventory tracking
   - Shipping information
   - SEO settings

### 3. Create a Storefront Access Token
1. In Shopify admin, go to **Settings** → **Apps and sales channels**
2. Click **Develop apps** (at the bottom)
3. Click **Create an app**
4. Name it "Website Buy Button"
5. Go to **Configuration** tab
6. Under **Storefront API**, check these permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_products`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
7. Click **Install app**
8. Go to **API credentials** tab
9. Under **Storefront API access token**, click **Reveal token once**
10. **IMPORTANT**: Copy this token immediately (you can't see it again!)

### 4. Get Your Store Domain
Your store domain is in the format: `your-store-name.myshopify.com`
You can find it in **Settings** → **Domains**

### 5. Update Website Configuration

Edit `index.html` (around line 653-655) and replace:
```javascript
var client = ShopifyBuy.buildClient({
    domain: 'your-store.myshopify.com', // Replace with your domain
    storefrontAccessToken: 'your-access-token' // Replace with your token
});
```

With your actual credentials:
```javascript
var client = ShopifyBuy.buildClient({
    domain: 'emberwake.myshopify.com', // Your actual domain
    storefrontAccessToken: 'abc123xyz...' // Your actual token
});
```

### 6. Add Products to Display

**Option A: Display Specific Products**
1. Go to Shopify Admin > Products
2. Click on a product
3. Look at the URL: `admin.shopify.com/store/your-store/products/1234567890`
4. Copy the number at the end (e.g., `1234567890`)
5. In `index.html`, uncomment the product code (around line 664) and add your product ID

**Option B: Display a Collection**
1. In Shopify admin, go to **Products** → **Collections**
2. Click **Create collection**
3. Name it "Featured" or similar
4. Add products to the collection
5. Copy the collection ID from the URL when viewing the collection

### 7. Configure Shipping
1. Go to **Settings** → **Shipping and delivery**
2. Set up shipping zones
3. Configure shipping rates
4. Add shipping policies

### 8. Configure Payment Methods
1. Go to **Settings** → **Payments**
2. Set up payment providers
3. Configure payment security settings
4. Test payment processing

### 9. Test the Integration

1. Save your changes to `index.html`
2. Start your local development server:
   ```bash
   python3 -m http.server 8080
   ```
3. Open http://localhost:8080 in your browser
4. Scroll to the Merch section
5. Verify:
   - Products load correctly
   - Add to cart functionality works
   - Cart updates properly
   - Checkout redirects to Shopify

## Customization Options

### Product Display
Edit `PRODUCT_DISPLAY_CONFIG` in `shopify-config.js`:
- Show/hide price comparisons
- Enable/disable badges (SALE, NEW, SOLD OUT)
- Configure quick view options

### Cart Behavior
Edit `cartBehavior` in `shopify-config.js`:
- `openOnAdd`: Open cart when item is added
- `persistCart`: Save cart between sessions
- `cartCookieExpiration`: Days to persist cart

### Styling
Edit the Shopify-related styles in `styles.css`:
- Cart overlay appearance
- Product card styling
- Modal designs
- Button colors and effects

## Performance Considerations

The integration is optimized for performance:
- SDK loads only when user scrolls to merchandise section
- Product data is cached in sessionStorage
- Images use lazy loading
- Minimal impact on PageSpeed scores

## Troubleshooting

### Products Not Loading
1. Check browser console for errors
2. Verify store domain is correct
3. Verify Storefront Access Token is valid
4. Check that products are active in Shopify

### Cart Not Persisting
1. Check browser localStorage is enabled
2. Verify cart cookie settings
3. Clear browser cache and try again

### Checkout Issues
1. Ensure payment methods are configured
2. Check shipping zones cover customer location
3. Verify checkout settings in Shopify admin

## Going Live Checklist

- [ ] Replace test products with real products
- [ ] Set up proper payment processing
- [ ] Configure tax settings
- [ ] Add shipping policies
- [ ] Test checkout process end-to-end
- [ ] Set up order notifications
- [ ] Configure inventory tracking
- [ ] Add return/refund policies
- [ ] Enable Shopify analytics
- [ ] Set up abandoned cart recovery

## Support

For Shopify-specific issues:
- Shopify Help Center: https://help.shopify.com
- Shopify Community: https://community.shopify.com

For integration issues:
- Check browser console for errors
- Review the `shopify-integration.js` file
- Ensure all configuration values are correct