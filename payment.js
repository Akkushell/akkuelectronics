/**
 * AKKU ELECTRONICS - COMPLETE PAYMENT SYSTEM
 * UPI Payment with Invoice, Email, WhatsApp, Google Sheets Logging & Local Storage
 * @version 2.0
 */

// ============================================================================
// CONFIGURATION SECTION
// ============================================================================

const CONFIG = {
    // UPI Payment Details
    upiId: "akkue89563749@barodampay",
    upiMobile: "918956389723",
    merchantName: "Akku Electronics",
    
    // Business Contact
    storeEmail: "akkuelectronics.nagpur@gmail.com",
    storePhone: "+918956389723",
    storeAddress: "354, VHB Colony, Balabhau Peth, PanchPaoli, Nagpur, MH 440008, India",
    storeLogo: "https://akkuelectronics.in/images/aelogo.png",
    
    // EmailJS Configuration
    emailjs: {
        serviceId: "service_n0k02w5",
        templateId: "template_o0reqai",
        publicKey: "H0DYylQzCYbPNlrq9"
    },
    
    // Google Sheets Integration
    googleSheets: {
        url: "https://script.google.com/macros/s/AKfycbwI6_6GBjAQh6tR8hnW2hXDPdg2T_tTigLpxflXDtaBlqS0Ia4J9vb5v2z1eNiey-1k/exec"
    },
    
    // Company Details
    company: {
        name: "Akku Electronics",
        description: "Gaming Console Repair & Sales Specialist",
        website: "https://akkuelectronics.in",
        social: {
            facebook: "https://www.facebook.com/akku0101",
            instagram: "https://www.instagram.com/akkuelectronics.nagpur",
            twitter: "https://x.com/Sunil_Moundekar"
        }
    }
};

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init(CONFIG.emailjs.publicKey);
}

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

let currentProduct = null;
let currentOrderId = null;
let orderHistory = [];
let paymentInProgress = false;
let lastSuccessfulOrderData = null;
let lastSuccessfulInvoiceData = null;

// ============================================================================
// PAYMENT MODAL MANAGEMENT
// ============================================================================

/**
 * Open Payment Modal
 * @param {Object} product - Product object with id, name, price, image, category
 */
function openPaymentModal(product) {
    try {
        // Validate product data
        if (!product || !product.id) {
            showNotification('Error: Invalid product data. Please try again.', 'error');
            return false;
        }
        
        if (!product.price || product.price <= 0) {
            showNotification('Error: Invalid product price. Please contact support.', 'error');
            return false;
        }
        
        const modal = document.getElementById('paymentModal');
        if (!modal) {
            showNotification('Error: Payment system not initialized. Please refresh the page.', 'error');
            return false;
        }
        
        // Set current product and generate order ID
        currentProduct = {
            ...product,
            originalPrice: product.originalPrice || product.price
        };
        currentOrderId = generateOrderId();
        paymentInProgress = true;
        
        // Display order summary and show step 0
        displayOrderSummary(product);
        modal.style.display = 'block';
        goToPaymentStep(0);
        
        console.log('Payment modal opened for product:', currentProduct.name);
        return true;
    } catch (error) {
        console.error('Error opening payment modal:', error);
        showNotification('An unexpected error occurred. Please try again.', 'error');
        return false;
    }
}

/**
 * Navigate to specific payment step with progress indicator
 */
function goToPaymentStep(stepNum) {
    try {
        // Hide all steps
        for (let i = 0; i <= 4; i++) {
            const step = document.getElementById(`paymentStep${i}`);
            if (step) step.classList.add('hidden');
            
            const progress = document.getElementById(`progressStep${i}`);
            if (progress) progress.classList.remove('active');
        }
        
        // Show selected step
        const currentStep = document.getElementById(`paymentStep${stepNum}`);
        if (currentStep) currentStep.classList.remove('hidden');
        
        // Update progress indicator
        for (let i = 0; i <= stepNum; i++) {
            const progress = document.getElementById(`progressStep${i}`);
            if (progress) progress.classList.add('active');
        }
        
        // Scroll to top of modal
        const modalContent = document.querySelector('.payment-modal-content');
        if (modalContent) modalContent.scrollTop = 0;
        
        console.log('Navigated to payment step:', stepNum);
    } catch (error) {
        console.error('Error navigating to step:', error);
    }
}

/**
 * Display Order Summary (Step 0)
 */
function displayOrderSummary(product) {
    try {
        const discount = product.originalPrice ? 
            product.originalPrice - product.price : 0;
        const discountPercent = product.originalPrice ?
            Math.round((discount / product.originalPrice) * 100) : 0;
        
        const summaryCard = document.getElementById('summaryCard');
        if (summaryCard) {
            summaryCard.innerHTML = `
                <h3>📦 ${product.name}</h3>
                <div class="detail-card-row">
                    <span class="detail-card-label">Category:</span>
                    <span class="detail-card-value">${product.category}</span>
                </div>
            `;
        }
        
        const originalPrice = document.getElementById('summaryOriginalPrice');
        if (originalPrice) {
            originalPrice.textContent = `₹${product.originalPrice?.toLocaleString('en-IN') || '0'}`;
        }
        
        const discountRow = document.getElementById('discountRow');
        const discountElement = document.getElementById('summaryDiscount');
        if (discount > 0) {
            if (discountRow) discountRow.style.display = 'flex';
            if (discountElement) {
                discountElement.textContent = `-${discountPercent}% (₹${discount.toLocaleString('en-IN')})`;
            }
        } else {
            if (discountRow) discountRow.style.display = 'none';
        }
        
        const finalPrice = document.getElementById('summaryFinalPrice');
        if (finalPrice) {
            finalPrice.textContent = `₹${product.price.toLocaleString('en-IN')}`;
        }
        
        // Also set payment summary for step 1
        displayPaymentSummary(product);
        
    } catch (error) {
        console.error('Error displaying order summary:', error);
    }
}

/**
 * Display Product Summary in Payment Modal (Step 1)
 */
function displayPaymentSummary(product) {
    const summaryDiv = document.getElementById('productSummary');
    if (!summaryDiv) return;
    
    const discount = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    summaryDiv.innerHTML = `
        <div class="payment-summary-card">
            <div class="summary-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/200?text=Product'" loading="lazy">
            </div>
            <div class="summary-details">
                <h4>${product.name}</h4>
                <p class="summary-category">Category: ${product.category}</p>
                ${product.originalPrice ? `
                    <div class="price-display">
                        <span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                        <span class="discount-badge">${discount}% OFF</span>
                    </div>
                ` : ''}
                <p class="final-price">Final Price: <strong>₹${product.price.toLocaleString('en-IN')}</strong></p>
            </div>
        </div>
    `;
    
    document.getElementById('paymentAmount').textContent = product.price.toLocaleString('en-IN');
}

/**
 * Submit Payment Form (Step 2) - Move to Confirmation
 */
function submitPaymentForm() {
    try {
        console.log('submitPaymentForm called');
        
        const validation = validatePaymentForm();
        console.log('Form validation result:', validation);
        
        if (!validation.valid) {
            showNotification(`Error: ${validation.message}`, 'error');
            return;
        }
        
        // Show confirmation step
        console.log('Navigating to step 3');
        goToPaymentStep(3);
        
        // Display confirmation
        console.log('Displaying order confirmation');
        displayOrderConfirmation();
        console.log('Order confirmation displayed successfully');
    } catch (error) {
        console.error('Fatal error in submitPaymentForm:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

/**
 * Close Payment Modal
 */
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentProduct = null;
    currentOrderId = null;
    paymentInProgress = false;
    
    // Reset form
    const form = document.getElementById('utrForm');
    if (form) form.reset();
}

// Modal close on outside click
window.addEventListener('click', function(event) {
    const modal = document.getElementById('paymentModal');
    if (modal && event.target === modal) {
        closePaymentModal();
    }
});

// Close button handler
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.payment-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }
});


// ============================================================================
// PAYMENT METHOD SELECTION
// ============================================================================

/**
 * Show Payment Method Selection Step (Legacy - now uses goToPaymentStep)
 */
function showPaymentMethodStep() {
    goToPaymentStep(1);
}

/**
 * Open UPI Payment App
 * @param {string} app - UPI app identifier (phonepe, gpay, paytm)
 */
function openUPIApp(app) {
    if (!currentProduct || !currentOrderId) {
        showNotification('Error: Product data missing. Please close and try again.', 'error');
        return;
    }
    
    // Use standard UPI URL scheme that works across all apps
    const params = new URLSearchParams({
        pa: CONFIG.upiId,
        pn: CONFIG.merchantName,
        cu: 'INR',
        tn: `Payment for ${currentProduct.name}`,
        tr: currentOrderId,
        am: currentProduct.price.toString()
    });
    
    // Standard UPI URL that works on all Android UPI apps
    const upiUrl = `upi://pay?${params.toString()}`;
    
    try {
        // Open the UPI payment
        window.location.href = upiUrl;
        
        // Show notification after a delay
        setTimeout(() => {
            showNotification(
                `UPI payment opened. Complete payment and return to enter Transaction ID.`,
                'info'
            );
        }, 1500);
    } catch (error) {
        console.error('Error opening UPI payment:', error);
        showNotification('Could not open UPI payment. Please try the Copy UPI ID method.', 'error');
    }
}

/**
 * Generic UPI Link for Web Browser (Fallback)
 */
function generateUPILink() {
    if (!currentProduct || !currentOrderId) {
        showNotification('Error: Product data missing.', 'error');
        return;
    }
    
    const params = new URLSearchParams({
        pa: CONFIG.upiId,
        pn: CONFIG.merchantName,
        am: currentProduct.price,
        tn: `Order ${currentOrderId} - ${currentProduct.name}`,
        tr: currentOrderId,
        cu: 'INR'
    });
    
    const upiLink = `upi://pay?${params.toString()}`;
    window.location.href = upiLink;
}

/**
 * Show Form Step (for entering customer details)
 */
function showFormStep() {
    goToPaymentStep(2);
}


// ============================================================================
// PAYMENT SUBMISSION & PROCESSING
// ============================================================================

/**
 * Main Payment Submission Handler
 */
/**
 * Display Order Confirmation Page (Step 3) - Review before final submit
 */
function displayOrderConfirmation() {
    try {
        console.log('=== displayOrderConfirmation START ===');
        
        const confirmContent = document.getElementById('confirmationContent');
        console.log('confirmContent element:', confirmContent);
        
        if (!confirmContent) {
            throw new Error('Confirmation content element (confirmationContent) not found in DOM');
        }
        
        // Safely extract all form data with defaults
        const customerName = (document.getElementById('customerName')?.value || '').trim();
        const customerEmail = (document.getElementById('customerEmail')?.value || '').trim();
        const customerPhone = (document.getElementById('customerPhone')?.value || '').trim();
        const customerAddress = (document.getElementById('customerAddress')?.value || '').trim();
        const utr = (document.getElementById('utrNumber')?.value || '').trim();
        
        console.log('Form data:', { customerName, customerEmail, customerPhone, customerAddress, utr });
        
        // Verify currentProduct exists
        if (!currentProduct) {
            throw new Error('Product data (currentProduct) is missing. Please try again.');
        }
        
        console.log('currentProduct:', currentProduct);
        
        // Safe number conversion
        const originalPrice = parseFloat(currentProduct.originalPrice) || parseFloat(currentProduct.price) || 0;
        const finalPrice = parseFloat(currentProduct.price) || 0;
        const discount = originalPrice - finalPrice;
        const discountPercent = originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;
        
        console.log('Pricing:', { originalPrice, finalPrice, discount, discountPercent });
        
        const formattedDate = new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const formattedTime = new Date().toLocaleTimeString('en-IN');
        const orderId = currentOrderId || generateOrderId();
        
        console.log('Formatting:', { formattedDate, formattedTime, orderId });
        
        // Build HTML with safe string concatenation
        let htmlContent = '<div class="detail-card">';
        htmlContent += '<h3>📦 PRODUCT DETAILS</h3>';
        htmlContent += '<div class="detail-card-row">';
        htmlContent += '<span class="detail-card-label">Product:</span>';
        htmlContent += '<span class="detail-card-value">' + (currentProduct.name || 'N/A') + '</span>';
        htmlContent += '</div>';
        
        htmlContent += '<div class="detail-card-row">';
        htmlContent += '<span class="detail-card-label">Category:</span>';
        htmlContent += '<span class="detail-card-value">' + (currentProduct.category || 'N/A') + '</span>';
        htmlContent += '</div>';
        
        htmlContent += '<div class="detail-card-row">';
        htmlContent += '<span class="detail-card-label">Original Price:</span>';
        htmlContent += '<span class="detail-card-value">₹' + originalPrice.toLocaleString('en-IN') + '</span>';
        htmlContent += '</div>';
        
        if (discount > 0) {
            htmlContent += '<div class="detail-card-row" style="color: #27ae60;">';
            htmlContent += '<span class="detail-card-label" style="color: #27ae60;">Discount:</span>';
            htmlContent += '<span class="detail-card-value">-' + discountPercent + '% (₹' + discount.toLocaleString('en-IN') + ')</span>';
            htmlContent += '</div>';
        }
        
        htmlContent += '<div class="final-amount-row">';
        htmlContent += '<span class="final-amount-label">Final Amount:</span>';
        htmlContent += '<span class="final-amount-value">₹' + finalPrice.toLocaleString('en-IN') + '</span>';
        htmlContent += '</div></div>';
        
        // Customer Details
        htmlContent += '<div class="detail-card">';
        htmlContent += '<h3>👤 CUSTOMER DETAILS</h3>';
        htmlContent += '<div class="detail-card-row"><span class="detail-card-label">Name:</span><span class="detail-card-value">' + customerName + '</span></div>';
        htmlContent += '<div class="detail-card-row"><span class="detail-card-label">Email:</span><span class="detail-card-value">' + customerEmail + '</span></div>';
        htmlContent += '<div class="detail-card-row"><span class="detail-card-label">Phone:</span><span class="detail-card-value">+91' + customerPhone + '</span></div>';
        htmlContent += '<div class="detail-card-row"><span class="detail-card-label">Address:</span><span class="detail-card-value">' + customerAddress + '</span></div>';
        htmlContent += '</div>';
        
        // Payment Details
        htmlContent += '<div class="detail-card">';
        htmlContent += '<h3>💳 PAYMENT DETAILS</h3>';
        htmlContent += '<div class="detail-card-row"><span class="detail-card-label">Method:</span><span class="detail-card-value">UPI</span></div>';
        htmlContent += '<div class="detail-card-row"><span class="detail-card-label">Transaction ID:</span><span class="detail-card-value highlight">' + utr + '</span></div>';
        htmlContent += '<div class="detail-card-row"><span class="detail-card-label">Amount:</span><span class="detail-card-value">₹' + finalPrice.toLocaleString('en-IN') + '</span></div>';
        htmlContent += '<div class="detail-card-row"><span class="detail-card-label">Date & Time:</span><span class="detail-card-value">' + formattedDate + ' ' + formattedTime + '</span></div>';
        htmlContent += '</div>';
        
        // Order ID Card
        htmlContent += '<div class="order-id-card">';
        htmlContent += '<p class="order-id-label">Order ID</p>';
        htmlContent += '<p class="order-id-display">' + orderId + '</p>';
        htmlContent += '</div>';
        
        console.log('Setting confirmContent innerHTML');
        confirmContent.innerHTML = htmlContent;
        
        // Set action buttons
        const confirmActions = document.getElementById('confirmationActions');
        console.log('confirmationActions element:', confirmActions);
        
        if (confirmActions) {
            confirmActions.innerHTML = '<button type="button" onclick="goToPaymentStep(2)" class="back-btn"><i class="fas fa-arrow-left"></i> Back</button><button type="button" onclick="finalizeOrder()" class="submit-btn"><i class="fas fa-check"></i> Confirm & Process</button>';
        }
        
        console.log('=== displayOrderConfirmation SUCCESS ===');
        
    } catch (error) {
        console.error('ERROR in displayOrderConfirmation:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        showNotification('Error: ' + error.message, 'error');
    }
}

/**
 * Finalize Order - Generate Invoice, Send Emails, Log to Sheets (Step 3 → Step 4)
 */
async function finalizeOrder() {
    try {
        const confirmBtn = document.querySelector('[onclick="finalizeOrder()"]');
        
        // Build order data from current form state
        const customerData = {
            name: document.getElementById('customerName')?.value?.trim() || 'Guest Customer',
            email: document.getElementById('customerEmail')?.value?.trim() || '',
            phone: '91' + (document.getElementById('customerPhone')?.value?.trim() || ''),
            address: document.getElementById('customerAddress')?.value?.trim() || ''
        };
        
        const utr = document.getElementById('utrNumber')?.value?.trim() || '';
        
        const orderData = {
            orderId: currentOrderId || generateOrderId(),
            product: {
                id: currentProduct.id,
                name: currentProduct.name,
                category: currentProduct.category,
                originalPrice: currentProduct.originalPrice,
                price: currentProduct.price
            },
            customer: customerData,
            payment: {
                method: 'UPI',
                upiId: CONFIG.upiId,
                utr: utr,
                amount: currentProduct.price,
                status: 'VERIFIED',
                timestamp: new Date().toISOString()
            },
            formattedDate: new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            formattedTime: new Date().toLocaleTimeString('en-IN')
        };
        
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
        
        showNotification('Processing your order...', 'info');
        
        // Generate invoice
        let invoiceData = null;
        try {
            invoiceData = await generateCompleteInvoice(orderData);
            console.log('Invoice generated successfully');
        } catch (invoiceError) {
            console.warn('Invoice generation issue:', invoiceError);
        }
        
        // Send notifications in parallel
        await Promise.allSettled([
            sendEmailNotifications(orderData, invoiceData),
            sendWhatsAppNotification(orderData, invoiceData),
            logToGoogleSheets(orderData)
        ]);
        
        // Log to localStorage
        logOrderToJSON(orderData, invoiceData);
        
        // Track in Analytics
        trackPurchaseEvent(orderData);
        
        // Display success screen (Step 4)
        displayOrderSuccess(orderData, invoiceData);
        goToPaymentStep(4);
        
        showNotification('Order confirmed & processed successfully!', 'success');
        
    } catch (error) {
        console.error('Error finalizing order:', error);
        showNotification(
            `Error finalizing order: ${error.message}. Please contact ${CONFIG.storePhone}`,
            'error'
        );
        
        const confirmBtn = document.querySelector('[onclick="finalizeOrder()"]');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<i class="fas fa-check"></i> Confirm & Process';
        }
    }
}

async function submitPayment(event) {
    event.preventDefault();
    
    if (paymentInProgress) {
        showNotification('Payment is already being processed. Please wait...', 'warning');
        return;
    }
    
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        paymentInProgress = true;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Order...';
        
        // Validate form inputs
        const validation = validatePaymentForm();
        if (!validation.valid) {
            showNotification(`Error: ${validation.message}`, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            paymentInProgress = false;
            return;
        }
        
        // Create order data
        const orderData = buildOrderData();
        
        // Verify payment (optional - you can add backend verification)
        const paymentVerified = await verifyPaymentTransaction(orderData);
        if (!paymentVerified) {
            console.warn('Payment verification inconclusive, but proceeding with order');
        }
        
        // Save order to local storage (backup)
        saveOrderLocally(orderData);
        
        // Display Confirmation Page (Step 3)
        displayOrderConfirmation();
        goToPaymentStep(3);
        
        // Reset form
        if (document.getElementById('utrForm')) {
            document.getElementById('utrForm').reset();
        }
        
    } catch (error) {
        console.error('Payment processing error:', error);
        showNotification(
            `Error processing payment: ${error.message}. Please contact ${CONFIG.storePhone}`,
            'error'
        );
    } finally {
        paymentInProgress = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

/**
 * Validate Payment Form
 */
function validatePaymentForm() {
    const name = document.getElementById('customerName')?.value?.trim();
    const email = document.getElementById('customerEmail')?.value?.trim();
    const phone = document.getElementById('customerPhone')?.value?.trim();
    const address = document.getElementById('customerAddress')?.value?.trim();
    const utr = document.getElementById('utrNumber')?.value?.trim();
    
    if (!name || name.length < 3) {
        return { valid: false, message: 'Please enter a valid name (minimum 3 characters)' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return { valid: false, message: 'Please enter a valid 10-digit phone number' };
    }
    
    if (!address || address.length < 10) {
        return { valid: false, message: 'Please enter a complete delivery address (minimum 10 characters)' };
    }
    
    if (!utr || utr.trim().length < 2) {
        return { valid: false, message: 'Please enter a valid UPI Transaction ID' };
    }
    
    return { valid: true };
}

/**
 * Build Complete Order Data
 */
function buildOrderData() {
    return {
        orderId: currentOrderId,
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        formattedTime: new Date().toLocaleTimeString('en-IN'),
        product: {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            originalPrice: currentProduct.originalPrice,
            discount: currentProduct.originalPrice - currentProduct.price,
            discountPercentage: Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100),
            category: currentProduct.category,
            image: currentProduct.image
        },
        customer: {
            name: document.getElementById('customerName').value.trim(),
            email: document.getElementById('customerEmail').value.trim(),
            phone: '91' + document.getElementById('customerPhone').value.trim(),
            address: document.getElementById('customerAddress').value.trim()
        },
        payment: {
            method: 'UPI',
            upiId: CONFIG.upiId,
            utr: document.getElementById('utrNumber').value.trim(),
            amount: currentProduct.price,
            status: 'PENDING_VERIFICATION',
            timestamp: new Date().toISOString()
        },
        store: {
            name: CONFIG.company.name,
            phone: CONFIG.storePhone,
            email: CONFIG.storeEmail,
            address: CONFIG.storeAddress,
            website: CONFIG.company.website
        }
    };
}

/**
 * Verify Payment Transaction (Optional Backend Integration)
 */
async function verifyPaymentTransaction(orderData) {
    try {
        // This is where you would call your backend API to verify the payment
        // For now, we'll just log it
        console.log('Payment verification called for UTR:', orderData.payment.utr);
        
        // Simulate verification (you can replace with actual API call)
        // const response = await fetch('/api/verify-payment', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ utr: orderData.payment.utr, amount: orderData.payment.amount })
        // });
        // const result = await response.json();
        // return result.verified;
        
        return true; // Optimistic: assume verified
    } catch (error) {
        console.error('Payment verification error:', error);
        return false;
    }
}

/**
 * Save Order to Local Storage (Backup for offline)
 */
function saveOrderLocally(orderData) {
    try {
        let orders = JSON.parse(localStorage.getItem('akkuOrders')) || [];
        orders.push(orderData);
        
        // Keep only last 50 orders
        if (orders.length > 50) {
            orders = orders.slice(-50);
        }
        
        localStorage.setItem('akkuOrders', JSON.stringify(orders));
        localStorage.setItem(`order_${orderData.orderId}`, JSON.stringify(orderData));
        console.log('Order saved to local storage');
    } catch (error) {
        console.warn('Could not save order to local storage:', error);
    }
}

/**
 * Generate Order ID with timestamp
 */
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `AE${timestamp}${random}`;
}


// ============================================================================
// INVOICE GENERATION
// ============================================================================

/**
 * Generate Complete Invoice PDF
 */
async function generateCompleteInvoice(orderData) {
    try {
        if (typeof easyinvoice === 'undefined') {
            console.warn('easyinvoice library not loaded');
            return null;
        }
        
        const invoiceData = {
            images: {
                logo: CONFIG.storeLogo
            },
            sender: {
                company: CONFIG.company.name,
                address: CONFIG.storeAddress.split(',')[0],
                zip: '440008',
                city: 'Nagpur',
                country: 'India',
                custom1: `Phone: ${CONFIG.storePhone}`,
                custom2: `Email: ${CONFIG.storeEmail}`
            },
            client: {
                company: orderData.customer.name,
                address: orderData.customer.address,
                custom1: `Phone: +${orderData.customer.phone}`,
                custom2: `Email: ${orderData.customer.email}`
            },
            information: {
                number: orderData.orderId,
                date: orderData.formattedDate,
                'due-date': 'Paid via UPI',
                custom1: `Transaction ID: ${orderData.payment.utr}`
            },
            products: [
                {
                    quantity: 1,
                    description: orderData.product.name,
                    price: orderData.product.price
                }
            ],
            'bottom-notice': `Thank you for your order! Payment verified on UPI. For queries, contact ${CONFIG.storeEmail}`,
            settings: {
                currency: 'INR',
                'margin-top': 50,
                'margin-bottom': 50
            },
            translate: {
                'due-date': 'Due Date',
                'invoice-number': 'Invoice #',
                'products': 'Products',
                'quantity': 'Qty',
                'price': 'Price',
                'total': 'Total'
            }
        };
        
        // Create invoice
        const result = await easyinvoice.createInvoice(invoiceData);
        
        // Auto-download for user
        easyinvoice.download(`AkkuElectronics_Invoice_${orderData.orderId}.pdf`, result.pdf);
        
        return result;
    } catch (error) {
        console.error('Invoice generation error:', error);
        return null;
    }
}

/**
 * Display Success with Download Options
 */
// ============================================================================
// ORDER SUCCESS (Final)
// ============================================================================

function displayOrderSuccess(orderData, invoiceData) {
    try {
        const successContent = document.getElementById('successContent');
        const successActions = document.getElementById('successActions');
        
        if (!successContent || !successActions) return;
        
        // Cache last successful order for manual WhatsApp fallback button
        lastSuccessfulOrderData = orderData;
        lastSuccessfulInvoiceData = invoiceData || null;

        // Success animation and message
        const successHTML = `
            <div style="text-align: center;">
                <div class="success-animation">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: #d4af37; margin: 0 0 8px 0;">✓ Order Confirmed!</h2>
                <p style="color: #cccccc; font-size: 12px; margin: 0 0 6px 0;">Your order has been submitted successfully</p>
                <p style="color: #999; font-size: 11px; margin: 0 0 12px 0;">Invoice PDF sent to <strong style="color: #d4af37;">${orderData.customer.email}</strong></p>
                <p style="color: #f39c12; font-size: 11px; margin: 0 0 12px 0;"><i class="fab fa-whatsapp"></i> Popup blocked? Tap "Send Invoice Copy to WhatsApp" below.</p>
                
                <div class="order-id-card">
                    <p class="order-id-label">Order ID</p>
                    <p class="order-id-display">${orderData.orderId}</p>
                </div>
                
                <p style="color: #f39c12; font-size: 11px; margin: 10px 0;"><i class="fas fa-clock"></i> We'll verify your payment and contact you within 24 hours</p>
            </div>
        `;
        
        successContent.innerHTML = successHTML;
        
        // Add download buttons
        const buttonsHTML = `
            <button class="btn download-btn" onclick="sendInvoiceCopyToWhatsApp()">
                <i class="fab fa-whatsapp"></i> Send Invoice Copy to WhatsApp
            </button>
            ${invoiceData ? `
            <button class="btn download-btn" onclick="easyinvoice.download('AkkuElectronics_Invoice_${orderData.orderId}.pdf', ${JSON.stringify(invoiceData.pdf).replace(/"/g, '&quot;')}); showNotification('Invoice downloaded!', 'success');">
                <i class="fas fa-file-pdf"></i> Download Invoice (PDF)
            </button>
            <button class="btn download-btn" onclick="downloadReceiptAsJSON(${JSON.stringify(orderData).replace(/"/g, '&quot;')})">
                <i class="fas fa-receipt"></i> Download Receipt (JSON)
            </button>
            <button class="btn download-btn" onclick="exportOrderLogAsJSON()">
                <i class="fas fa-download"></i> Export Order Log
            </button>
            ` : ''}
            <button class="btn done-btn" onclick="closePaymentModal()">
                <i class="fas fa-home"></i> Continue Shopping
            </button>
        `;
        
        successActions.innerHTML = buttonsHTML;
        
        // Log to localStorage
        logOrderToJSON(orderData, invoiceData);
        
    } catch (error) {
        console.error('Error displaying success:', error);
    }
}

/**
 * Display Detailed Receipt Information
 */
function displayDetailedReceipt(orderData) {
    try {
        const successStep = document.getElementById('paymentStep3');
        if (!successStep) return;
        
        let receiptDiv = document.getElementById('detailedReceiptDiv');
        if (receiptDiv) {
            receiptDiv.remove();
        }
        
        receiptDiv = document.createElement('div');
        receiptDiv.id = 'detailedReceiptDiv';
        receiptDiv.style.cssText = `
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(244, 208, 63, 0.05) 100%);
            border: 2px solid #d4af37;
            border-radius: 12px;
            padding: 16px;
            margin: 12px 0;
            font-size: 13px;
            color: #cccccc;
            max-height: 300px;
            overflow-y: auto;
        `;
        
        receiptDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #d4af37;">
                <h3 style="margin: 0; color: #d4af37;">📦 ORDER RECEIPT</h3>
                <p style="margin: 4px 0; font-size: 11px; color: #999;">Order ID: <strong>${orderData.orderId}</strong></p>
            </div>
            
            <div style="margin-bottom: 10px;">
                <p style="margin: 6px 0;"><strong style="color: #d4af37;">📦 Product:</strong> ${orderData.product.name}</p>
                <p style="margin: 6px 0;"><strong style="color: #d4af37;">🏷️ Category:</strong> ${orderData.product.category}</p>
                ${orderData.product.discount > 0 ? `
                    <p style="margin: 6px 0;"><strong style="color: #27ae60;">💰 Discount:</strong> ${orderData.product.discountPercentage}% OFF (₹${orderData.product.discount.toLocaleString('en-IN')})</p>
                ` : ''}
                <p style="margin: 6px 0; border-top: 1px solid #666; padding-top: 6px;"><strong style="color: #f4d03f; font-size: 14px;">💵 Final Amount: ₹${orderData.product.price.toLocaleString('en-IN')}</strong></p>
            </div>
            
            <div style="margin-bottom: 10px;">
                <p style="margin: 6px 0;"><strong style="color: #d4af37;">👤 Customer:</strong> ${orderData.customer.name}</p>
                <p style="margin: 6px 0;"><strong style="color: #d4af37;">📱 Phone:</strong> ${orderData.customer.phone.replace('91', '+91 ')}</p>
                <p style="margin: 6px 0;"><strong style="color: #d4af37;">📧 Email:</strong> ${orderData.customer.email}</p>
                <p style="margin: 6px 0;"><strong style="color: #d4af37;">🏠 Address:</strong> ${orderData.customer.address}</p>
            </div>
            
            <div style="margin-bottom: 10px;">
                <p style="margin: 6px 0;"><strong style="color: #d4af37;">💳 Payment Method:</strong> UPI</p>
                <p style="margin: 6px 0;"><strong style="color: #d4af37;">🔐 UTR:</strong> ${orderData.payment.utr}</p>
                <p style="margin: 6px 0;"><strong style="color: #d4af37;">⏰ Date & Time:</strong> ${orderData.formattedDate} ${orderData.formattedTime}</p>
            </div>
        `;
        
        const doneBtn = successStep.querySelector('.done-btn');
        if (doneBtn) {
            successStep.insertBefore(receiptDiv, doneBtn);
        }
    } catch (error) {
        console.error('Error displaying receipt:', error);
    }
}

/**
 * Display Order Status Timeline
 */
function displayOrderStatusTimeline(orderData) {
    try {
        const successStep = document.getElementById('paymentStep3');
        if (!successStep) return;
        
        let timelineDiv = document.getElementById('orderTimelineDiv');
        if (timelineDiv) {
            timelineDiv.remove();
        }
        
        const now = new Date();
        const orderDate = new Date(orderData.timestamp);
        
        timelineDiv = document.createElement('div');
        timelineDiv.id = 'orderTimelineDiv';
        timelineDiv.style.cssText = `
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #d4af37;
            border-radius: 12px;
            padding: 16px;
            margin: 12px 0;
        `;
        
        timelineDiv.innerHTML = `
            <h3 style="margin: 0 0 12px 0; color: #d4af37; text-align: center; font-size: 14px;">📍 ORDER STATUS TIMELINE</h3>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; gap: 10px; align-items: start;">
                    <div style="width: 24px; height: 24px; background: #27ae60; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                        <i class="fas fa-check" style="color: white; font-size: 12px;"></i>
                    </div>
                    <div>
                        <p style="margin: 0; color: #27ae60; font-weight: 600; font-size: 12px;">PAYMENT RECEIVED</p>
                        <p style="margin: 4px 0 0 0; color: #999; font-size: 11px;">${orderDate.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; align-items: start;">
                    <div style="width: 24px; height: 24px; background: #f39c12; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                        <i class="fas fa-clock" style="color: white; font-size: 12px;"></i>
                    </div>
                    <div>
                        <p style="margin: 0; color: #f39c12; font-weight: 600; font-size: 12px;">VERIFICATION IN PROGRESS</p>
                        <p style="margin: 4px 0 0 0; color: #999; font-size: 11px;">Will complete within 24 hours</p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; align-items: start;">
                    <div style="width: 24px; height: 24px; background: #666; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                        <i class="fas fa-box" style="color: white; font-size: 12px;"></i>
                    </div>
                    <div>
                        <p style="margin: 0; color: #999; font-weight: 600; font-size: 12px;">PROCESSING & DELIVERY</p>
                        <p style="margin: 4px 0 0 0; color: #666; font-size: 11px;">Pending verification completion</p>
                    </div>
                </div>
            </div>
        `;
        
        const doneBtn = successStep.querySelector('.done-btn');
        if (doneBtn) {
            successStep.insertBefore(timelineDiv, doneBtn);
        }
    } catch (error) {
        console.error('Error displaying timeline:', error);
    }
}

/**
 * Log Order to JSON in LocalStorage
 */
function logOrderToJSON(orderData, invoiceData) {
    try {
        let orderLog = JSON.parse(localStorage.getItem('akkuOrderLog')) || {
            storeInfo: {
                name: CONFIG.company.name,
                email: CONFIG.storeEmail,
                phone: CONFIG.storePhone,
                website: CONFIG.company.website,
                exportedAt: new Date().toISOString()
            },
            orders: []
        };
        
        // Add current order with invoice data
        const logEntry = {
            ...orderData,
            invoiceGenerated: !!invoiceData,
            loggedAt: new Date().toISOString()
        };
        
        orderLog.orders.push(logEntry);
        localStorage.setItem('akkuOrderLog', JSON.stringify(orderLog));
        
        console.log('Order logged to JSON storage:', orderData.orderId);
    } catch (error) {
        console.error('Error logging order to JSON:', error);
    }
}

/**
 * Download Receipt as JSON
 */
function downloadReceiptAsJSON(orderData) {
    try {
        const receiptData = {
            receipt: {
                type: 'ORDER_RECEIPT',
                version: '2.0',
                generatedAt: new Date().toISOString(),
                
                orderInfo: {
                    orderId: orderData.orderId,
                    orderDate: orderData.formattedDate,
                    orderTime: orderData.formattedTime,
                    timestamp: orderData.timestamp
                },
                
                productInfo: {
                    name: orderData.product.name,
                    category: orderData.product.category,
                    id: orderData.product.id,
                    originalPrice: orderData.product.originalPrice,
                    discount: orderData.product.discount,
                    discountPercentage: orderData.product.discountPercentage,
                    finalPrice: orderData.product.price,
                    currency: 'INR'
                },
                
                customerInfo: {
                    name: orderData.customer.name,
                    email: orderData.customer.email,
                    phone: orderData.customer.phone,
                    address: orderData.customer.address
                },
                
                paymentInfo: {
                    method: orderData.payment.method,
                    upiId: orderData.payment.upiId,
                    transactionId: orderData.payment.utr,
                    amount: orderData.payment.amount,
                    status: orderData.payment.status,
                    timestamp: orderData.payment.timestamp
                },
                
                storeInfo: {
                    name: orderData.store.name,
                    email: orderData.store.email,
                    phone: orderData.store.phone,
                    address: orderData.store.address,
                    website: orderData.store.website
                },
                
                message: 'Thank you for your order! Your payment has been received and is being verified. You will receive an email confirmation shortly.'
            }
        };
        
        const dataStr = JSON.stringify(receiptData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt_${orderData.orderId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('Receipt downloaded as JSON!', 'success');
    } catch (error) {
        console.error('Error downloading receipt:', error);
        showNotification('Error downloading receipt', 'error');
    }
}

/**
 * Export Complete Order Log as JSON
 */
function exportOrderLogAsJSON() {
    try {
        const orderLog = JSON.parse(localStorage.getItem('akkuOrderLog'));
        if (!orderLog || !orderLog.orders || orderLog.orders.length === 0) {
            showNotification('No orders to export', 'info');
            return;
        }
        
        // Add summary statistics
        const exportData = {
            exportInfo: {
                exportedAt: new Date().toISOString(),
                totalOrders: orderLog.orders.length,
                dateRange: {
                    firstOrder: orderLog.orders[0]?.formattedDate,
                    lastOrder: orderLog.orders[orderLog.orders.length - 1]?.formattedDate
                },
                totalRevenue: orderLog.orders.reduce((sum, order) => sum + (order.product.price || 0), 0),
                totalDiscount: orderLog.orders.reduce((sum, order) => sum + (order.product.discount || 0), 0)
            },
            storeInfo: orderLog.storeInfo,
            orders: orderLog.orders
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AkkuElectronics_OrderLog_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification(`Order log exported! (${exportData.exportInfo.totalOrders} orders)`, 'success');
    } catch (error) {
        console.error('Error exporting order log:', error);
        showNotification('Error exporting order log', 'error');
    }
}

// ============================================================================
// NOTIFICATIONS (EMAIL & WHATSAPP)
// ============================================================================

/**
 * Send Email Notifications to Customer and Store
 */
async function sendEmailNotifications(orderData, invoiceData) {
    try {
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS not loaded, skipping email');
            return;
        }
        
        const emailTemplates = {
            customer: {
                to_email: orderData.customer.email,
                to_name: orderData.customer.name,
                subject: `Order Confirmation - ${orderData.orderId}`,
                order_id: orderData.orderId,
                product_name: orderData.product.name,
                amount: `₹${orderData.product.price.toLocaleString('en-IN')}`,
                customer_name: orderData.customer.name,
                utr: orderData.payment.utr,
                timestamp: orderData.formattedDate,
                store_email: CONFIG.storeEmail,
                store_phone: CONFIG.storePhone,
                message: buildCustomerEmailMessage(orderData)
            },
            store: {
                to_email: CONFIG.storeEmail,
                to_name: CONFIG.company.name,
                subject: `New Order Received - ${orderData.orderId}`,
                order_id: orderData.orderId,
                customer_name: orderData.customer.name,
                customer_email: orderData.customer.email,
                customer_phone: `+${orderData.customer.phone}`,
                customer_address: orderData.customer.address,
                product_name: orderData.product.name,
                amount: `₹${orderData.product.price.toLocaleString('en-IN')}`,
                utr: orderData.payment.utr,
                timestamp: orderData.formattedDate,
                message: buildStoreEmailMessage(orderData),
                invoice_data: invoiceData ? JSON.stringify(invoiceData) : null
            }
        };
        
        // Send customer email
        await emailjs.send(
            CONFIG.emailjs.serviceId,
            CONFIG.emailjs.templateId,
            emailTemplates.customer
        );
        console.log('Customer email sent');
        
        // Send store email
        await emailjs.send(
            CONFIG.emailjs.serviceId,
            CONFIG.emailjs.templateId,
            emailTemplates.store
        );
        console.log('Store email sent');
        
    } catch (error) {
        console.error('Email notification error:', error);
        // Don't throw - continue with other notifications
    }
}

/**
 * Send WhatsApp Notification with Order Details
 */
function sendWhatsAppNotification(orderData, invoiceData) {
    try {
        const message = formatWhatsAppMessage(orderData, invoiceData);
        const phoneNumber = (CONFIG.upiMobile || CONFIG.storePhone || '').replace(/\D/g, '');

        if (!phoneNumber) {
            console.warn('Store WhatsApp number not configured, skipping WhatsApp notification');
            return;
        }

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        const whatsappWindow = window.open(whatsappUrl, '_blank');
        if (!whatsappWindow) {
            showNotification('Please allow popups to send invoice copy on WhatsApp.', 'warning');
        }

        console.log('WhatsApp notification opened');
    } catch (error) {
        console.error('WhatsApp notification error:', error);
    }
}

/**
 * Manual fallback: Send latest invoice copy to WhatsApp from success screen
 */
function sendInvoiceCopyToWhatsApp() {
    if (!lastSuccessfulOrderData) {
        showNotification('No completed order found for WhatsApp sharing.', 'warning');
        return;
    }

    sendWhatsAppNotification(lastSuccessfulOrderData, lastSuccessfulInvoiceData);
}

/**
 * Format WhatsApp Message with Emojis
 */
function formatWhatsAppMessage(orderData, invoiceData) {
    return `
🧾 *Akku Electronics - Customer Invoice Copy* 🧾

━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *INVOICE DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━
🔹 Invoice No / Order ID: *${orderData.orderId}*
📅 Date: *${orderData.formattedDate}*
⏰ Time: *${orderData.formattedTime}*
📄 Invoice Status: *${invoiceData ? 'Generated' : 'Pending'}*

━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Name: *${orderData.customer.name}*
📱 Customer Phone: *+${orderData.customer.phone}*
✉️ Email: *${orderData.customer.email}*
🏠 Address: *${orderData.customer.address}*

━━━━━━━━━━━━━━━━━━━━━━━━━
🛒 *PRODUCT DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Product: *${orderData.product.name}*
🏷️ Category: *${orderData.product.category}*
${orderData.product.discount > 0 ? `
💰 Original Price: ₹${orderData.product.originalPrice.toLocaleString('en-IN')}
🎉 Discount: *${orderData.product.discountPercentage}% OFF (₹${orderData.product.discount.toLocaleString('en-IN')})*
` : ''}
💵 Final Price: *₹${orderData.product.price.toLocaleString('en-IN')}*

━━━━━━━━━━━━━━━━━━━━━━━━━
💳 *PAYMENT / TRANSACTION*
━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Payment Method: *UPI*
🏦 UPI ID: *${orderData.payment.upiId}*
📍 Transaction ID (UTR): *${orderData.payment.utr}*
✅ Status: *${orderData.payment.status || 'PENDING VERIFICATION'}*

━━━━━━━━━━━━━━━━━━━━━━━━━
📧 *NEXT STEPS*
━━━━━━━━━━━━━━━━━━━━━━━━━
✓ This invoice copy is shared from customer WhatsApp
✓ Original invoice PDF downloaded on customer device
✓ We will verify your payment within 24 hours
✓ Tracking updates will be sent via WhatsApp
✓ For any queries, contact us immediately

━━━━━━━━━━━━━━━━━━━━━━━━━
📞 *CONTACT US*
━━━━━━━━━━━━━━━━━━━━━━━━━
Phone: *${CONFIG.storePhone}*
Email: *${CONFIG.storeEmail}*
Website: *${CONFIG.company.website}*

Thank you for shopping with Akku Electronics! 🎉
    `.trim();
}

/**
 * Build Customer Email Message
 */
function buildCustomerEmailMessage(orderData) {
    return `
Dear ${orderData.customer.name},

Thank you for your order with Akku Electronics!

ORDER DETAILS:
Order ID: ${orderData.orderId}
Date: ${orderData.formattedDate}
Product: ${orderData.product.name}
Price: ₹${orderData.product.price.toLocaleString('en-IN')}
UPI Transaction ID: ${orderData.payment.utr}

We have received your payment via UPI. Our team will verify the transaction within 24 hours and send you an update.

Your invoice has been attached to this email. You can also download it from your account.

If you have any questions, please contact us:
Phone: ${CONFIG.storePhone}
Email: ${CONFIG.storeEmail}

Best regards,
Akku Electronics Team
    `.trim();
}

/**
 * Build Store Email Message
 */
function buildStoreEmailMessage(orderData) {
    return `
NEW ORDER RECEIVED!

Order ID: ${orderData.orderId}
Date: ${orderData.formattedDate}

CUSTOMER DETAILS:
Name: ${orderData.customer.name}
Phone: +${orderData.customer.phone}
Email: ${orderData.customer.email}
Address: ${orderData.customer.address}

ORDER DETAILS:
Product: ${orderData.product.name}
Category: ${orderData.product.category}
Price: ₹${orderData.product.price.toLocaleString('en-IN')}

PAYMENT:
Method: UPI
UPI ID: ${orderData.payment.upiId}
UTR: ${orderData.payment.utr}
Amount: ₹${orderData.payment.amount.toLocaleString('en-IN')}
Status: PENDING VERIFICATION

ACTION REQUIRED:
- Verify UPI transaction in your payment app
- Update order status once payment is confirmed
- Prepare order for shipment
    `.trim();
}


// ============================================================================
// LOGGING & ANALYTICS
// ============================================================================

/**
 * Log Order to Google Sheets
 */
async function logToGoogleSheets(orderData) {
    try {
        const params = new URLSearchParams({
            timestamp: orderData.timestamp,
            formattedDate: orderData.formattedDate,
            orderId: orderData.orderId,
            customerName: orderData.customer.name,
            customerEmail: orderData.customer.email,
            customerPhone: `+${orderData.customer.phone}`,
            customerAddress: orderData.customer.address,
            productId: orderData.product.id,
            productName: orderData.product.name,
            productCategory: orderData.product.category,
            originalPrice: orderData.product.originalPrice,
            finalPrice: orderData.product.price,
            discount: orderData.product.discount,
            discountPercentage: orderData.product.discountPercentage,
            paymentMethod: orderData.payment.method,
            paymentUPI: orderData.payment.upiId,
            utr: orderData.payment.utr,
            paymentStatus: orderData.payment.status,
            storeName: CONFIG.company.name,
            storeEmail: CONFIG.storeEmail,
            storePhone: CONFIG.storePhone
        });
        
        await fetch(CONFIG.googleSheets.url + '?' + params.toString(), {
            method: 'GET',
            mode: 'no-cors'
        });
        console.log('Order logged to Google Sheets successfully');
    } catch (error) {
        console.error('Google Sheets logging error:', error);
        // Don't block order for this
    }
}

/**
 * Track Purchase in Google Analytics
 */
function trackPurchaseEvent(orderData) {
    try {
        if (typeof gtag === 'undefined') {
            console.log('Google Analytics not loaded');
            return;
        }
        
        gtag('event', 'purchase', {
            currency: 'INR',
            transaction_id: orderData.orderId,
            value: orderData.product.price,
            coupon: orderData.product.discountPercentage > 0 ? `DISCOUNT_${orderData.product.discountPercentage}` : undefined,
            items: [{
                item_id: orderData.product.id,
                item_name: orderData.product.name,
                item_category: orderData.product.category,
                price: orderData.product.price,
                quantity: 1
            }]
        });
        
        console.log('Purchase event tracked in Google Analytics');
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Show Notification Toast
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds (except error)
    const duration = type === 'error' ? 8000 : 5000;
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

/**
 * Get Notification Icon
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * Format Currency
 */
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Format Phone Number
 */
function formatPhoneNumber(phone) {
    phone = phone.replace(/\D/g, '');
    if (phone.length === 10) {
        return `+91${phone}`;
    } else if (phone.length === 12 && phone.startsWith('91')) {
        return `+${phone}`;
    }
    return phone;
}

/**
 * Copy to Clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

/**
 * Fallback Copy Method
 */
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('Copied to clipboard!', 'success');
}

/**
 * Generate Receipt HTML
 */
function generateReceiptHTML(orderData) {
    return `
    <div class="receipt-container">
        <div class="receipt-header">
            <img src="${CONFIG.storeLogo}" alt="Logo" class="receipt-logo">
            <h1>${CONFIG.company.name}</h1>
            <p>${CONFIG.company.description}</p>
        </div>
        
        <div class="receipt-divider"></div>
        
        <div class="receipt-order-info">
            <div class="receipt-row">
                <span>Order ID:</span>
                <strong>${orderData.orderId}</strong>
            </div>
            <div class="receipt-row">
                <span>Date:</span>
                <strong>${orderData.formattedDate}</strong>
            </div>
            <div class="receipt-row">
                <span>Time:</span>
                <strong>${orderData.formattedTime}</strong>
            </div>
        </div>
        
        <div class="receipt-divider"></div>
        
        <div class="receipt-section">
            <h3>Customer Details</h3>
            <div class="receipt-row">
                <span>Name:</span>
                <strong>${orderData.customer.name}</strong>
            </div>
            <div class="receipt-row">
                <span>Phone:</span>
                <strong>+${orderData.customer.phone}</strong>
            </div>
            <div class="receipt-row">
                <span>Email:</span>
                <strong>${orderData.customer.email}</strong>
            </div>
            <div class="receipt-row">
                <span>Address:</span>
                <strong>${orderData.customer.address}</strong>
            </div>
        </div>
        
        <div class="receipt-divider"></div>
        
        <div class="receipt-section">
            <h3>Product Details</h3>
            <div class="receipt-row">
                <span>Product:</span>
                <strong>${orderData.product.name}</strong>
            </div>
            <div class="receipt-row">
                <span>Category:</span>
                <strong>${orderData.product.category}</strong>
            </div>
            ${orderData.product.discount > 0 ? `
            <div class="receipt-row">
                <span>Original Price:</span>
                <strong>${formatCurrency(orderData.product.originalPrice)}</strong>
            </div>
            <div class="receipt-row discount-row">
                <span>Discount (${orderData.product.discountPercentage}%):</span>
                <strong>-${formatCurrency(orderData.product.discount)}</strong>
            </div>
            ` : ''}
            <div class="receipt-row total-row">
                <span>Final Price:</span>
                <strong>${formatCurrency(orderData.product.price)}</strong>
            </div>
        </div>
        
        <div class="receipt-divider"></div>
        
        <div class="receipt-section">
            <h3>Payment Details</h3>
            <div class="receipt-row">
                <span>Method:</span>
                <strong>${orderData.payment.method}</strong>
            </div>
            <div class="receipt-row">
                <span>UPI ID:</span>
                <strong>${orderData.payment.upiId}</strong>
            </div>
            <div class="receipt-row">
                <span>Transaction ID:</span>
                <strong>${orderData.payment.utr}</strong>
            </div>
            <div class="receipt-row">
                <span>Status:</span>
                <strong><span class="status-pending">${orderData.payment.status}</span></strong>
            </div>
        </div>
        
        <div class="receipt-divider"></div>
        
        <div class="receipt-footer">
            <p><strong>Thank you for your order!</strong></p>
            <p>We will verify your payment within 24 hours and send you updates via WhatsApp.</p>
            <hr>
            <p>${CONFIG.storeAddress}</p>
            <p>Phone: ${CONFIG.storePhone}</p>
            <p>Email: ${CONFIG.storeEmail}</p>
            <p>Website: ${CONFIG.company.website}</p>
        </div>
    </div>
    `;
}

/**
 * Print Receipt
 */
function printReceipt(orderData) {
    const printWindow = window.open('', '', 'width=600,height=800');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt - ${orderData.orderId}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 600px; 
                    margin: 0 auto;
                    padding: 20px;
                }
                .receipt-header { text-align: center; margin-bottom: 20px; }
                .receipt-logo { max-width: 100px; margin-bottom: 10px; }
                .receipt-divider { border-top: 2px dashed #ccc; margin: 15px 0; }
                .receipt-row { display: flex; justify-content: space-between; margin: 8px 0; }
                .receipt-section h3 { margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                .total-row { font-weight: bold; font-size: 16px; }
                .receipt-footer { text-align: center; margin-top: 20px; font-size: 12px; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            ${generateReceiptHTML(orderData)}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

/**
 * Export Order to CSV
 */
function exportOrderToCSV(orderData) {
    const csvContent = `
Akku Electronics - Order Receipt
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Order ID: ${orderData.orderId}
Date: ${orderData.formattedDate}
Time: ${orderData.formattedTime}

CUSTOMER DETAILS
Name: ${orderData.customer.name}
Phone: +${orderData.customer.phone}
Email: ${orderData.customer.email}
Address: ${orderData.customer.address}

PRODUCT DETAILS
Product: ${orderData.product.name}
Category: ${orderData.product.category}
Original Price: ₹${orderData.product.originalPrice}
Discount: ${orderData.product.discountPercentage}%
Final Price: ₹${orderData.product.price}

PAYMENT DETAILS
Method: ${orderData.payment.method}
UPI ID: ${orderData.payment.upiId}
Transaction ID: ${orderData.payment.utr}
Amount: ₹${orderData.payment.amount}
Status: ${orderData.payment.status}

STORE DETAILS
Name: ${CONFIG.company.name}
Phone: ${CONFIG.storePhone}
Email: ${CONFIG.storeEmail}
Address: ${CONFIG.storeAddress}
    `;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `AkkuElectronics_Receipt_${orderData.orderId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Get Order History from Local Storage
 */
function getOrderHistory() {
    try {
        return JSON.parse(localStorage.getItem('akkuOrders')) || [];
    } catch (error) {
        console.error('Error retrieving order history:', error);
        return [];
    }
}

/**
 * Clear Old Orders (Keep last 100)
 */
function cleanupOrderHistory() {
    try {
        let orders = getOrderHistory();
        if (orders.length > 100) {
            orders = orders.slice(-100);
            localStorage.setItem('akkuOrders', JSON.stringify(orders));
            console.log('Order history cleaned up');
        }
    } catch (error) {
        console.error('Error cleaning up order history:', error);
    }
}

function removeLegacyTaxFieldsFromObject(value) {
    if (Array.isArray(value)) {
        return value.map(removeLegacyTaxFieldsFromObject);
    }

    if (!value || typeof value !== 'object') {
        return value;
    }

    const cleaned = {};
    for (const [key, data] of Object.entries(value)) {
        if (key === 'gstNo' || key === 'gstRate' || key === 'tax') {
            continue;
        }
        cleaned[key] = removeLegacyTaxFieldsFromObject(data);
    }
    return cleaned;
}

function migrateLegacyTaxFields() {
    try {
        const targets = ['akkuOrders', 'akkuOrderLog'];
        let scannedRecords = 0;
        let updatedRecords = 0;

        targets.forEach((storageKey) => {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return;

            scannedRecords += 1;
            const parsed = JSON.parse(raw);
            const cleaned = removeLegacyTaxFieldsFromObject(parsed);
            const cleanedRaw = JSON.stringify(cleaned);
            if (cleanedRaw !== raw) {
                updatedRecords += 1;
                localStorage.setItem(storageKey, cleanedRaw);
            }
        });

        for (let index = 0; index < localStorage.length; index += 1) {
            const storageKey = localStorage.key(index);
            if (!storageKey || !storageKey.startsWith('order_')) {
                continue;
            }

            const raw = localStorage.getItem(storageKey);
            if (!raw) continue;

            scannedRecords += 1;
            const parsed = JSON.parse(raw);
            const cleaned = removeLegacyTaxFieldsFromObject(parsed);
            const cleanedRaw = JSON.stringify(cleaned);
            if (cleanedRaw !== raw) {
                updatedRecords += 1;
                localStorage.setItem(storageKey, cleanedRaw);
            }
        }

        console.info(`[Migration] Legacy GST/tax cleanup complete: ${updatedRecords}/${scannedRecords} records updated.`);
    } catch (error) {
        console.warn('Legacy GST/tax data migration skipped:', error);
    }
}

// Run cleanup on page load
document.addEventListener('DOMContentLoaded', cleanupOrderHistory);

// ============================================================================
// INITIALIZATION & DEBUGGING
// ============================================================================

/**
 * Initialize Payment System
 */
function initializePaymentSystem() {
    try {
        console.log('🚀 Initializing Akku Electronics Payment System v2.0');

        // Migrate older localStorage records to remove deprecated GST/tax fields
        migrateLegacyTaxFields();
        
        // Check required libraries
        checkRequiredLibraries();
        
        // Test localStorage
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            console.log('✓ Local Storage is available');
        } catch (e) {
            console.warn('⚠ Local Storage not available - orders may not be saved locally');
        }
        
        // Setup event listeners
        setupEventListeners();
        
        // Log system info
        console.log('Configuration loaded:', { CONFIG });
        console.log('✓ Payment system ready');
        
    } catch (error) {
        console.error('❌ Payment system initialization error:', error);
    }
}

/**
 * Check Required Libraries
 */
function checkRequiredLibraries() {
    const libraries = {
        'easyinvoice': typeof easyinvoice !== 'undefined',
        'emailjs': typeof emailjs !== 'undefined'
    };
    
    console.log('📦 Library Status:');
    for (const [lib, loaded] of Object.entries(libraries)) {
        console.log(`  ${loaded ? '✓' : '✗'} ${lib}`);
    }
    
    if (!libraries.easyinvoice) {
        console.warn('⚠ easyinvoice not loaded - invoice generation will fail');
    }
    if (!libraries.emailjs) {
        console.warn('⚠ emailjs not loaded - email notifications will fail');
    }
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Payment form submission
    const utrForm = document.getElementById('utrForm');
    if (utrForm) {
        utrForm.addEventListener('submit', submitPayment);
    }
    
    // Modal close button
    const closeBtn = document.querySelector('.payment-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('paymentModal');
            if (modal && modal.style.display === 'block') {
                closePaymentModal();
            }
        }
    });
}

/**
 * Debug Functions (Use only if needed)
 */
const DEBUG = {
    /**
     * Create Sample Order for Testing
     */
    createSampleOrder: function() {
        const sampleOrder = {
            orderId: generateOrderId(),
            timestamp: new Date().toISOString(),
            formattedDate: new Date().toLocaleDateString('en-IN'),
            formattedTime: new Date().toLocaleTimeString('en-IN'),
            product: {
                id: 1,
                name: 'Test Product',
                price: 1000,
                originalPrice: 1500,
                discount: 500,
                discountPercentage: 33,
                category: 'test',
                image: CONFIG.storeLogo
            },
            customer: {
                name: 'Test Customer',
                email: 'test@example.com',
                phone: '919876543210',
                address: 'Test Address, Test City'
            },
            payment: {
                method: 'UPI',
                upiId: CONFIG.upiId,
                utr: 'TEST123456789',
                amount: 1000,
                status: 'PENDING_VERIFICATION',
                timestamp: new Date().toISOString()
            },
            store: {
                name: CONFIG.company.name,
                phone: CONFIG.storePhone,
                email: CONFIG.storeEmail,
                address: CONFIG.storeAddress,
                website: CONFIG.company.website
            }
        };
        return sampleOrder;
    },
    
    /**
     * Log Sample Order
     */
    logSampleOrder: function() {
        const sample = this.createSampleOrder();
        console.log('Sample Order:', sample);
        logToGoogleSheets(sample);
    },
    
    /**
     * Show System Status
     */
    showStatus: function() {
        console.table({
            'Payment System': 'Active',
            'UPI ID': CONFIG.upiId,
            'Store Phone': CONFIG.storePhone,
            'Store Email': CONFIG.storeEmail,
            'Google Sheets': CONFIG.googleSheets.url ? 'Connected' : 'Not Set',
            'EmailJS': typeof emailjs !== 'undefined' ? 'Loaded' : 'Not Loaded',
            'Local Storage': (() => {
                try {
                    localStorage.setItem('test', 'test');
                    localStorage.removeItem('test');
                    return 'Available';
                } catch {
                    return 'Not Available';
                }
            })(),
            'Current Orders': getOrderHistory().length
        });
    },
    
    /**
     * Show Order History
     */
    showOrderHistory: function() {
        const orders = getOrderHistory();
        console.log(`📦 Orders in Local Storage (${orders.length}):`, orders);
    },
    
    /**
     * Clear All Orders
     */
    clearAllOrders: function() {
        if (confirm('⚠️ This will clear all saved orders. Continue?')) {
            localStorage.removeItem('akkuOrders');
            console.log('✓ All orders cleared');
        }
    },
    
    /**
     * Test WhatsApp Message
     */
    testWhatsApp: function() {
        const sample = this.createSampleOrder();
        const message = formatWhatsAppMessage(sample);
        console.log('WhatsApp Message Preview:', message);
    },
    
    /**
     * Test Email Message
     */
    testEmail: function() {
        const sample = this.createSampleOrder();
        const customerMsg = buildCustomerEmailMessage(sample);
        const storeMsg = buildStoreEmailMessage(sample);
        console.log('Customer Email:', customerMsg);
        console.log('Store Email:', storeMsg);
    },
    
    /**
     * Print Receipt Preview
     */
    printReceiptPreview: function() {
        const sample = this.createSampleOrder();
        console.log('Receipt HTML:', generateReceiptHTML(sample));
    }
};

/**
 * Log to Console on Page Load
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePaymentSystem);
} else {
    initializePaymentSystem();
}

console.log('%c🎮 Akku Electronics Payment System v2.0 Loaded', 'color: #d4af37; font-size: 16px; font-weight: bold;');
console.log('%cUse DEBUG.showStatus() to check system status', 'color: #666; font-size: 12px;');
console.log('%cAvailable DEBUG functions: createSampleOrder, logSampleOrder, showStatus, showOrderHistory, clearAllOrders, testWhatsApp, testEmail, printReceiptPreview', 'color: #999; font-size: 11px;');

// ============================================================================
// EXPORT FUNCTIONS FOR EXTERNAL USE
// ============================================================================

window.AkkuPayment = {
    init: initializePaymentSystem,
    openModal: openPaymentModal,
    closeModal: closePaymentModal,
    submitPayment: submitPayment,
    generateOrderId: generateOrderId,
    getOrderHistory: getOrderHistory,
    formatCurrency: formatCurrency,
    showNotification: showNotification,
    DEBUG: DEBUG
};

// ============================================================================
// FILE END
// ============================================================================

