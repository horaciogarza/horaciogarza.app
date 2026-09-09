/**
 * Premium Animation System
 * Particles, Parallax, Smooth Scroll, and Micro-interactions
 */

class PremiumAnimations {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createParticles();
        this.initParallax();
        this.initScrollAnimations();
        this.initScrollProgress();
        this.initMagneticButtons();
        this.initSmoothScroll();
        this.initCardHoverEffects();
        this.animateOnLoad();
    }

    // Particle System
    createParticles() {
        const container = document.createElement('div');
        container.className = 'particles-container';
        document.body.insertBefore(container, document.body.firstChild);

        const particleCount = window.innerWidth < 768 ? 15 : 30;
        const colors = [
            'rgba(217, 120, 69, 0.3)',
            'rgba(123, 156, 175, 0.3)',
            'rgba(232, 149, 96, 0.2)',
            'rgba(168, 197, 216, 0.2)'
        ];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 6 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            const startX = Math.random() * 100;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${startX}%;
                bottom: -20px;
                animation: particleFloat ${duration}s ${delay}s infinite ease-in-out;
            `;

            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    // Parallax Effect
    initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element');

        if (parallaxElements.length === 0) return;

        // Cache each element's natural document-relative center so the
        // parallax offset can be derived from its position in the viewport
        // rather than the unbounded absolute scroll position.
        this.cacheParallaxPositions(parallaxElements);

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax(parallaxElements);
                    ticking = false;
                });
                ticking = true;
            }
        });

        window.addEventListener('resize', () => {
            this.cacheParallaxPositions(parallaxElements);
            this.updateParallax(parallaxElements);
        });

        // Apply once on load so positions are correct before any scrolling
        this.updateParallax(parallaxElements);
    }

    cacheParallaxPositions(elements) {
        const scrolled = window.pageYOffset;
        elements.forEach(element => {
            // Neutralize any transform we previously applied before measuring
            const previous = element.style.transform;
            element.style.transform = 'none';
            const rect = element.getBoundingClientRect();
            element.style.transform = previous;
            // Document-relative center of the element in its resting position
            element._parallaxCenter = rect.top + scrolled + rect.height / 2;
        });
    }

    updateParallax(elements) {
        const scrolled = window.pageYOffset;
        const viewportCenter = scrolled + window.innerHeight / 2;
        // Keep the effect subtle and bounded so icons never leave their cards
        const maxOffset = 40;

        elements.forEach(element => {
            const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
            const center = element._parallaxCenter;
            if (center == null) return;
            // Distance of the element's center from the viewport center,
            // so the offset is ~0 while the element sits in view.
            const fromCenter = center - viewportCenter;
            let yPos = -(fromCenter * speed * 0.15);
            yPos = Math.max(-maxOffset, Math.min(maxOffset, yPos));
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated', 'revealed');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll, .reveal-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Scroll Progress Indicator
    initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const winScroll = document.documentElement.scrollTop;
                    const height = document.documentElement.scrollHeight -
                                 document.documentElement.clientHeight;
                    const scrolled = (winScroll / height);
                    progressBar.style.transform = `scaleX(${scrolled})`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Magnetic Button Effect
    initMagneticButtons() {
        const buttons = document.querySelectorAll('.magnetic-btn, .btn');

        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const moveX = x * 0.3;
                const moveY = y * 0.3;

                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Smooth Scroll
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Card Hover Effects
    initCardHoverEffects() {
        const cards = document.querySelectorAll('.app-card, .card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('card-hover-lift');
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-8px)
                    scale(1.02)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });
    }

    // Animate on Load
    animateOnLoad() {
        // Add stagger animation to hero elements
        const heroElements = document.querySelectorAll('.hero > *');
        heroElements.forEach((el, index) => {
            el.classList.add('animate-on-scroll', `stagger-${Math.min(index + 1, 6)}`);
            setTimeout(() => {
                el.classList.add('animated');
            }, 100);
        });
    }
}

// Floating Illustration Generator
class FloatingShapes {
    constructor() {
        this.shapes = [];
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createShapes());
        } else {
            this.createShapes();
        }
    }

    createShapes() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        const container = document.createElement('div');
        container.className = 'floating-shapes-container';
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;

        heroSection.style.position = 'relative';
        heroSection.appendChild(container);

        // Create organic blob shapes
        this.createBlob(container, 1);
        this.createBlob(container, 2);
        this.createBlob(container, 3);
    }

    createBlob(container, index) {
        const blob = document.createElement('div');
        const colors = [
            'rgba(217, 120, 69, 0.08)',
            'rgba(123, 156, 175, 0.08)',
            'rgba(232, 149, 96, 0.06)'
        ];

        const size = 200 + (index * 100);
        const positions = [
            { top: '10%', left: '5%' },
            { top: '60%', right: '10%' },
            { top: '30%', left: '70%' }
        ];

        blob.className = 'blob-shape';
        blob.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[index - 1]};
            ${Object.entries(positions[index - 1]).map(([k, v]) => `${k}: ${v}`).join('; ')};
            filter: blur(60px);
            opacity: 0.6;
            animation-delay: ${index * 2}s;
        `;

        container.appendChild(blob);
    }
}

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 5;
        this.init();
    }

    init() {
        if (window.innerWidth < 768) return; // Skip on mobile

        document.addEventListener('mousemove', (e) => {
            this.addTrailDot(e.clientX, e.clientY);
        });
    }

    addTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%) scale(0);
        `;

        document.body.appendChild(dot);

        requestAnimationFrame(() => {
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        setTimeout(() => {
            dot.style.opacity = '0';
            dot.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => dot.remove(), 300);
        }, 500);
    }
}

// Initialize all animations
let animations, floatingShapes, mouseTrail;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
    initializeAnimations();
}

function initializeAnimations() {
    animations = new PremiumAnimations();
    floatingShapes = new FloatingShapes();
    mouseTrail = new MouseTrail();
}
