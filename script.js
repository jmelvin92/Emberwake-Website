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
    const isMobile = window.innerWidth <= 768;
    
    if (bannerVideo && !isMobile) {
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

    // Disabled heavy parallax for performance
    // Uncomment below to re-enable parallax effects
    /*
    let scrollTimeout;
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                const scrolled = window.pageYOffset;
                
                if (Math.abs(scrolled - lastScrollPosition) > 5) {
                    const heroVideo = document.querySelector('.hero-video');
                    
                    if (heroVideo) {
                        heroVideo.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 + scrolled * 0.0005})`;
                        heroVideo.style.filter = `brightness(${1 - scrolled * 0.001})`;
                    }
                    
                    lastScrollPosition = scrolled;
                }
                
                scrollTimeout = null;
            }, 16);
        }
    });
    */

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

    // Mystical scrolling text animation with throttling
    const mysticalLines = document.querySelectorAll('.mystical-text-line');
    let mysticalScrollFrame = null;
    
    const animateMysticalText = () => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
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
                if (!line.classList.contains('visible')) {
                    line.classList.remove('fading');
                    line.classList.add('visible');
                }
            } else {
                if (!line.classList.contains('fading')) {
                    line.classList.add('fading');
                    line.classList.remove('visible');
                }
            }
        });
        
        mysticalScrollFrame = null;
    };
    
    window.addEventListener('scroll', () => {
        if (!mysticalScrollFrame && !window.pauseMysticalAnimation) {
            mysticalScrollFrame = requestAnimationFrame(animateMysticalText);
        }
    });
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

    // Simplified custom cursor for better performance
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Remove cursor trail for performance
    // const cursorTrail = document.createElement('div');
    // cursorTrail.className = 'cursor-trail';
    // document.body.appendChild(cursorTrail);
    
    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    // Smooth cursor animation with lower frequency updates
    function animateCursor() {
        currentX += (cursorX - currentX) * 0.1;
        currentY += (cursorY - currentY) * 0.1;
        
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
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

    // Hyper Dopamine PONG Easter Egg
    class HyperPong {
        constructor() {
            this.canvas = document.getElementById('pong-canvas');
            if (!this.canvas) {
                console.error('Canvas element not found!');
                return;
            }
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                console.error('Could not get canvas context!');
                return;
            }
            this.gameContainer = document.getElementById('pong-game-container');
            this.playerScoreEl = document.querySelector('.player-score');
            this.aiScoreEl = document.querySelector('.ai-score');
            this.comboCountEl = document.querySelector('.combo-count');
            this.comboDisplayEl = document.querySelector('.combo-display');
            this.speedFillEl = document.querySelector('.speed-fill');
            
            // Game state
            this.isRunning = false;
            this.isPaused = false;
            this.playerScore = 0;
            this.aiScore = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.speedMultiplier = 1;
            
            // Performance settings
            this.performanceMode = 'auto'; // 'quality', 'performance', 'auto'
            this.maxParticles = 15; // Reduced from 100
            this.maxTrailLength = 10; // Reduced from 20
            
            // Store references to background elements
            this.backgroundVideos = [];
            this.backgroundAnimations = [];
            
            // Game objects
            this.ball = {
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                radius: 8,
                speed: 5,
                trail: [],
                lastX: 0,
                lastY: 0
            };
            
            this.playerPaddle = {
                x: 30,
                y: 0,
                width: 15,
                height: 100,
                speed: 8,
                glowIntensity: 0
            };
            
            this.aiPaddle = {
                x: 0,
                y: 0,
                width: 15,
                height: 100,
                speed: 6,
                difficulty: 0.7
            };
            
            // Visual effects
            this.particles = [];
            this.screenShake = 0;
            this.glitchIntensity = 0;
            
            // Input handling
            this.keys = {};
            
            // Debug
            this.frameCount = 0;
            
            this.initEventListeners();
        }
        
        initEventListeners() {
            // Logo click to start game - try both the container and the image
            const navLogo = document.querySelector('.nav-logo');
            const navLogoImg = document.querySelector('.nav-logo img');
            
            const startPongGame = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Logo clicked - starting Pong game!');
                this.startGame();
            };
            
            if (navLogo) {
                navLogo.addEventListener('click', startPongGame);
                navLogo.style.cursor = 'pointer';
            }
            
            if (navLogoImg) {
                navLogoImg.addEventListener('click', startPongGame);
                navLogoImg.style.cursor = 'pointer';
            }
            
            // Close button
            const closeBtn = document.querySelector('.pong-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.endGame();
                });
            }
            
            // Overlay click to close
            const overlay = document.querySelector('.pong-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    this.endGame();
                });
            }
            
            // Keyboard controls
            window.addEventListener('keydown', (e) => {
                const key = e.key.toLowerCase();
                this.keys[key] = true;
                
                // Also handle arrow keys
                if (e.key === 'ArrowUp') this.keys['arrowup'] = true;
                if (e.key === 'ArrowDown') this.keys['arrowdown'] = true;
                
                console.log('Key pressed:', e.key, 'Keys state:', this.keys);
                
                if (e.key === 'Escape') {
                    this.endGame();
                }
                if (e.key === ' ' && this.isRunning) {
                    e.preventDefault();
                    this.togglePause();
                }
            });
            
            window.addEventListener('keyup', (e) => {
                const key = e.key.toLowerCase();
                this.keys[key] = false;
                
                if (e.key === 'ArrowUp') this.keys['arrowup'] = false;
                if (e.key === 'ArrowDown') this.keys['arrowdown'] = false;
            });
        }
        
        startGame() {
            console.log('🎮 PONG GAME STARTING - Version 2.0 Optimized');
            console.log('Container:', this.gameContainer);
            
            this.gameContainer.classList.add('active');
            this.isRunning = true;
            this.isPaused = false;
            
            // Pause background elements for performance
            console.log('About to pause background elements...');
            this.pauseBackgroundElements();
            
            // Auto-detect performance mode
            this.detectPerformanceMode();
            
            // Ensure canvas is properly sized before starting
            setTimeout(() => {
                this.resizeCanvas();
                this.resetGame();
                
                // Optimize canvas for pixel art
                this.ctx.imageSmoothingEnabled = false;
                
                window.addEventListener('resize', () => this.resizeCanvas());
                console.log('Performance mode:', this.performanceMode);
                console.log('Canvas size:', this.canvas.width, 'x', this.canvas.height);
                this.gameLoop();
            }, 100);
        }
        
        pauseBackgroundElements() {
            console.log('Pausing background elements...');
            
            // Force pause ALL videos with error handling
            const videos = document.querySelectorAll('video');
            console.log('Found', videos.length, 'videos to pause');
            
            videos.forEach((video, index) => {
                try {
                    console.log(`Video ${index}:`, video.src || video.currentSrc, 'Paused:', video.paused);
                    
                    // Store original state
                    if (!video.paused) {
                        this.backgroundVideos.push({
                            element: video,
                            wasPlaying: true,
                            volume: video.volume
                        });
                    }
                    
                    // Force pause and mute
                    video.pause();
                    video.muted = true;
                    video.volume = 0;
                    
                    // Remove autoplay to prevent restart
                    video.removeAttribute('autoplay');
                    
                    console.log(`Successfully paused video ${index}`);
                } catch (e) {
                    console.error(`Failed to pause video ${index}:`, e);
                }
            });
            
            // Store and disable cursor animation
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                this.originalCursorDisplay = cursor.style.display;
                cursor.style.display = 'none';
                console.log('Disabled cursor animation');
            }
            
            // Disable mystical text animation temporarily
            window.pauseMysticalAnimation = true;
            
            // Stop glitch effect interval
            const glitchTitle = document.querySelector('.hero-title.glitch');
            if (glitchTitle) {
                glitchTitle.style.animation = 'none';
            }
            
            // Also stop any playing audio/video through other means
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    // Try to pause YouTube videos
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                } catch (e) {
                    console.log('Could not pause iframe content');
                }
            });
            
            console.log('Background pause complete - Paused', this.backgroundVideos.length, 'media elements');
        }
        
        resumeBackgroundElements() {
            console.log('Resuming background elements...');
            
            // Resume videos
            this.backgroundVideos.forEach(videoInfo => {
                try {
                    const video = videoInfo.element;
                    
                    // Restore original attributes
                    video.setAttribute('autoplay', '');
                    video.muted = true; // Keep muted for autoplay
                    video.volume = videoInfo.volume || 0;
                    
                    // Try to play
                    if (videoInfo.wasPlaying) {
                        video.play().catch(e => console.log('Could not resume video:', e));
                    }
                } catch (e) {
                    console.error('Failed to resume video:', e);
                }
            });
            this.backgroundVideos = [];
            
            // Re-enable cursor
            const cursor = document.querySelector('.custom-cursor');
            if (cursor && this.originalCursorDisplay !== undefined) {
                cursor.style.display = this.originalCursorDisplay || 'block';
            }
            
            // Re-enable mystical animation
            window.pauseMysticalAnimation = false;
            
            // Restore glitch effect
            const glitchTitle = document.querySelector('.hero-title.glitch');
            if (glitchTitle) {
                glitchTitle.style.animation = '';
            }
            
            console.log('Background elements resumed');
        }
        
        detectPerformanceMode() {
            // Simple performance test
            const testStart = performance.now();
            
            // Do a quick render test
            this.ctx.fillStyle = '#000';
            for (let i = 0; i < 100; i++) {
                this.ctx.fillRect(Math.random() * 100, Math.random() * 100, 10, 10);
            }
            
            const testTime = performance.now() - testStart;
            
            if (testTime > 10) {
                this.performanceMode = 'performance';
                this.maxParticles = 10;
                this.maxTrailLength = 5;
                console.log('Performance mode: LOW - optimizing for speed');
            } else {
                this.performanceMode = 'quality';
                this.maxParticles = 20;
                this.maxTrailLength = 10;
                console.log('Performance mode: HIGH - full effects');
            }
        }
        
        endGame() {
            this.gameContainer.classList.remove('active');
            this.isRunning = false;
            this.keys = {};
            
            // Resume background elements
            this.resumeBackgroundElements();
        }
        
        togglePause() {
            this.isPaused = !this.isPaused;
        }
        
        resetGame() {
            // Reset scores
            this.playerScore = 0;
            this.aiScore = 0;
            this.combo = 0;
            this.speedMultiplier = 1;
            this.updateUI();
            
            // Reset ball
            this.resetBall();
            
            // Reset paddles
            this.playerPaddle.y = this.canvas.height / 2 - this.playerPaddle.height / 2;
            this.aiPaddle.y = this.canvas.height / 2 - this.aiPaddle.height / 2;
            
            // Clear effects
            this.particles = [];
            this.screenShake = 0;
        }
        
        resetBall() {
            this.ball.x = this.canvas.width / 2;
            this.ball.y = this.canvas.height / 2;
            // Ensure ball has proper velocity
            const direction = Math.random() > 0.5 ? 1 : -1;
            this.ball.vx = direction * this.ball.speed;
            this.ball.vy = (Math.random() - 0.5) * this.ball.speed * 0.5; // Less vertical speed
            this.ball.trail = [];
            console.log('Ball reset - Position:', this.ball.x, this.ball.y, 'Velocity:', this.ball.vx, this.ball.vy);
        }
        
        resizeCanvas() {
            // Set explicit canvas dimensions
            this.canvas.width = 860;  // Fixed width
            this.canvas.height = 400; // Fixed height
            
            // Reset context settings after resize
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.globalAlpha = 1;
            
            console.log('Canvas size set to:', this.canvas.width, 'x', this.canvas.height);
            
            // Position AI paddle
            this.aiPaddle.x = this.canvas.width - 45;
        }
        
        update() {
            if (this.isPaused) return;
            
            // Update player paddle
            if (this.keys['w'] || this.keys['arrowup']) {
                this.playerPaddle.y = Math.max(0, this.playerPaddle.y - this.playerPaddle.speed);
                this.playerPaddle.glowIntensity = Math.min(1, this.playerPaddle.glowIntensity + 0.1);
            } else if (this.keys['s'] || this.keys['arrowdown']) {
                this.playerPaddle.y = Math.min(this.canvas.height - this.playerPaddle.height, 
                                               this.playerPaddle.y + this.playerPaddle.speed);
                this.playerPaddle.glowIntensity = Math.min(1, this.playerPaddle.glowIntensity + 0.1);
            } else {
                this.playerPaddle.glowIntensity = Math.max(0, this.playerPaddle.glowIntensity - 0.05);
            }
            
            // Update AI paddle
            this.updateAI();
            
            // Update ball
            this.updateBall();
            
            // Update particles
            this.updateParticles();
            
            // Update effects
            this.screenShake = Math.max(0, this.screenShake - 0.5);
            this.glitchIntensity = Math.max(0, this.glitchIntensity - 0.02);
        }
        
        updateAI() {
            const targetY = this.ball.y - this.aiPaddle.height / 2;
            const diff = targetY - this.aiPaddle.y;
            
            // Add some imperfection based on difficulty
            const imperfection = (1 - this.aiPaddle.difficulty) * 50;
            const adjustedTarget = targetY + (Math.random() - 0.5) * imperfection;
            
            if (Math.abs(diff) > 5) {
                const moveSpeed = this.aiPaddle.speed * this.aiPaddle.difficulty;
                if (diff > 0) {
                    this.aiPaddle.y = Math.min(this.canvas.height - this.aiPaddle.height,
                                               this.aiPaddle.y + moveSpeed);
                } else {
                    this.aiPaddle.y = Math.max(0, this.aiPaddle.y - moveSpeed);
                }
            }
        }
        
        updateBall() {
            // Only add trail point if ball moved significantly (performance optimization)
            const distance = Math.sqrt(
                Math.pow(this.ball.x - this.ball.lastX, 2) + 
                Math.pow(this.ball.y - this.ball.lastY, 2)
            );
            
            if (distance > 2) {
                this.ball.trail.push({
                    x: this.ball.x,
                    y: this.ball.y,
                    opacity: 1
                });
                
                this.ball.lastX = this.ball.x;
                this.ball.lastY = this.ball.y;
            }
            
            // Limit trail length based on performance mode
            if (this.ball.trail.length > this.maxTrailLength) {
                this.ball.trail.shift();
            }
            
            // Faster fade for performance
            this.ball.trail.forEach(point => {
                point.opacity -= this.performanceMode === 'performance' ? 0.1 : 0.05;
            });
            
            // Move ball
            this.ball.x += this.ball.vx * this.speedMultiplier;
            this.ball.y += this.ball.vy * this.speedMultiplier;
            
            // Top/bottom collision
            if (this.ball.y - this.ball.radius <= 0 || 
                this.ball.y + this.ball.radius >= this.canvas.height) {
                this.ball.vy = -this.ball.vy;
                this.createImpactEffect(this.ball.x, this.ball.y, 0.5);
            }
            
            // Paddle collisions
            this.checkPaddleCollision();
            
            // Score detection
            if (this.ball.x < 0) {
                this.aiScore++;
                this.combo = 0;
                this.screenShake = 15;
                this.createExplosion(this.ball.x, this.ball.y, '#ff0000');
                this.resetBall();
                this.updateUI();
            } else if (this.ball.x > this.canvas.width) {
                this.playerScore++;
                this.combo = 0;
                this.screenShake = 15;
                this.createExplosion(this.ball.x, this.ball.y, '#00ff00');
                this.resetBall();
                this.updateUI();
            }
        }
        
        checkPaddleCollision() {
            // Player paddle collision
            if (this.ball.x - this.ball.radius <= this.playerPaddle.x + this.playerPaddle.width &&
                this.ball.x + this.ball.radius >= this.playerPaddle.x &&
                this.ball.y >= this.playerPaddle.y &&
                this.ball.y <= this.playerPaddle.y + this.playerPaddle.height) {
                
                if (this.ball.vx < 0) {
                    this.ball.vx = -this.ball.vx * 1.05; // Speed increase
                    this.combo++;
                    this.onPaddleHit(this.playerPaddle);
                }
            }
            
            // AI paddle collision
            if (this.ball.x + this.ball.radius >= this.aiPaddle.x &&
                this.ball.x - this.ball.radius <= this.aiPaddle.x + this.aiPaddle.width &&
                this.ball.y >= this.aiPaddle.y &&
                this.ball.y <= this.aiPaddle.y + this.aiPaddle.height) {
                
                if (this.ball.vx > 0) {
                    this.ball.vx = -this.ball.vx * 1.05;
                    this.onPaddleHit(this.aiPaddle);
                }
            }
        }
        
        onPaddleHit(paddle) {
            // Calculate hit position for angle
            const relativeIntersectY = (paddle.y + paddle.height / 2) - this.ball.y;
            const normalizedRelativeIntersectionY = relativeIntersectY / (paddle.height / 2);
            const bounceAngle = normalizedRelativeIntersectionY * Math.PI / 4;
            
            this.ball.vy = this.ball.speed * -Math.sin(bounceAngle);
            
            // Effects
            this.screenShake = 8 + this.combo * 2;
            this.glitchIntensity = 0.3 + this.combo * 0.1;
            this.createImpactEffect(this.ball.x, this.ball.y, 1 + this.combo * 0.2);
            
            // Update speed
            this.speedMultiplier = Math.min(3, 1 + this.combo * 0.1);
            
            // Update difficulty
            this.aiPaddle.difficulty = Math.min(0.95, 0.7 + this.combo * 0.02);
            
            this.updateUI();
        }
        
        createImpactEffect(x, y, intensity) {
            if (this.performanceMode === 'performance' && this.particles.length > 5) return;
            
            const particleCount = Math.floor(
                this.performanceMode === 'performance' ? 3 * intensity : 6 * intensity
            );
            
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 / particleCount) * i;
                const speed = 2 + Math.random() * 3 * intensity;
                
                this.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    color: `hsl(${Math.random() * 60}, 100%, 50%)`
                });
            }
        }
        
        createExplosion(x, y, color) {
            const particleCount = this.performanceMode === 'performance' ? 8 : 15;
            
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 5;
                
                this.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    color: color
                });
            }
        }
        
        updateParticles() {
            // Strict particle limit based on performance mode
            if (this.particles.length > this.maxParticles) {
                this.particles = this.particles.slice(-this.maxParticles);
            }
            
            this.particles = this.particles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.96; // Faster decay
                particle.vy *= 0.96;
                particle.life -= this.performanceMode === 'performance' ? 0.06 : 0.04;
                
                // Remove particles that go off-screen immediately
                if (particle.x < -10 || particle.x > this.canvas.width + 10 ||
                    particle.y < -10 || particle.y > this.canvas.height + 10) {
                    return false;
                }
                
                return particle.life > 0;
            });
        }
        
        updateUI() {
            this.playerScoreEl.textContent = this.playerScore;
            this.aiScoreEl.textContent = this.aiScore;
            this.comboCountEl.textContent = this.combo;
            
            if (this.combo > 0) {
                this.comboDisplayEl.classList.add('active');
            } else {
                this.comboDisplayEl.classList.remove('active');
            }
            
            // Update speed bar
            const speedPercent = Math.min(100, (this.speedMultiplier - 1) * 50);
            this.speedFillEl.style.width = `${20 + speedPercent * 0.8}%`;
        }
        
        render() {
            if (!this.ctx) {
                console.error('No canvas context in render!');
                return;
            }
            
            // Clear canvas with dark background
            this.ctx.fillStyle = '#0a0a0a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Apply screen shake
            if (this.screenShake > 0) {
                this.ctx.save();
                this.ctx.translate(
                    (Math.random() - 0.5) * this.screenShake,
                    (Math.random() - 0.5) * this.screenShake
                );
            }
            
            // Apply glitch effect only in quality mode
            if (this.performanceMode === 'quality' && this.glitchIntensity > 0 && Math.random() < this.glitchIntensity) {
                this.ctx.fillStyle = `rgba(255, 0, 0, ${this.glitchIntensity * 0.1})`;
                this.ctx.fillRect(0, Math.random() * this.canvas.height, this.canvas.width, 2);
            }
            
            // Draw center line
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([10, 10]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width / 2, 0);
            this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // Draw ball trail
            this.ball.trail.forEach((point, index) => {
                if (point.opacity > 0) {
                    this.ctx.fillStyle = `rgba(255, 102, 0, ${point.opacity * 0.5})`;
                    this.ctx.beginPath();
                    this.ctx.arc(point.x, point.y, this.ball.radius * (index / this.ball.trail.length), 
                                0, Math.PI * 2);
                    this.ctx.fill();
                }
            });
            
            // Draw ball (simplified for debugging)
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw ball glow only in quality mode
            if (this.performanceMode === 'quality') {
                this.ctx.strokeStyle = '#ff6600';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius + 5, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            // Draw paddles with glow
            this.drawPaddle(this.playerPaddle, '#ff3333');
            this.drawPaddle(this.aiPaddle, '#ff6600');
            
            // Draw particles
            this.particles.forEach(particle => {
                this.ctx.fillStyle = particle.color || '#ff3333';
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
                this.ctx.globalAlpha = 1;
            });
            
            if (this.screenShake > 0) {
                this.ctx.restore();
            }
        }
        
        drawPaddle(paddle, color) {
            // Simple paddle drawing for debugging
            this.ctx.fillStyle = color;
            this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
            
            // Add white center
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(paddle.x + 4, paddle.y + 4, paddle.width - 8, paddle.height - 8);
        }
        
        gameLoop() {
            if (!this.isRunning) {
                return;
            }
            
            this.update();
            this.render();
            
            // Use setTimeout for 30fps to reduce load
            setTimeout(() => {
                requestAnimationFrame(() => this.gameLoop());
            }, 33); // ~30fps instead of 60fps
        }
    }
    
    // Initialize the game after a short delay to ensure all DOM elements are ready
    setTimeout(() => {
        const hyperPong = new HyperPong();
        console.log('HyperPong game initialized!');
        
        // Easter egg hint
        console.log('%c🎮 Secret unlocked: Click the logo for a surprise! 🎮', 
                    'color: #ff6600; font-size: 14px; font-weight: bold;');
    }, 100);
});
