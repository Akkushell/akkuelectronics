// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
}

// Dropdown Menu for Mobile — toggle only when the top-level link is clicked
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector(':scope > a');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            // close other open dropdowns for tidy mobile UX
            dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('active'); });
            dropdown.classList.toggle('active');
        }
    });
});

// Image Slider Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// Show specific slide
function showSlide(index) {
    // Reset if out of bounds
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Show current slide and dot
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

// Next/Previous slide
function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetSlideTimer();
}

// Go to specific slide
function currentSlide(index) {
    showSlide(index - 1);
    resetSlideTimer();
}

// Auto advance slides
function autoSlide() {
    slideInterval = setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, 5000); // Change slide every 5 seconds
}

// Reset timer on manual navigation
function resetSlideTimer() {
    clearInterval(slideInterval);
    autoSlide();
}

// Initialize slider
if (slides.length > 0) {
    showSlide(currentSlideIndex);
    autoSlide();

    // Pause on hover
    const slider = document.querySelector('.image-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        slider.addEventListener('mouseleave', () => {
            autoSlide();
        });
    }
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    }

    lastScroll = currentScroll;
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, .category-card, .service-card, .service-detail-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Payment gateway/shop-specific code removed — not referenced by current pages

// Firmware Selection Functionality
document.addEventListener('DOMContentLoaded', function() {
    const firmwareItems = document.querySelectorAll('.firmware-item');
    const platformButtons = document.querySelectorAll('.platform-btn');
    const modelButtons = document.querySelectorAll('.model-btn');
    const firmwareGroups = document.querySelectorAll('.firmware-group');
    const firmwareEmpty = document.getElementById('firmware-empty');
    const firmwareTitle = document.getElementById('firmware-title');
    const firmwareDescription = document.getElementById('firmware-description');
    const firmwareDownload = document.getElementById('firmware-download');

    if (firmwareItems.length === 0 || !firmwareTitle || !firmwareDescription || !firmwareDownload) {
        return;
    }

    let activePlatform = 'ps3';
    let activeModel = 'all';

    const updateDisplay = (item) => {
        const title = item.getAttribute('data-title') || '';
        const description = item.getAttribute('data-desc') || '';
        const url = item.getAttribute('data-url') || '#';
        const btnText = item.getAttribute('data-btn') || 'Download';

        firmwareTitle.style.opacity = '0';
        firmwareDescription.style.opacity = '0';
        firmwareDownload.style.opacity = '0';

        setTimeout(() => {
            firmwareTitle.textContent = title;
            firmwareDescription.textContent = description;
            firmwareDownload.href = url;
            firmwareDownload.textContent = btnText;

            firmwareTitle.style.opacity = '1';
            firmwareDescription.style.opacity = '1';
            firmwareDownload.style.opacity = '1';
        }, 200);
    };

    const setActiveItem = (item) => {
        firmwareItems.forEach(i => i.classList.remove('active'));
        if (item) {
            item.classList.add('active');
            updateDisplay(item);
        }
    };

    const updateModelButtons = () => {
        let activeModelStillVisible = false;

        modelButtons.forEach(button => {
            const isVisible = button.getAttribute('data-platform') === activePlatform;
            button.hidden = !isVisible;

            if (isVisible && button.getAttribute('data-model') === activeModel) {
                activeModelStillVisible = true;
            }
        });

        if (!activeModelStillVisible) {
            const defaultModelButton = Array.from(modelButtons).find(button => {
                return button.getAttribute('data-platform') === activePlatform && button.getAttribute('data-model') === 'all';
            }) || Array.from(modelButtons).find(button => button.getAttribute('data-platform') === activePlatform);

            activeModel = defaultModelButton ? defaultModelButton.getAttribute('data-model') : 'all';
        }

        modelButtons.forEach(button => {
            const isCurrent = button.getAttribute('data-platform') === activePlatform && button.getAttribute('data-model') === activeModel;
            button.classList.toggle('active', isCurrent);
        });
    };

    const applyFilters = () => {
        let firstVisibleItem = null;
        let visibleCount = 0;

        firmwareItems.forEach(item => {
            const itemPlatform = item.getAttribute('data-platform');
            const itemModel = item.getAttribute('data-model') || 'all';
            const platformMatch = itemPlatform === activePlatform;
            const modelMatch = activeModel === 'all' || itemModel === 'all' || itemModel === activeModel;
            const showItem = platformMatch && modelMatch;

            item.hidden = !showItem;
            if (showItem) {
                visibleCount += 1;
                if (!firstVisibleItem) {
                    firstVisibleItem = item;
                }
            }
        });

        firmwareGroups.forEach(group => {
            const hasVisibleItems = group.querySelector('.firmware-item:not([hidden])');
            group.hidden = !hasVisibleItems;
        });

        if (firmwareEmpty) {
            firmwareEmpty.hidden = visibleCount > 0;
        }

        const currentActive = document.querySelector('.firmware-item.active:not([hidden])');
        if (!currentActive && firstVisibleItem) {
            setActiveItem(firstVisibleItem);
        }
    };

    platformButtons.forEach(button => {
        button.addEventListener('click', function() {
            activePlatform = this.getAttribute('data-platform') || 'ps3';

            platformButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            updateModelButtons();
            applyFilters();
        });
    });

    modelButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.hidden) {
                return;
            }

            activeModel = this.getAttribute('data-model') || 'all';
            updateModelButtons();
            applyFilters();
        });
    });

    firmwareItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.hidden) {
                return;
            }
            setActiveItem(this);
        });
    });

    firmwareTitle.style.transition = 'opacity 0.3s ease';
    firmwareDescription.style.transition = 'opacity 0.3s ease';
    firmwareDownload.style.transition = 'opacity 0.3s ease';

    updateModelButtons();
    applyFilters();
});

console.log('Akku Electronics - Website loaded successfully!');
