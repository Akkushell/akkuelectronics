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
slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
slider.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
        showSlides(slideIndex += 1);
    }, 5000);
});


// Responsive Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', 
            menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
    });

    // Handle dropdown menus
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Keyboard navigation
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        dropdownLink.addEventListener('click', (e) => {
            // Only toggle on smaller screens where the menu is collapsed
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Prevent navigating to '#'
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            dropdowns.forEach(d => d.classList.remove('active')); // Also close dropdowns
        }
    });

    // Close dropdowns when clicking outside on desktop (if open)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active'); // Ensure menu is closed if resized up
            dropdowns.forEach(d => d.classList.remove('active')); // Close dropdowns on desktop
        }
    });

    // WhatsApp Buy Button Logic
    const buyButtons = document.querySelectorAll('.buy-btn');
    const phoneNumber = '918956389723'; // Your WhatsApp number

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productItem = button.closest('.product-item');
            const productName = productItem.dataset.name;
            const productPrice = productItem.dataset.price;
            const productDescription = productItem.querySelector('.product-description').textContent.trim();
            
            const message = `Hello Akku Electronics, I'm interested in buying the following product:\n\n*Product:* ${productName}\n*Price:* ${productPrice}\n\nPlease let me know the next steps.`;
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    });
});