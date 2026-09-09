/**
 * Minimal Navigation System
 * Handles menu toggle, auto-hide on scroll, and smooth interactions
 */

class MinimalNavigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.toggle = document.getElementById('navToggle');
        this.menu = document.getElementById('navMenu');
        this.links = document.querySelectorAll('.nav-link');
        this.lastScroll = 0;
        this.isMenuOpen = false;

        if (!this.nav || !this.toggle || !this.menu) return;

        this.init();
    }

    init() {
        // Toggle menu on click
        this.toggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking links
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Auto-hide navigation on scroll down
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;

        if (this.isMenuOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    openMenu() {
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        this.isMenuOpen = true;
    }

    closeMenu() {
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        this.isMenuOpen = false;
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        // Don't hide navigation at the very top
        if (currentScroll <= 100) {
            this.nav.classList.remove('hidden');
            this.lastScroll = currentScroll;
            return;
        }

        // Hide on scroll down, show on scroll up
        if (currentScroll > this.lastScroll && currentScroll > 200) {
            // Scrolling down
            this.nav.classList.add('hidden');
            this.closeMenu(); // Close menu when hiding nav
        } else if (currentScroll < this.lastScroll) {
            // Scrolling up
            this.nav.classList.remove('hidden');
        }

        this.lastScroll = currentScroll;
    }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MinimalNavigation());
} else {
    new MinimalNavigation();
}
