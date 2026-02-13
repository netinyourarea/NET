/**
 * ConnectAid - Vanilla JavaScript
 * High-Performance Interactions
 */

// ========================================
// GLOBAL STATE & UTILITY
// ========================================

const state = {
    scrollY: 0,
    isMenuOpen: false,
    isModalOpen: false
};

const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
};

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// ========================================
// DOM REFERENCES
// ========================================

const DOM = {
    navbar: null,
    navbarNew: null,
    mobileMenuToggle: null,
    navMenu: null,
    navContent: null,
    floatingCallBtn: null,
    callModal: null,
    modalClose: null,
    autoPopup: null,
    autoPopupClose: null,
    faqQuestions: null,
    scrollRevealElements: null
};

// ========================================
// NAVIGATION
// ========================================

const initNavigation = () => {
    DOM.navbar = document.querySelector('.navbar');
    DOM.navbarNew = document.querySelector('.navbar-new');
    DOM.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    DOM.navMenu = document.getElementById('navMenu');
    DOM.navContent = document.querySelector('.nav-content');
    
    const activeNavbar = DOM.navbarNew || DOM.navbar;
    const activeMenu = DOM.navContent || DOM.navMenu;
    
    if (!activeNavbar) return;
    
    // Scroll behavior
    const handleScroll = throttle(() => {
        state.scrollY = window.scrollY;
        
        if (state.scrollY > 50) {
            if (DOM.navbar) DOM.navbar.classList.add('scrolled');
            if (DOM.navbarNew) DOM.navbarNew.classList.add('scrolled');
        } else {
            if (DOM.navbar) DOM.navbar.classList.remove('scrolled');
            if (DOM.navbarNew) DOM.navbarNew.classList.remove('scrolled');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle
    if (DOM.mobileMenuToggle && activeMenu) {
        DOM.mobileMenuToggle.addEventListener('click', () => {
            state.isMenuOpen = !state.isMenuOpen;
            activeMenu.classList.toggle('active');
            DOM.mobileMenuToggle.classList.toggle('active');
            
            // Animate hamburger
            const spans = DOM.mobileMenuToggle.querySelectorAll('span');
            if (state.isMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
        
        // Close menu on link click
        const navLinks = DOM.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (state.isMenuOpen) {
                    state.isMenuOpen = false;
                    DOM.navMenu.classList.remove('active');
                    DOM.mobileMenuToggle.classList.remove('active');
                    
                    const spans = DOM.mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '';
                    spans[2].style.transform = '';
                }
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ========================================
// MODAL SYSTEM
// ========================================

const initModal = () => {
    DOM.callModal = document.getElementById('callModal');
    DOM.modalClose = document.getElementById('modalClose');
    DOM.floatingCallBtn = document.getElementById('floatingCallBtn');
    
    if (!DOM.callModal) return;
    
    const openModal = () => {
        state.isModalOpen = true;
        DOM.callModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeModal = () => {
        state.isModalOpen = false;
        DOM.callModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // Open modal
    if (DOM.floatingCallBtn) {
        DOM.floatingCallBtn.addEventListener('click', openModal);
    }
    
    // Close modal
    if (DOM.modalClose) {
        DOM.modalClose.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    DOM.callModal.addEventListener('click', (e) => {
        if (e.target === DOM.callModal) {
            closeModal();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isModalOpen) {
            closeModal();
        }
    });
};

// ========================================
// FAQ ACCORDION
// ========================================

const initFAQ = () => {
    DOM.faqQuestions = document.querySelectorAll('.faq-question');
    
    if (!DOM.faqQuestions.length) return;
    
    DOM.faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQs
            DOM.faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    const a = q.nextElementSibling;
                    if (a) a.style.maxHeight = '0px';
                }
            });
            
            // Toggle current FAQ
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0px';
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
};

// ========================================
// SCROLL REVEAL ANIMATION
// ========================================

const initScrollReveal = () => {
    DOM.scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    if (!DOM.scrollRevealElements.length) return;
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after revealing
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    DOM.scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });
};

// ========================================
// FORM HANDLING
// ========================================

const initForms = () => {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        
        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success feedback
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#10B981';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);
        
        // In production, replace the simulation above with:
        /*
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#10B981';
                contactForm.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            submitBtn.textContent = 'Error - Try Again';
            submitBtn.style.background = '#DC2626';
        } finally {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        }
        */
    });
    
    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#DC2626';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });
};

// ========================================
// STATISTICS COUNTER ANIMATION
// ========================================

const initStatsCounter = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (!statNumbers.length) return;
    
    const animateCount = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const match = text.match(/(\d+)/);
                
                if (match) {
                    const number = parseInt(match[0]);
                    const suffix = text.replace(/\d+/, '');
                    entry.target.setAttribute('data-suffix', suffix);
                    animateCount(entry.target, number);
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
};

// ========================================
// PERFORMANCE & ACCESSIBILITY
// ========================================

const initAccessibility = () => {
    // Add keyboard navigation for custom buttons
    const customButtons = document.querySelectorAll('[role="button"]');
    customButtons.forEach(btn => {
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
    
    // Focus trap for modal
    const trapFocus = (element) => {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    };
    
    if (DOM.callModal) {
        trapFocus(DOM.callModal);
    }
};

// ========================================
// PERFORMANCE MONITORING
// ========================================

const initPerformance = () => {
    // Preload critical images
    const criticalImages = document.querySelectorAll('img[data-preload]');
    criticalImages.forEach(img => {
        const tempImg = new Image();
        tempImg.src = img.dataset.src || img.src;
    });
    
    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js';
        document.body.appendChild(lazyLoadScript);
    }
};

// ========================================
// GLOW EFFECT ON HOVER
// ========================================

const initGlowEffects = () => {
    const cards = document.querySelectorAll('.help-card, .stat-card, .timeline-content');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
};

// ========================================
// SMOOTH PAGE LOAD
// ========================================

const initPageTransition = () => {
    // Fade in body on load
    document.body.style.opacity = '0';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            document.body.style.opacity = '1';
        }, 100);
    });
};

// ========================================
// AUTO POPUP
// ========================================

const initAutoPopup = () => {
    DOM.autoPopup = document.getElementById('autoPopup');
    DOM.autoPopupClose = document.getElementById('autoPopupClose');
    
    if (!DOM.autoPopup) return;
    
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('autoPopupShown');
    
    if (!popupShown) {
        // Show popup after 5 seconds
        setTimeout(() => {
            DOM.autoPopup.classList.add('active');
            sessionStorage.setItem('autoPopupShown', 'true');
        }, 5000);
    }
    
    // Close popup handlers
    const closePopup = () => {
        DOM.autoPopup.classList.remove('active');
    };
    
    if (DOM.autoPopupClose) {
        DOM.autoPopupClose.addEventListener('click', closePopup);
    }
    
    // Close on overlay click
    DOM.autoPopup.addEventListener('click', (e) => {
        if (e.target === DOM.autoPopup) {
            closePopup();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.autoPopup.classList.contains('active')) {
            closePopup();
        }
    });
};

// ========================================
// ERROR TRACKING (Optional)
// ========================================

const initErrorTracking = () => {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.message, e.filename, e.lineno);
        // In production, send to error tracking service
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
        // In production, send to error tracking service
    });
};

// ========================================
// MAIN INITIALIZATION
// ========================================

const init = () => {
    // Core features
    initNavigation();
    initModal();
    initAutoPopup();
    initFAQ();
    initScrollReveal();
    initForms();
    initStatsCounter();
    
    // Enhancements
    initAccessibility();
    initPerformance();
    initGlowEffects();
    
    // Development only
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        initErrorTracking();
    }
    
    console.log('%cConnectAid Initialized', 'color: #E50914; font-size: 16px; font-weight: bold;');
};

// ========================================
// AUTO-INITIALIZE ON DOM READY
// ========================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// ANALYTICS HELPER (Optional)
// ========================================

const trackEvent = (category, action, label = '') => {
    // Example Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Console log for development
    console.log('Event tracked:', { category, action, label });
};

// Track CTA clicks
document.addEventListener('click', (e) => {
    const target = e.target.closest('[href^="tel:"]');
    if (target) {
        trackEvent('CTA', 'Click', 'Call Button');
    }
});

// ========================================
// EXPORT FOR EXTERNAL USE (if needed)
// ========================================

window.ConnectAid = {
    state,
    trackEvent,
    openModal: () => {
        if (DOM.callModal) {
            DOM.callModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    closeModal: () => {
        if (DOM.callModal) {
            DOM.callModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};
