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

// Dropdown Menu for Mobile
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
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

// ============================================
// SHOP PAGE - PAYMENT GATEWAY FUNCTIONALITY
// ============================================

// Get modal elements
const modal = document.getElementById('paymentModal');
const closeBtn = document.querySelector('.close-modal');
let currentProduct = {};

// Handle Buy Now button clicks
document.querySelectorAll('.buy-now').forEach(button => {
    button.addEventListener('click', function() {
        // Get product details from data attributes
        currentProduct = {
            name: this.getAttribute('data-product-name'),
            price: this.getAttribute('data-product-price'),
            image: this.getAttribute('data-product-image')
        };
        
        // Populate modal with product details
        document.getElementById('modalProductName').textContent = currentProduct.name;
        document.getElementById('modalProductPrice').textContent = currentProduct.price;
        document.getElementById('modalProductImage').src = currentProduct.image;
        document.getElementById('modalProductImage').alt = currentProduct.name;
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
});

// Close modal when clicking X
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Process payment based on selected method
function processPayment(method) {
    const productName = currentProduct.name;
    const productPrice = currentProduct.price;
    
    switch(method) {
        case 'whatsapp':
            // Send order via WhatsApp
            const whatsappMessage = `Hello! I want to order:\n\n*${productName}*\nPrice: ₹${productPrice}\n\nPlease confirm availability and delivery details.`;
            const whatsappUrl = `https://wa.me/918956389723?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            closeModal();
            break;
            
        case 'cod':
            // Cash on Delivery - Show confirmation
            alert(`✅ Order Confirmed!\n\nProduct: ${productName}\nPrice: ₹${productPrice}\nPayment Method: Cash on Delivery\n\nWe'll contact you shortly to confirm your order and delivery address.`);
            closeModal();
            // Here you can send order details to your backend
            break;
            
        case 'upi':
        case 'card':
        case 'netbanking':
            // Razorpay Integration (you need to sign up at razorpay.com)
            // This is a demo - replace with your actual Razorpay key
            initiateRazorpayPayment(method);
            break;
            
        default:
            alert('Please select a payment method');
    }
}

// Razorpay Payment Integration
function initiateRazorpayPayment(method) {
    // Note: For production, you need to:
    // 1. Sign up at https://razorpay.com
    // 2. Get your API keys
    // 3. Add Razorpay script to HTML: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    
    const amount = parseInt(currentProduct.price) * 100; // Razorpay accepts amount in paise
    
    // Demo alert - In production, this will open Razorpay payment gateway
    alert(`🔒 Secure Payment Gateway\n\nProduct: ${currentProduct.name}\nAmount: ₹${currentProduct.price}\nMethod: ${method.toUpperCase()}\n\n⚠️ To enable online payments:\n1. Sign up at razorpay.com\n2. Get API keys\n3. Add Razorpay script to shop.html\n\nCurrently showing demo mode.`);
    
    // Uncomment below code after setting up Razorpay account:
    /*
    const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Enter your Razorpay Key ID
        amount: amount,
        currency: 'INR',
        name: 'Akku Electronics',
        description: currentProduct.name,
        image: './images/logo.png',
        handler: function (response) {
            alert('Payment Successful!\nPayment ID: ' + response.razorpay_payment_id);
            closeModal();
            // Send payment confirmation to your backend
        },
        prefill: {
            name: '',
            email: '',
            contact: '8956389723'
        },
        theme: {
            color: '#d4af37'
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
    */
    
    closeModal();
}

console.log('Akku Electronics - Website loaded successfully!');
