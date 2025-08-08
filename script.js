// Emberwake Website JavaScript - Enhanced Edition

document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Debug: Check if banner section exists
    const bannerSection = document.querySelector('.hero-video-banner');
    console.log('Banner section found:', bannerSection);
    if (bannerSection) {
        console.log('Banner section dimensions:', {
            width: bannerSection.offsetWidth,
            height: bannerSection.offsetHeight,
            computed: window.getComputedStyle(bannerSection)
        });
    }
    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Enhanced navbar scroll effect with parallax
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScrollY;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.media-item, .tour-date, .merch-item, .about-text, .about-image');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Banner video handling - ensure it's muted and playing
    const bannerVideo = document.querySelector('.banner-video');
    if (bannerVideo) {
        console.log('Banner video element found:', bannerVideo);
        
        // Ensure video is muted for autoplay
        bannerVideo.muted = true;
        bannerVideo.volume = 0;
        
        // Check if video can load
        bannerVideo.addEventListener('loadstart', () => {
            console.log('Banner video started loading');
        });
        
        bannerVideo.addEventListener('canplay', () => {
            console.log('Banner video can start playing');
        });
        
        bannerVideo.addEventListener('error', (e) => {
            console.error('Banner video error:', e);
            console.error('Video error details:', {
                error: bannerVideo.error,
                networkState: bannerVideo.networkState,
                readyState: bannerVideo.readyState,
                currentSrc: bannerVideo.currentSrc
            });
        });
        
        bannerVideo.addEventListener('loadeddata', () => {
            console.log('Banner video data loaded');
        });
        
        bannerVideo.addEventListener('loadedmetadata', () => {
            console.log('Banner video metadata loaded');
        });
        
        // Check video source immediately
        console.log('Video src:', bannerVideo.src);
        console.log('Video currentSrc:', bannerVideo.currentSrc);
        console.log('Video sources:', Array.from(bannerVideo.querySelectorAll('source')).map(s => s.src));
        
        // Attempt to play the video
        const playVideo = () => {
            console.log('Attempting to play banner video');
            bannerVideo.play().then(() => {
                console.log('Banner video playing successfully');
            }).catch(e => {
                console.log('Banner video autoplay failed:', e);
            });
        };
        
        // Play immediately and on user interaction as fallback
        setTimeout(playVideo, 100);
        
        // Fallback for browsers that block autoplay
        ['click', 'touchstart', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, playVideo, { once: true });
        });
        
        // Ensure video keeps playing
        bannerVideo.addEventListener('pause', () => {
            console.log('Banner video paused, attempting to restart');
            bannerVideo.play();
        });
    } else {
        console.log('Banner video element not found');
    }
    
    // Background video handling - ensure it's muted and playing
    const heroVideo = document.querySelector('#hero-bg-video');
    if (heroVideo) {
        // Ensure video is muted for autoplay
        heroVideo.muted = true;
        heroVideo.volume = 0;
        
        // Attempt to play the video
        const playVideo = () => {
            heroVideo.play().catch(e => {
                console.log('Background video autoplay failed:', e);
            });
        };
        
        // Play immediately and on user interaction as fallback
        playVideo();
        
        // Fallback for browsers that block autoplay
        ['click', 'touchstart', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, playVideo, { once: true });
        });
        
        // Ensure video keeps playing
        heroVideo.addEventListener('pause', () => {
            heroVideo.play();
        });
    }

    // Glitch effect for hero title
    const glitchTitle = document.querySelector('.hero-title.glitch');
    if (glitchTitle) {
        setInterval(() => {
            glitchTitle.style.animation = 'none';
            setTimeout(() => {
                glitchTitle.style.animation = '';
            }, 50);
        }, 3000);
    }

    // Add mouse move effect to hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Merch item hover effects
    const merchItems = document.querySelectorAll('.merch-item');
    merchItems.forEach(item => {
        const overlay = item.querySelector('.merch-overlay');
        const button = overlay?.querySelector('.btn');

        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Placeholder for quick view functionality
                showQuickView(item);
            });
        }
    });

    // Quick view modal (placeholder)
    function showQuickView(merchItem) {
        const title = merchItem.querySelector('.merch-info h4').textContent;
        const price = merchItem.querySelector('.price').textContent;
        
        // Create simple modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>${title}</h3>
                <p class="modal-price">${price}</p>
                <p>This is a placeholder for the quick view. In the full implementation, this would show product details, size options, and add to cart functionality.</p>
                <button class="btn btn-primary">Add to Cart (Coming Soon)</button>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: var(--bg-dark);
            padding: 2rem;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
            border: 1px solid var(--border-color);
        `;

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 2rem;
            cursor: pointer;
            color: var(--text-light);
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }, { once: true });
    }

    // Enhanced parallax effects
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroVideo = document.querySelector('.hero-video');
        const heroLogo = document.querySelector('.hero-logo');
        const sections = document.querySelectorAll('section');
        
        if (heroVideo) {
            heroVideo.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 + scrolled * 0.0005})`;
            heroVideo.style.filter = `brightness(${1 - scrolled * 0.001})`;
        }
        
        // Banner video should stay fixed - no parallax effects
        // (Removed parallax transform to prevent video scaling/moving)
        
        // Add fade effect to sections
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const opacity = Math.min(1, Math.max(0, (window.innerHeight - Math.abs(rect.top)) / window.innerHeight));
            section.style.opacity = Math.max(0.3, opacity);
        });
    });

    // Enhanced loading animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.tour-date, .merch-item, .media-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0) scale(1)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-50px) scale(0.9)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    };
    animateOnScroll();

    // Mystical scrolling text animation based on scroll position
    const mysticalLines = document.querySelectorAll('.mystical-text-line');
    
    const animateMysticalText = () => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Define trigger points for each word based on sections
        const triggerPoints = [
            windowHeight * 0.5,      // MISERY - near "Enter the Void"
            windowHeight * 1.2,      // OH - near music/media section  
            windowHeight * 1.8,      // CAN'T - tour section
            windowHeight * 2.4,      // YOU - merch section
            windowHeight * 3.0       // SEE - near about section
        ];
        
        // Show words based on scroll position (going down)
        mysticalLines.forEach((line, index) => {
            if (scrolled >= triggerPoints[index]) {
                line.classList.remove('fading');
                line.classList.add('visible');
            } else {
                line.classList.add('fading');
                line.classList.remove('visible');
            }
        });
    };
    
    window.addEventListener('scroll', animateMysticalText);
    animateMysticalText(); // Initial call

    // Tour date ticket button functionality
    const ticketButtons = document.querySelectorAll('.tour-date .btn');
    ticketButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Placeholder for ticket purchasing
            alert('Ticket purchasing will be integrated with a ticketing platform like Eventbrite or Bandsintown.');
        });
    });

    // Streaming platform analytics (placeholder)
    const platformLinks = document.querySelectorAll('.platform-link');
    platformLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.querySelector('span').textContent;
            console.log(`User clicked on ${platform} streaming link`);
            // In production, this would send analytics data
        });
    });

    // Newsletter signup (placeholder functionality)
    function createNewsletterSignup() {
        const footer = document.querySelector('.footer-content');
        const newsletterDiv = document.createElement('div');
        newsletterDiv.className = 'newsletter-signup';
        newsletterDiv.innerHTML = `
            <h4>Stay Updated</h4>
            <form class="newsletter-form">
                <input type="email" placeholder="Enter your email" required>
                <button type="submit" class="btn btn-primary">Subscribe</button>
            </form>
        `;

        // Add styles
        newsletterDiv.style.cssText = `
            text-align: center;
            grid-column: 1 / -1;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
        `;

        const form = newsletterDiv.querySelector('.newsletter-form');
        form.style.cssText = `
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
            flex-wrap: wrap;
        `;

        const input = form.querySelector('input');
        input.style.cssText = `
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border-color);
            color: var(--text-light);
            border-radius: 4px;
            min-width: 250px;
        `;

        footer.appendChild(newsletterDiv);

        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = input.value;
            alert(`Thank you for subscribing! We'll send updates to ${email}`);
            input.value = '';
        });
    }

    // Initialize newsletter signup
    createNewsletterSignup();

    // Add custom cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorTrail);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorTrail.style.left = e.clientX + 'px';
            cursorTrail.style.top = e.clientY + 'px';
        }, 15);
    });
    
    // Add hover effects to interactive elements
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'var(--primary-color)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--primary-glow)';
        });
    });
    
    // Console ASCII art
    console.log(`
%c
███████╗███╗   ███╗██████╗ ███████╗██████╗ ██╗    ██╗ █████╗ ██╗  ██╗███████╗
██╔════╝████╗ ████║██╔══██╗██╔════╝██╔══██╗██║    ██║██╔══██╗██║ ██╔╝██╔════╝
█████╗  ██╔████╔██║██████╔╝█████╗  ██████╔╝██║ █╗ ██║███████║█████╔╝ █████╗  
██╔══╝  ██║╚██╔╝██║██╔══██╗██╔══╝  ██╔══██╗██║███╗██║██╔══██║██╔═██╗ ██╔══╝  
███████╗██║ ╚═╝ ██║██████╔╝███████╗██║  ██║╚███╔███╔╝██║  ██║██║  ██╗███████╗
╚══════╝╚═╝     ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

🔥 POST-HARDCORE // METALCORE 🔥
`, 'color: #ff3333; font-weight: bold');
});
