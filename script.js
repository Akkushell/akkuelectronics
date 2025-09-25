// Image Slider Logic
let slideIndex = 1;
showSlides(slideIndex);

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

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
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
});