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
document.querySelectorAll('.card, .category-card, .service-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Payment gateway/shop-specific code removed — not referenced by current pages

// Firmware Selection Functionality
document.addEventListener('DOMContentLoaded', function() {
    const firmwareItems = document.querySelectorAll('.firmware-item');
    const firmwareTitle = document.getElementById('firmware-title');
    const firmwareDescription = document.getElementById('firmware-description');
    const firmwareDownload = document.getElementById('firmware-download');
    
    if (firmwareItems.length > 0 && firmwareTitle && firmwareDescription && firmwareDownload) {
        firmwareItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                firmwareItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get data attributes
                const title = this.getAttribute('data-title');
                const description = this.getAttribute('data-desc');
                const url = this.getAttribute('data-url');
                const btnText = this.getAttribute('data-btn');
                
                // Update display container with smooth transition
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
            });
        });
        
        // Add transition effect to elements
        firmwareTitle.style.transition = 'opacity 0.3s ease';
        firmwareDescription.style.transition = 'opacity 0.3s ease';
        firmwareDownload.style.transition = 'opacity 0.3s ease';
    }
});

console.log('Akku Electronics - Website loaded successfully!');
