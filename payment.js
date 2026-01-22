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
    const amount = currentProduct.price.toFixed(2);
    const note = encodeURIComponent('Payment for ' + currentProduct.name);
    let url = '';
    
    switch(app) {
        case 'phonepe':
            url = `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${note}&tr=${currentOrderId}`;
            break;
        case 'gpay':
            url = `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${note}&tr=${currentOrderId}`;
            break;
        case 'paytm':
            url = `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${note}&tr=${currentOrderId}`;
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
        // 1. Generate Invoice PDF
        const invoicePDF = await generateInvoice(orderData);
        
        // 2. Send Email with Invoice
        await sendEmailNotification(orderData, invoicePDF);
        
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
function generateInvoice(orderData) {
    return new Promise((resolve) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(212, 175, 55); // Gold color
        doc.text('AKKU ELECTRONICS', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('354, VHB Colony, Balabhau Peth, PanchPaoli, Nagpur, MH - 440008', 105, 28, { align: 'center' });
        doc.text('Phone: +91 8956389723 | Email: akkuelectronics.nagpur@gmail.com', 105, 34, { align: 'center' });
        
        // Line separator
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);
        
        // Invoice Title
        doc.setFontSize(16);
        doc.text('INVOICE', 105, 50, { align: 'center' });
        
        // Order Details
        doc.setFontSize(10);
        doc.text(`Order ID: ${orderData.orderId}`, 20, 60);
        doc.text(`Date: ${new Date(orderData.timestamp).toLocaleString('en-IN')}`, 20, 66);
        
        // Customer Details
        doc.setFontSize(12);
        doc.text('Bill To:', 20, 78);
        doc.setFontSize(10);
        doc.text(orderData.customer.name, 20, 84);
        doc.text(orderData.customer.email, 20, 90);
        doc.text(orderData.customer.phone, 20, 96);
        const addressLines = doc.splitTextToSize(orderData.customer.address, 80);
        doc.text(addressLines, 20, 102);
        
        // Product Details Table
        doc.setFontSize(12);
        doc.text('Product Details:', 20, 125);
        
        // Table headers
        doc.setFillColor(212, 175, 55);
        doc.rect(20, 130, 170, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Product', 22, 135);
        doc.text('Category', 110, 135);
        doc.text('Amount', 170, 135);
        
        // Product row
        doc.setTextColor(0, 0, 0);
        doc.text(orderData.product.name.substring(0, 40), 22, 145);
        doc.text(orderData.product.category, 110, 145);
        doc.text(`₹${orderData.product.price.toLocaleString('en-IN')}`, 170, 145);
        
        // Totals
        doc.line(20, 150, 190, 150);
        doc.setFontSize(11);
        
        if (orderData.product.originalPrice > orderData.product.price) {
            const discount = orderData.product.originalPrice - orderData.product.price;
            doc.text('Subtotal:', 130, 158);
            doc.text(`₹${orderData.product.originalPrice.toLocaleString('en-IN')}`, 170, 158);
            
            doc.setTextColor(0, 128, 0);
            doc.text('Discount:', 130, 164);
            doc.text(`-₹${discount.toLocaleString('en-IN')}`, 170, 164);
            doc.setTextColor(0, 0, 0);
        }
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Total Amount:', 130, 172);
        doc.text(`₹${orderData.product.price.toLocaleString('en-IN')}`, 170, 172);
        
        // Payment Details
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        doc.text('Payment Details:', 20, 185);
        doc.text(`Method: ${orderData.payment.method} (UPI)`, 20, 191);
        doc.text(`Transaction ID: ${orderData.payment.utr}`, 20, 197);
        doc.text(`Status: Pending Verification`, 20, 203);
        
        // Footer
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);
        doc.text('Thank you for your business!', 105, 250, { align: 'center' });
        doc.text('This is a computer-generated invoice. Payment verification is in progress.', 105, 256, { align: 'center' });
        doc.text('We will contact you within 24 hours.', 105, 262, { align: 'center' });
        
        // Save PDF to user's device
        doc.save(`AkkuElectronics_Invoice_${orderData.orderId}.pdf`);
        
        // Convert to base64
        const pdfBase64 = doc.output('datauristring').split(',')[1];
        resolve(pdfBase64);
    });
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
    const message = `🛒 *New Order Received!*%0A%0A` +
        `📦 Order ID: ${orderData.orderId}%0A` +
        `👤 Customer: ${orderData.customer.name}%0A` +
        `📱 Phone: ${orderData.customer.phone}%0A` +
        `📧 Email: ${orderData.customer.email}%0A` +
        `🏠 Address: ${orderData.customer.address}%0A%0A` +
        `🎮 Product: ${orderData.product.name}%0A` +
        `💰 Amount: ₹${orderData.product.price}%0A` +
        `🔢 UTR: ${orderData.payment.utr}%0A%0A` +
        `⏰ Time: ${new Date(orderData.timestamp).toLocaleString('en-IN')}%0A%0A` +
        `✅ Please verify the payment in your UPI app.`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${STORE_PHONE.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Log to Google Sheets
async function logToGoogleSheets(orderData) {
    const sheetData = {
        timestamp: new Date(orderData.timestamp).toLocaleString('en-IN'),
        orderId: orderData.orderId,
        customerName: orderData.customer.name,
        customerEmail: orderData.customer.email,
        customerPhone: orderData.customer.phone,
        customerAddress: orderData.customer.address,
        productName: orderData.product.name,
        productCategory: orderData.product.category,
        originalPrice: orderData.product.originalPrice,
        finalPrice: orderData.product.price,
        discount: orderData.product.originalPrice - orderData.product.price,
        paymentMethod: orderData.payment.method,
        utr: orderData.payment.utr,
        status: 'Pending Verification'
    };
    
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(sheetData)
        });
        console.log('Logged to Google Sheets');
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
