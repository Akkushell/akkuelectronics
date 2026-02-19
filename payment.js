// Payment System for Akku Electronics
// UPI Payment with QR Code, Invoice Generation, Email & WhatsApp Notifications, Google Sheets Logging

// Configuration
const UPI_ID = "8956389723@barodampay";
const MERCHANT_NAME = "Akku Electronics";
const STORE_EMAIL = "akkuelectronics.nagpur@gmail.com";
const STORE_PHONE = "+918956389723";

// EmailJS Configuration - Replace with your credentials
const EMAILJS_SERVICE_ID = "service_n0k02w5"; // Get from emailjs.com
const EMAILJS_TEMPLATE_ID = "template_o0reqai";
const EMAILJS_PUBLIC_KEY = "H0DYylQzCYbPNlrq9";

// Google Sheets Configuration - Replace with your Web App URL
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycby3847N8DdVKDGlEqAG8Qtgt7ePZPdXj0JcSAuuRRevU9sqZfLISsPetuCOf_PWARRSEw/exec";

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

let currentProduct = null;
let currentOrderId = null;

// Open Payment Modal
function openPaymentModal(product) {
    console.log('Opening payment modal for product:', product);
    
    // Validate product data
    if (!product) {
        console.error('No product data provided');
        alert('Error: Product data is missing. Please try again.');
        return;
    }
    
    if (!product.price || product.price <= 0) {
        console.error('Invalid product price:', product.price);
        alert('Error: Invalid product price. Please try again.');
        return;
    }
    
    currentProduct = product;
    currentOrderId = generateOrderId(); // Generate Order ID immediately for UPI linking
    const modal = document.getElementById('paymentModal');
    
    if (!modal) {
        console.error('Payment modal element not found');
        alert('Error: Payment system not initialized. Please refresh the page.');
        return;
    }
    
    modal.style.display = 'block';
    
    // Reset to step 1
    showQRStep();
    
    // Display product summary
    displayProductSummary(product);
}

// Display Product Summary
function displayProductSummary(product) {
    const summaryDiv = document.getElementById('productSummary');
    
    summaryDiv.innerHTML = `
        <div class="summary-item">
            <img src="${product.image}" alt="${product.name}" class="summary-image">
            <div class="summary-details">
                <h4>${product.name}</h4>
            </div>
        </div>
    `;
    
    document.getElementById('paymentAmount').textContent = product.price.toLocaleString('en-IN');
}

// Open UPI Apps directly
function openUPIApp(app) {
    const note = encodeURIComponent('Payment for ' + currentProduct.name);
    let url = '';
    
    switch(app) {
        case 'phonepe':
            url = `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&cu=INR&tn=${note}&tr=${currentOrderId}`;
            break;
        case 'gpay':
            url = `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&cu=INR&tn=${note}&tr=${currentOrderId}`;
            break;
        case 'paytm':
            url = `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&cu=INR&tn=${note}&tr=${currentOrderId}`;
            break;
    }
    
    window.location.href = url;
}

// Navigation between steps
function showQRStep() {
    document.getElementById('paymentStep1').style.display = 'block';
    document.getElementById('paymentStep2').style.display = 'none';
    document.getElementById('paymentStep3').style.display = 'none';
}

function showUTRStep() {
    document.getElementById('paymentStep1').style.display = 'none';
    document.getElementById('paymentStep2').style.display = 'block';
    document.getElementById('paymentStep3').style.display = 'none';
}

function showSuccessStep() {
    document.getElementById('paymentStep1').style.display = 'none';
    document.getElementById('paymentStep2').style.display = 'none';
    document.getElementById('paymentStep3').style.display = 'block';
}

// Submit Payment
async function submitPayment(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Collect form data
    const orderData = {
        orderId: currentOrderId,
        timestamp: new Date().toISOString(),
        product: {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            originalPrice: currentProduct.originalPrice || currentProduct.price,
            image: currentProduct.image,
            category: currentProduct.category
        },
        customer: {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('customerAddress').value
        },
        payment: {
            utr: document.getElementById('utrNumber').value,
            method: 'UPI',
            amount: currentProduct.price
        }
    };
    
    try {
        let invoicePDF = null;
        try {
            // 1. Generate Invoice PDF & Send Email
            invoicePDF = await generateInvoice(orderData);
            await sendEmailNotification(orderData, invoicePDF);
        } catch (pdfError) {
            console.warn('Invoice generation or email failed, but proceeding with order:', pdfError);
        }
        
        // 3. Send WhatsApp Notification
        sendWhatsAppNotification(orderData);
        
        // 4. Log to Google Sheets
        await logToGoogleSheets(orderData);
        
        // Google Analytics: Track Purchase
        if (typeof gtag === 'function') {
            gtag('event', 'purchase', {
                transaction_id: orderData.orderId,
                value: orderData.product.price,
                currency: 'INR',
                items: [{
                    item_id: orderData.product.id,
                    item_name: orderData.product.name,
                    price: orderData.product.price,
                    quantity: 1
                }]
            });
        }
        
        // Show success
        document.getElementById('orderIdDisplay').textContent = orderData.orderId;
        
        // Add Download Invoice Button to Success Screen
        const successStep = document.getElementById('paymentStep3');
        let downloadBtn = document.getElementById('downloadInvoiceBtn');
        if (!downloadBtn) {
            downloadBtn = document.createElement('button');
            downloadBtn.id = 'downloadInvoiceBtn';
            downloadBtn.className = 'next-btn';
            downloadBtn.style.marginTop = '10px';
            downloadBtn.style.marginBottom = '10px';
            downloadBtn.style.background = 'transparent';
            downloadBtn.style.border = '1px solid #d4af37';
            downloadBtn.style.color = '#d4af37';
            downloadBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Download Invoice Again';
            
            const doneBtn = successStep.querySelector('.done-btn');
            successStep.insertBefore(downloadBtn, doneBtn);
        }
        
        if (invoicePDF) {
            downloadBtn.onclick = function() {
                easyinvoice.download(`AkkuElectronics_Invoice_${orderData.orderId}.pdf`, invoicePDF);
            };
        }

        showSuccessStep();
        
        // Reset form
        document.getElementById('utrForm').reset();
        
    } catch (error) {
        console.error('Payment submission error:', error);
        alert('There was an error processing your order. Please contact us directly at ' + STORE_PHONE);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Order';
    }
}

// Generate Order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `AE${timestamp}${random}`;
}

// Generate Invoice PDF
async function generateInvoice(orderData) {
    const data = {
        "images": {
            // Logo URL - ensure this is accessible
            "logo": "https://akkuelectronics.in/images/aelogo.png"
        },
        "sender": {
            "company": "Akku Electronics",
            "address": "354, VHB Colony, Balabhau Peth",
            "zip": "440008",
            "city": "Nagpur",
            "country": "India",
            "custom1": "Phone: +91 8956389723",
            "custom2": "Email: akkuelectronics.nagpur@gmail.com"
        },
        "client": {
            "company": orderData.customer.name,
            "address": orderData.customer.address,
            "zip": "", // Zip can be part of address if not collected separately
            "city": `Phone: ${orderData.customer.phone}`,
            "country": `Email: ${orderData.customer.email}`
        },
        "information": {
            "number": orderData.orderId,
            "date": new Date(orderData.timestamp).toLocaleDateString('en-IN'),
            "due-date": "Paid via UPI"
        },
        "products": [
            {
                "quantity": 1,
                "description": orderData.product.name,
                "tax-rate": 0,
                "price": orderData.product.price
            }
        ],
        "bottom-notice": "Payment verified via UPI Ref: " + orderData.payment.utr,
        "settings": {
            "currency": "INR",
            "tax-notation": "gst"
        }
    };

    // Create invoice
    const result = await easyinvoice.createInvoice(data);
    
    // Download PDF for the user
    easyinvoice.download(`AkkuElectronics_Invoice_${orderData.orderId}.pdf`, result.pdf);
    
    // Return base64 string for EmailJS attachment
    return result.pdf;
}

// Send Email Notification
async function sendEmailNotification(orderData, invoicePDF) {
    // Send to customer
    const customerEmailParams = {
        to_email: orderData.customer.email,
        to_name: orderData.customer.name,
        order_id: orderData.orderId,
        product_name: orderData.product.name,
        amount: orderData.product.price,
        utr: orderData.payment.utr,
        timestamp: new Date(orderData.timestamp).toLocaleString('en-IN'),
        invoice_pdf: invoicePDF
    };
    
    // Send to store owner
    const storeEmailParams = {
        to_email: STORE_EMAIL,
        to_name: "Akku Electronics",
        order_id: orderData.orderId,
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone,
        customer_address: orderData.customer.address,
        product_name: orderData.product.name,
        amount: orderData.product.price,
        utr: orderData.payment.utr,
        timestamp: new Date(orderData.timestamp).toLocaleString('en-IN'),
        invoice_pdf: invoicePDF
    };
    
    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, storeEmailParams);
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, customerEmailParams);
    } catch (error) {
        console.error('Email sending failed:', error);
        // Continue anyway - don't block the order
    }
}

// Send WhatsApp Notification
function sendWhatsAppNotification(orderData) {
    const message = `🧾 *ORDER INVOICE & CONFIRMATION* 🧾\n` +
        `--------------------------------\n` +
        `*Order ID:* ${orderData.orderId}\n` +
        `*Date:* ${new Date(orderData.timestamp).toLocaleString('en-IN')}\n` +
        `--------------------------------\n` +
        `👤 *CUSTOMER:*\n` +
        `Name: ${orderData.customer.name}\n` +
        `Phone: ${orderData.customer.phone}\n` +
        `Email: ${orderData.customer.email}\n` +
        `Address: ${orderData.customer.address}\n` +
        `--------------------------------\n` +
        `🛒 *ITEM:*\n` +
        `Item: ${orderData.product.name}\n` +
        `Category: ${orderData.product.category}\n` +
        `Price: ₹${orderData.product.price.toLocaleString('en-IN')}\n` +
        `--------------------------------\n` +
        `💰 *PAYMENT:*\n` +
        `Method: UPI\n` +
        `UTR/Ref: ${orderData.payment.utr}\n` +
        `Status: Pending Verification\n` +
        `--------------------------------\n` +
        `� *PDF Invoice has been downloaded to your device.*`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${STORE_PHONE.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Log to Google Sheets
async function logToGoogleSheets(orderData) {
    // Ensure safe values for calculations
    const originalPrice = orderData.product.originalPrice || orderData.product.price;
    const finalPrice = orderData.product.price;

    const sheetData = {
        timestamp: new Date().toLocaleString('en-IN'),
        orderId: orderData.orderId,
        customerName: orderData.customer.name,
        customerEmail: orderData.customer.email,
        customerPhone: orderData.customer.phone,
        customerAddress: orderData.customer.address,
        productName: orderData.product.name,
        productCategory: orderData.product.category,
        originalPrice: originalPrice,
        finalPrice: finalPrice,
        discount: originalPrice - finalPrice,
        paymentMethod: orderData.payment.method,
        utr: orderData.payment.utr,
        status: 'Pending Verification'
    };
    
    try {
        await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(sheetData)
        });
        console.log('Order logged to Google Sheets successfully');
    } catch (error) {
        console.error('Google Sheets logging failed:', error);
        // Continue anyway - don't block the order
    }
}

// Close Modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
    currentProduct = null;
    currentOrderId = null;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target == modal) {
        closePaymentModal();
    }
}

// Close button
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.payment-close');
    if (closeBtn) {
        closeBtn.onclick = closePaymentModal;
    }
});
