// Image Slider Logic
let slideIndex = 1;
showSlides(slideIndex);

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove('active');
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    slides[slideIndex - 1].style.display = "flex"; // Changed to flex to maintain centering
    slides[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add("active");
}

// Automatic slide change
let autoSlideInterval = setInterval(() => {
    showSlides(slideIndex += 1);
}, 5000); // Change image every 5 seconds

// Optional: Pause slideshow on hover
const slider = document.querySelector('.image-slider');
if(slider) {
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            showSlides(slideIndex += 1);
        }, 5000);
    });
}


/* --- Shop Page and Payment Modal Logic --- */

document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const modal = document.getElementById('payment-modal');
    const closeButton = document.querySelector('#payment-modal .close-button');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductPrice = document.getElementById('modal-product-price');
    
    // Elements for UPI Copy
    const copyUpiIdButton = document.getElementById('copy-upi-id');
    const upiIdSpan = document.getElementById('upi-id');
    const copySuccessMessage = document.getElementById('copy-success');

    // 1. Show the modal when a 'Buy Now' button is clicked
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productItem = button.closest('.product-item');
            const productName = productItem.querySelector('h3').textContent;
            const productPrice = productItem.querySelector('.price').textContent;

            // Check if it's a quote request
            if (button.classList.contains('quote-btn')) {
                // Handle "Contact for Quote" via WhatsApp
                const message = `Hello Akku Electronics, I'm interested in getting a quote for the following product:\n\n*Product:* ${productName}\n\nPlease provide more information.`;
                const whatsappUrl = `https://wa.me/918956389723?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            } else {
                // For items with a price, open the payment modal
                modalProductName.textContent = productName;
                modalProductPrice.textContent = productPrice;
                // Use classList.add for smooth CSS animation
                modal.classList.add('open'); 
            }
        });
    });

    // 2. Close the modal using the button or outside click
    if(modal) {
        // Close button click
        closeButton.addEventListener('click', () => {
            modal.classList.remove('open');
        });

        // Click outside the modal content
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.classList.remove('open');
            }
        });
    }

    // 3. Copy UPI ID to clipboard (using document.execCommand for iframe compatibility)
    if (copyUpiIdButton && upiIdSpan && copySuccessMessage) {
        copyUpiIdButton.addEventListener('click', () => {
            const upiId = upiIdSpan.textContent;
            
            // Create a temporary input element to hold the text
            const tempInput = document.createElement('input');
            tempInput.value = upiId;
            document.body.appendChild(tempInput);
            
            // Select the text and execute the copy command
            tempInput.select();
            
            let success = false;
            try {
                // document.execCommand('copy') is the most reliable method in iframes
                success = document.execCommand('copy');
            } catch (err) {
                console.error('Failed to copy UPI ID using execCommand:', err);
            } finally {
                // Remove the temporary element
                document.body.removeChild(tempInput);
            }

            if (success) {
                // Show success message
                copySuccessMessage.style.display = 'block';
                setTimeout(() => {
                    copySuccessMessage.style.display = 'none';
                }, 2000); // Hide message after 2 seconds
            }
        });
    }
});
    /* --- Mobile Navigation Toggle & Dropdown Support --- */
    const menuToggle = document.querySelector('.menu-toggle');
    // Prefer the element with an explicit id (more robust) then fallback to class
    const navLinks = document.getElementById('primary-navigation') || document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
                // Toggle visual classes
                navLinks.classList.toggle('show');
                navLinks.classList.toggle('active');
                // Also toggle an explicit 'open' class (strong selector in CSS)
                navLinks.classList.toggle('open');
                // Update ARIA attribute for screen readers
                const expanded = navLinks.classList.contains('show') || navLinks.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });

        // Close the mobile nav when clicking outside
        document.addEventListener('click', (ev) => {
            const target = ev.target;
            if (!navLinks.contains(target) && !menuToggle.contains(target)) {
                navLinks.classList.remove('show');
                navLinks.classList.remove('active');
                navLinks.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        // Close menu with Escape key for keyboard users
        document.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape') {
                if (navLinks.classList.contains('show') || navLinks.classList.contains('active') || navLinks.classList.contains('open')) {
                    navLinks.classList.remove('show');
                    navLinks.classList.remove('active');
                    navLinks.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.focus();
                }
            }
        });
    }

    // Enable tapping to expand dropdowns on touch devices
    const dropdowns = document.querySelectorAll('.nav-links .dropdown');
        const dropdownLinks = document.querySelectorAll('.nav-links .dropdown > a');
        dropdownLinks.forEach(link => {
            // mark as having a popup for accessibility
            link.setAttribute('aria-haspopup', 'true');
            link.setAttribute('aria-expanded', 'false');
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    parent.classList.toggle('active');
                    const isOpen = parent.classList.contains('active');
                    // update aria-expanded on the trigger link
                    this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                }
            });
        });
