// ===== LOAD PRODUCTS FROM JSON =====
let products = [];
let cart = JSON.parse(localStorage.getItem('gameShopCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('gameShopWishlist')) || [];

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
            updateCartCount();
            updateWishlistCount();
            setupSearch();
            setupPriceDisplay();
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
        const imgSrc = product.imageUrl || fallbackImages[product.category] || fallbackImages.gear;
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

    // Price filter
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    filtered = filtered.filter(p => p.price <= maxPrice);

    // Stock filter
    if (document.getElementById('in-stock').checked) {
        filtered = filtered.filter(p => p.stock);
    }

    // Sale filter
    if (document.getElementById('on-sale').checked) {
        filtered = filtered.filter(p => p.discount > 0);
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

// Price Display
function setupPriceDisplay() {
    document.getElementById('priceRange').addEventListener('input', (e) => {
        document.getElementById('priceValue').textContent = parseInt(e.target.value).toLocaleString();
    });
}

// Shopping Cart Functions
function addToCart(productId, event) {
    if (event) event.stopPropagation();
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }

    localStorage.setItem('gameShopCart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('gameShopCart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        localStorage.setItem('gameShopCart', JSON.stringify(cart));
        updateCartModal();
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Wishlist Functions
function toggleWishlist(productId, event) {
    event.stopPropagation();
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
    } else {
        wishlist.push(productId);
    }
    localStorage.setItem('gameShopWishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    // Update UI
    document.querySelectorAll('.product-card').forEach(card => {
        if (parseInt(card.dataset.id) === productId) {
            card.querySelector('.wishlist-btn').classList.toggle('liked');
        }
    });
}

function updateWishlistCount() {
    document.querySelector('.wishlist-count').textContent = wishlist.length;
}

// Modal Functions
function openCartModal() {
    document.getElementById('cartModal').style.display = 'block';
    updateCartModal();
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function updateCartModal() {
    const body = document.getElementById('cartModalBody');
    if (cart.length === 0) {
        body.innerHTML = '<div class="empty-message"><i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 15px;"></i><p>Your cart is empty</p></div>';
        return;
    }

    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <h4 style="margin: 0 0 5px 0;">${item.name}</h4>
                <p style="margin: 0; color: #d4af37;">₹${item.price.toLocaleString()}</p>
            </div>
            <input type="number" min="1" value="${item.quantity}" onchange="updateCartQuantity(${item.id}, this.value)" class="quantity-input">
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    body.innerHTML = cartHTML + `<div class="cart-total">Total: ₹${total.toLocaleString()}</div>`;
}

function openWishlistModal() {
    document.getElementById('wishlistModal').style.display = 'block';
    updateWishlistModal();
}

function closeWishlistModal() {
    document.getElementById('wishlistModal').style.display = 'none';
}

function updateWishlistModal() {
    const body = document.getElementById('wishlistModalBody');
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    if (wishlistProducts.length === 0) {
        body.innerHTML = '<div class="empty-message"><i class="fas fa-heart" style="font-size: 3rem; margin-bottom: 15px;"></i><p>Your wishlist is empty</p></div>';
        return;
    }

    body.innerHTML = wishlistProducts.map(product => `
        <div class="wishlist-item">
            <div class="wishlist-item-details">
                <h4 style="margin: 0 0 5px 0;">${product.name}</h4>
                <p style="margin: 0; color: #d4af37;">₹${product.price.toLocaleString()}</p>
            </div>
            <div>
                <button class="btn-cart" onclick="addToCart(${product.id})" style="width: auto; padding: 8px 12px; margin-right: 8px;">Add to Cart</button>
                <button class="remove-btn" onclick="toggleWishlist(${product.id}, event)">Remove</button>
            </div>
        </div>
    `).join('');
}

function proceedToCheckout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    openWhatsApp(`Checkout Request: ${itemsList}. Total: ₹${total.toLocaleString()}`);
}

function openWhatsApp(productName, event) {
    if (event) event.stopPropagation();
    const phone = '918956389723';
    const message = `Hi, I'm interested in: ${productName}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function showNotification(message) {
    alert(message); // Simple notification - can be enhanced with toast
}

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const wishlistModal = document.getElementById('wishlistModal');
    if (event.target === cartModal) cartModal.style.display = 'none';
    if (event.target === wishlistModal) wishlistModal.style.display = 'none';
}
