// ===== LOAD PRODUCTS FROM JSON =====
let products = [];

const fallbackImages = {
    consoles: 'images/products/consoles.svg',
    controllers: 'images/products/controllers.svg',
    accessories: 'images/products/accessories.svg',
    parts: 'images/products/parts.svg',
    gear: 'images/products/gear.svg'
};

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
    loadProductsFromJSON();
});

// Load products from external JSON file
function loadProductsFromJSON() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data.products;
            displayProducts(products);
            setupSearch();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            document.getElementById('productsGrid').innerHTML = '<p style="color: red;">Error loading products. Please refresh the page.</p>';
        });
}

// Display Products
function displayProducts(productsToDisplay) {
    const grid = document.getElementById('productsGrid');
    if (productsToDisplay.length === 0) {
        grid.innerHTML = '<div class="no-products"><i class="fas fa-search"></i><h3>No products found</h3><p>Try adjusting your filters or search terms</p></div>';
        return;
    }

    grid.innerHTML = productsToDisplay.map(product => {
        // Support both images array and single imageUrl for backward compatibility
        let imgSrc;
        if (product.images && product.images.length > 0) {
            imgSrc = product.images[0]; // Use first image from array
        } else if (product.imageUrl) {
            imgSrc = product.imageUrl;
        } else {
            imgSrc = fallbackImages[product.category] || fallbackImages.gear;
        }
        
        return `
        <div class="product-card" data-id="${product.id}" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor: pointer;">
            <div class="product-image">
                <img src="${imgSrc}" alt="${product.name}" class="product-thumb" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <button class="btn-buy" onclick="openWhatsApp('${product.name}', event)" ${!product.stock ? 'disabled' : ''}>Buy</button>
            </div>
        </div>
    `;
    }).join('');
}

// Search Functionality
function setupSearch() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.price.toString().includes(query)
        );
        displayProducts(filtered);
    });
}

// Apply Filters
function applyFilters() {
    let filtered = [...products];

    // Category filter
    const selectedCategories = [];
    ['consoles', 'controllers', 'accessories', 'parts', 'gear'].forEach(cat => {
        if (document.getElementById(`cat-${cat}`).checked) {
            selectedCategories.push(cat);
        }
    });
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    displayProducts(filtered);
}

// Sort Products
function applySort() {
    const sortValue = document.getElementById('sortSelect').value;
    let sorted = [...products];

    switch(sortValue) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'discount':
            sorted.sort((a, b) => b.discount - a.discount);
            break;
        default:
            sorted.sort((a, b) => b.id - a.id);
    }
    displayProducts(sorted);
}

// WhatsApp Integration
function openWhatsApp(productName, event) {
    if (event) event.stopPropagation();
    const phone = '918956389723';
    const message = `Hi, I'm interested in: ${productName}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
