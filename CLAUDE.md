# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official website for Emberwake, a post-hardcore/metalcore band. It's a static website built with vanilla HTML, CSS, and JavaScript - no build tools or frameworks required.

## Development Commands

**Start local development server with clean URLs:**
```bash
python3 dev-server.py
```
Then open http://localhost:8000 in your browser.

**Alternative (basic server without clean URLs):**
```bash
python3 -m http.server 8000
```
Note: The basic server doesn't support clean URLs (/merch instead of /merch.html)

## Architecture & Structure

### Core Files
- **index.html**: Main HTML file containing all sections (hero, media, tour, merch, about)
- **styles.css**: All CSS styles including responsive design and animations
- **script.js**: Vanilla JavaScript for interactivity (navigation, smooth scrolling, animations, modal functionality)
- **Assets/**: Media files including logos, videos (.mp4, .webm), and images

### Key Website Sections
1. **Hero Section**: Video banner with band logo overlay
2. **Media Section**: YouTube embeds and Spotify player with streaming links
3. **Tour Dates**: Dynamic tour listings (currently placeholder data)
4. **Merchandise**: Product grid with modal quick-view functionality
5. **About Section**: Band biography

### Design System
- **Colors**: Primary orange (#ff6b35), dark backgrounds, gold accents (#d4af37)
- **Typography**: Bebas Neue, Oswald, Inter fonts from Google Fonts
- **Icons**: Font Awesome 6.4.0
- **Responsive breakpoints**: Desktop (1200px+), Tablet (768-1199px), Mobile (<768px)

## Future Integration Points

The website is prepared for these integrations (see placeholders in code):
- **Shopify**: Merchandise section ready for Buy Button SDK
- **Ticketing**: Tour dates section structured for Bandsintown/Songkick API
- **Streaming**: Update YouTube/Spotify embeds with actual band content
- **Social Media**: Links in footer need actual URLs

## Performance & SEO Requirements (CRITICAL)

**ALL future development MUST prioritize:**

### PageSpeed Optimization (Target: 90+ scores)
- **Performance**: 90+ score on pagespeed.web.dev
- **Best Practices**: 95+ score required
- **SEO**: Maintain 95+ score
- **Accessibility**: 90+ score target

### Performance Best Practices (MANDATORY):
- ✅ Critical CSS must be inlined for above-the-fold content
- ✅ Fonts loaded asynchronously with fallbacks
- ✅ Images must have proper dimensions and lazy loading
- ✅ JavaScript deferred or async when possible
- ✅ Resource preloading for critical assets only
- ✅ Minimize render-blocking resources
- ✅ Optimize video loading (metadata preload, lazy iframes)

### SEO Keyword Strategy (ENFORCE HEAVILY):
**Primary Keywords (HIGH PRIORITY):**
- "Emberwake" (brand dominance - #1 priority)
- "metalcore"
- "post-hardcore" 
- "heavy metal"
- "Nevada metal band"
- "Reno metalcore"

**Secondary Keywords:**
- "Anhedonia album"
- "emotional hardcore"
- "progressive metalcore"
- "alternative metal"
- "metal concerts"
- "band merchandise"

### SEO Implementation Rules:
- ✅ Natural keyword density: 1-3% for "Emberwake"
- ✅ Brand name in title, H1, meta description
- ✅ Location-based SEO (Reno, Nevada)
- ✅ Schema markup for MusicGroup, Events, FAQs
- ✅ Structured data validation required
- ✅ NO keyword stuffing (avoid spam penalties)
- ✅ Alt text optimization for all images
- ✅ Internal linking with keyword anchor text

### Testing Requirements:
- **BEFORE any commit**: Test on pagespeed.web.dev
- **Target scores**: Performance 90+, Best Practices 95+
- **Keyword validation**: Use SEO checker tool at /seo-checker.html
- **Mobile-first**: Optimize mobile performance priority

## Shopify Merchandise Management

### Adding New Products to Merch Page
1. **Get Product ID from Shopify:**
   - Go to Shopify Admin > Products
   - Click on the product
   - Copy the product ID from the URL (e.g., `7857539350627`)

2. **Add Product to Website:**
   - Edit `merch.html` around line 255-261
   - Find the `products` array
   - Add new product entry:
   ```javascript
   var products = [
       {
           id: '7857539350627',
           category: 'tshirts',
           name: 'Emberwake T-Shirt'
       },
       {
           id: 'NEW_PRODUCT_ID',
           category: 'hoodies', // or 'tshirts', 'accessories'  
           name: 'Product Name'
       }
   ];
   ```

3. **Available Categories:**
   - `tshirts` - Appears in T-Shirts filter
   - `hoodies` - Appears in Hoodies filter  
   - `accessories` - Appears in Accessories filter
   - All products appear in "Shop All" automatically

4. **Security Requirements:**
   - Never commit Shopify credentials to public repos
   - Product IDs are safe to include (read-only, public)
   - Always validate new products load correctly before deployment
   - Test category filtering after adding products

### Shopify Integration Details
- **Store**: `exs5ud-yc.myshopify.com`
- **Integration**: Embedded Buy Button SDK (not external redirect)
- **Styling**: Matches site theme (Emberwake colors, Oswald fonts)
- **Performance**: Products load asynchronously, no impact on PageSpeed scores

## Important Notes

- No build process or compilation needed - pure static files
- Video autoplay requires muted attribute for browser compatibility
- Mobile menu uses hamburger toggle with CSS transitions
- Intersection Observer API used for scroll animations
- All placeholder content (videos, tour dates, merch) should be replaced with actual band content
- **CRITICAL**: Every change must maintain or improve PageSpeed scores
# GLOBAL RULES

## Objectives
- Ship fast **without** tech debt: clean, concise, readable.
- Security is top priority; features never bypass it.
- If uncertain about a requirement or risk: ask for clarification before coding.

## Coding Standards
- Prefer small, composable functions; single responsibility.
- Keep public APIs minimal; avoid “misc utils” grab bags.
- No duplication—extract shared logic.
- Fail fast; explicit errors over silent catches.
- Comments: only for intent and non-obvious tradeoffs (1–3 lines). No narrating code.
- Errors must be logged in a secure, structured way; no silent failures.

## Security-First (hard stops)
- Never commit secrets; use env vars + secret manager.
- Input is untrusted by default: validate (Zod/DTOs) at boundaries.
- Principle of least privilege everywhere (DB, tokens, IAM).
- No PII in logs; redact by default.
- Use prepared statements/ORM; forbid raw SQL unless reviewed.
- Third-party calls: timeouts, retries, circuit-breaker; don’t echo provider errors to users.
- Never hardcode API URLs or tokens; load from env vars with secure defaults.
- If **risk ≥ medium** (data exposure, authz, payments): STOP, ask for approval.

## Dependency Management
- Avoid installing packages without verifying maintenance activity and security advisories.
- Update dependencies only after security and compatibility review.

## Branching Policy (MANDATORY)
- Repo must always have at least **2 branches**:
  - `main` → stable, production-ready, deployable at all times.
  - `development` → active feature work, UI changes, and code edits.
- **Never** commit directly to `main`.
- All coding happens in `development` or feature branches branched from `development`.
- Merge `development` → `main` only when stable, tested, and approved.
- After merge, re-create or reset `development` branch for the next cycle.
- Verify branch status often to prevent accidental commits to `main`.

## Mandatory Gates (automate in CI where possible)
- Static checks: typecheck + lint + format.
- Tests: add/adjust for changed logic; include one edge case.
- Dependency scan + minimal version bumps (no mass upgrades).
- If web app: basic threat pass (authn/authz, CSRF, CORS, headers).

## Architecture & Scalability
- Keep layers thin: controller → service → repo; no cross-leaks.
- Idempotent handlers for webhooks/queues.
- Batch or cache hot paths; no N+1 queries.
- Feature flags for risky changes; migrations are reversible.

## Operating Loop
1) **Preflight Check**
   - Confirm current branch is **development** (or a feature branch off it).
   - If on `main`, STOP — switch to `development` before proceeding.
2) **Plan** (files/functions/tests + risks).
3) **Implement** small diffs; reuse existing patterns.
4) **Verify**: typecheck, tests, run security gates.
5) **Commit** atomic changes with clear message.
6) **Document** env vars, migrations, notable risks.

## AuthN/Z Defaults
- Centralize auth checks; never in view/components.
- Deny-by-default routes/actions; explicit allow lists.
- Token scope minimal; short-lived; refresh safely.

## Logging & Observability
- Log structured events, not stack traces full of secrets.
- Include request IDs; sample at high volume.
- Alerts for auth failures, 4xx/5xx spikes, provider errors.

## Inheritance
Also apply project and folder/agent `CLAUDE.md` rules. On conflict: **agent > project > global**.