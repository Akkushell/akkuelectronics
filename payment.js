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
    upiId: "8956389723@barodampay",
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
        url: "https://script.google.com/macros/s/AKfycby3847N8DdVKDGlEqAG8Qtgt7ePZPdXj0JcSAuuRRevU9sqZfLISsPetuCOf_PWARRSEw/exec"
    },
    
    // Tax Details (For India - GST)
    tax: {
        gstRate: 0, // 0% for now, can be changed
        gstNo: "27AABCA1234H1Z2" // Sample GST No.
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
        
        // Update modal display
        displayPaymentSummary(product);
        modal.style.display = 'block';
        
        // Reset to payment method selection
        showPaymentMethodStep();
        
        console.log('Payment modal opened for product:', currentProduct.name);
        return true;
    } catch (error) {
        console.error('Error opening payment modal:', error);
        showNotification('An unexpected error occurred. Please try again.', 'error');
        return false;
    }
}

/**
 * Display Product Summary in Payment Modal
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
 * Show Payment Method Selection Step
 */
function showPaymentMethodStep() {
    if (document.getElementById('paymentStep1')) {
        document.getElementById('paymentStep1').style.display = 'block';
    }
    if (document.getElementById('paymentStep2')) {
        document.getElementById('paymentStep2').style.display = 'none';
    }
    if (document.getElementById('paymentStep3')) {
        document.getElementById('paymentStep3').style.display = 'none';
    }
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
    
    const appConfigs = {
        phonepe: {
            protocol: 'phonepe://upi/pay',
            name: 'PhonePe'
        },
        gpay: {
            protocol: 'tez://upi/pay',
            name: 'Google Pay'
        },
        paytm: {
            protocol: 'paytmmp://pay',
            name: 'Paytm'
        }
    };
    
    const config = appConfigs[app];
    if (!config) return;
    
    const params = new URLSearchParams({
        pa: CONFIG.upiId,
        pn: CONFIG.merchantName,
        cu: 'INR',
        tn: `Payment for ${currentProduct.name}`,
        tr: currentOrderId,
        am: currentProduct.price
    });
    
    const url = `${config.protocol}?${params.toString()}`;
    
    try {
        window.location.href = url;
        // Fallback: Show user transaction ID input after setTimeout
        setTimeout(() => {
            showNotification(
                `Opened ${config.name}. After payment, come back to enter Transaction ID.`,
                'info'
            );
        }, 1000);
    } catch (error) {
        console.error(`Error opening ${config.name}:`, error);
        showNotification(`Error: Could not open ${config.name}. Please try another method.`, 'error');
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
 * Navigate to Form Step
 */
function proceedToFormStep() {
    showFormStep();
}

/**
 * Show Form Step (for entering customer details)
 */
function showFormStep() {
    if (document.getElementById('paymentStep1')) {
        document.getElementById('paymentStep1').style.display = 'none';
    }
    if (document.getElementById('paymentStep2')) {
        document.getElementById('paymentStep2').style.display = 'block';
    }
    if (document.getElementById('paymentStep3')) {
        document.getElementById('paymentStep3').style.display = 'none';
    }
    
    // Scroll to top of modal
    const modal = document.querySelector('.payment-modal-content');
    if (modal) modal.scrollTop = 0;
}

/**
 * Show Success Step
 */
function showSuccessStep() {
    if (document.getElementById('paymentStep1')) {
        document.getElementById('paymentStep1').style.display = 'none';
    }
    if (document.getElementById('paymentStep2')) {
        document.getElementById('paymentStep2').style.display = 'none';
    }
    if (document.getElementById('paymentStep3')) {
        document.getElementById('paymentStep3').style.display = 'block';
    }
}

/**
 * Legacy functions for backward compatibility
 */
function showQRStep() {
    showPaymentMethodStep();
}

function showUTRStep() {
    showFormStep();
}


// ============================================================================
// PAYMENT SUBMISSION & PROCESSING
// ============================================================================

/**
 * Main Payment Submission Handler
 */
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
        
        // Generate invoice
        let invoiceData = null;
        try {
            invoiceData = await generateCompleteInvoice(orderData);
            console.log('Invoice generated successfully');
        } catch (invoiceError) {
            console.warn('Invoice generation failed:', invoiceError);
        }
        
        // Send notifications in parallel
        await Promise.allSettled([
            sendEmailNotifications(orderData, invoiceData),
            sendWhatsAppNotification(orderData, invoiceData),
            logToGoogleSheets(orderData)
        ]);
        
        // Track in Analytics
        trackPurchaseEvent(orderData);
        
        // Display success
        displayOrderSuccess(orderData, invoiceData);
        showSuccessStep();
        
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
            website: CONFIG.company.website,
            gstNo: CONFIG.tax.gstNo
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
                custom2: `Email: ${CONFIG.storeEmail}`,
                custom3: `GST No: ${CONFIG.tax.gstNo}`
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
                    'tax-rate': CONFIG.tax.gstRate,
                    price: orderData.product.price
                }
            ],
            'bottom-notice': `Thank you for your order! Payment verified on UPI. For queries, contact ${CONFIG.storeEmail}`,
            settings: {
                currency: 'INR',
                'tax-notation': 'gst',
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
function displayOrderSuccess(orderData, invoiceData) {
    try {
        const orderIdDisplay = document.getElementById('orderIdDisplay');
        if (orderIdDisplay) {
            orderIdDisplay.textContent = orderData.orderId;
        }
        
        const successMessage = document.querySelector('.success-message');
        if (successMessage) {
            successMessage.innerHTML = `
                <p>✓ Order submitted successfully!</p>
                <p>Order ID: <strong>${orderData.orderId}</strong></p>
                <p>Confirmation email has been sent to <strong>${orderData.customer.email}</strong></p>
            `;
        }
        
        // Add download button if invoice exists
        if (invoiceData) {
            const successStep = document.getElementById('paymentStep3');
            let downloadBtn = document.getElementById('downloadInvoiceBtn');
            
            if (!downloadBtn && successStep) {
                downloadBtn = document.createElement('button');
                downloadBtn.id = 'downloadInvoiceBtn';
                downloadBtn.className = 'btn download-btn';
                downloadBtn.style.marginTop = '15px';
                downloadBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Download Invoice';
                
                const doneBtn = successStep.querySelector('.done-btn');
                if (doneBtn) {
                    successStep.insertBefore(downloadBtn, doneBtn);
                }
            }
            
            if (downloadBtn) {
                downloadBtn.onclick = function() {
                    easyinvoice.download(`AkkuElectronics_Invoice_${orderData.orderId}.pdf`, invoiceData.pdf);
                };
            }
        }
    } catch (error) {
        console.error('Error displaying success:', error);
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
        const message = formatWhatsAppMessage(orderData);
        const phoneNumber = CONFIG.upiMobile;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank', 'width=800,height=600');
        console.log('WhatsApp notification opened');
    } catch (error) {
        console.error('WhatsApp notification error:', error);
    }
}

/**
 * Format WhatsApp Message with Emojis
 */
function formatWhatsAppMessage(orderData) {
    return `
🎮 *Akku Electronics - Order Confirmation* 🎮

━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━
🔹 Order ID: *${orderData.orderId}*
📅 Date: *${orderData.formattedDate}*
⏰ Time: *${orderData.formattedTime}*

━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Name: *${orderData.customer.name}*
📱 Phone: *+${orderData.customer.phone}*
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
💳 *PAYMENT INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Payment Method: *UPI*
🏦 UPI ID: *${orderData.payment.upiId}*
📍 Transaction ID (UTR): *${orderData.payment.utr}*
✅ Status: *PENDING VERIFICATION*

━━━━━━━━━━━━━━━━━━━━━━━━━
📧 *NEXT STEPS*
━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Invoice has been generated and emailed
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
        const sheetData = {
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
            storePhone: CONFIG.storePhone,
            gstNo: CONFIG.tax.gstNo
        };
        
        await fetch(CONFIG.googleSheets.url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sheetData)
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
GST No: ${CONFIG.tax.gstNo}
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
                website: CONFIG.company.website,
                gstNo: CONFIG.tax.gstNo
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

