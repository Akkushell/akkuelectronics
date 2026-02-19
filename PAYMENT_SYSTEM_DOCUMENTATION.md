# Akku Electronics - Payment System Documentation
## v2.0 - Complete Implementation

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Configuration](#configuration)
4. [Functions](#functions)
5. [Usage Examples](#usage-examples)
6. [Debug Tools](#debug-tools)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This is a complete payment processing system for Akku Electronics built with HTML5, JavaScript, and integrations with:
- **UPI Payment Gateway** (PhonePe, Google Pay, Paytm)
- **Invoice Generation** (easyinvoice.js)
- **Email Notifications** (EmailJS)
- **WhatsApp Messaging**
- **Google Sheets Logging**
- **Local Storage Backup**

**Current Version:** 2.0  
**Last Updated:** February 19, 2026  
**Status:** ✅ Production Ready

---

## Features

### ✅ Payment Processing
- UPI payment integration with multiple apps
- Order ID generation
- Transaction verification
- Payment validation
- Order status tracking

### ✅ Invoice Generation
- Professional PDF invoices
- Product details with discounts
- GST calculation
- Customer information
- Payment reference

### ✅ Notifications
- **Email:** Customer & Store notifications
- **WhatsApp:** Rich formatted messages with emojis
- **SMS:** (Ready for integration)
- **Notifications:** Toast notifications for user feedback

### ✅ Data Management
- Google Sheets logging
- Local storage backup
- Order history tracking
- CSV export
- Receipt generation

### ✅ Analytics
- Google Analytics integration
- Purchase event tracking
- Conversion monitoring
- Customer analytics

### ✅ Additional Features
- Form validation
- Error handling
- Offline support
- Print receipts
- Download receipts
- Order history retrieval

---

## Configuration

### Basic Setup

```javascript
// All configuration is in CONFIG object at top of payment.js
const CONFIG = {
    upiId: "8956389723@barodampay",
    upiMobile: "918956389723",
    merchantName: "Akku Electronics",
    storeEmail: "akkuelectronics.nagpur@gmail.com",
    storePhone: "+918956389723",
    storeAddress: "354, VHB Colony, Balabhau Peth, PanchPaoli, Nagpur, MH 440008, India",
    // ... etc
};
```

### Required External Libraries

**HTML (Add to head):**
```html
<!-- Invoice Generation -->
<script src="https://unpkg.com/easyinvoice/dist/easyinvoice.min.js"></script>

<!-- Email Notifications -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<!-- Payment Script -->
<script src="payment.js"></script>
```

### Update Configuration

Edit the `CONFIG` object in `payment.js`:

```javascript
// Update UPI Details
CONFIG.upiId = "your-upi@bank";
CONFIG.upiMobile = "9876543210";

// Update Store Details
CONFIG.storeEmail = "your-email@example.com";
CONFIG.storePhone = "+91 YOUR NUMBER";
CONFIG.storeAddress = "Your Store Address";

// Update EmailJS Credentials
CONFIG.emailjs.serviceId = "service_XXXXX";
CONFIG.emailjs.templateId = "template_XXXXX";
CONFIG.emailjs.publicKey = "your-public-key";

// Update Google Sheets URL
CONFIG.googleSheets.url = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

// Update Tax Details
CONFIG.tax.gstRate = 18; // Set GST percentage
CONFIG.tax.gstNo = "27AABCA1234H1Z2"; // Your GST Number
```

---

## Functions

### Core Payment Functions

#### `openPaymentModal(product)`
Opens the payment modal for a product
```javascript
openPaymentModal({
    id: 1,
    name: "PlayStation 5 Console",
    price: 50000,
    originalPrice: 55000,
    category: "consoles",
    image: "images/ps5.png"
});
```

#### `closePaymentModal()`
Closes the payment modal
```javascript
closePaymentModal();
```

#### `submitPayment(event)`
Submits payment after form validation
```javascript
// Called automatically from form submission
// Validates inputs, generates invoice, sends emails, logs to sheets
```

#### `openUPIApp(app)`
Opens specified UPI app
```javascript
openUPIApp('phonepe');  // Open PhonePe
openUPIApp('gpay');     // Open Google Pay
openUPIApp('paytm');    // Open Paytm
```

---

### Invoice Functions

#### `generateCompleteInvoice(orderData)`
Generates and downloads PDF invoice
```javascript
const invoice = await generateCompleteInvoice(orderData);
```

#### `displayOrderSuccess(orderData, invoiceData)`
Shows success message with download button
```javascript
displayOrderSuccess(orderData, invoiceData);
```

#### `generateReceiptHTML(orderData)`
Generates HTML receipt
```javascript
const html = generateReceiptHTML(orderData);
```

#### `printReceipt(orderData)`
Prints receipt directly
```javascript
printReceipt(orderData);
```

#### `exportOrderToCSV(orderData)`
Exports order as CSV/TXT file
```javascript
exportOrderToCSV(orderData);
```

---

### Notification Functions

#### `sendEmailNotifications(orderData, invoiceData)`
Sends emails to customer and store
```javascript
await sendEmailNotifications(orderData, invoiceData);
```

#### `sendWhatsAppNotification(orderData, invoiceData)`
Opens WhatsApp with pre-filled message
```javascript
sendWhatsAppNotification(orderData, invoiceData);
```

#### `formatWhatsAppMessage(orderData)`
Formats WhatsApp message with emojis
```javascript
const message = formatWhatsAppMessage(orderData);
```

#### `showNotification(message, type)`
Shows toast notification
```javascript
showNotification('Order placed successfully!', 'success');
showNotification('Error occurred!', 'error');
showNotification('Please wait...', 'warning');
showNotification('This is an info message', 'info');
```

---

### Logging Functions

#### `logToGoogleSheets(orderData)`
Logs order to Google Sheets
```javascript
await logToGoogleSheets(orderData);
```

#### `trackPurchaseEvent(orderData)`
Tracks purchase in Google Analytics
```javascript
trackPurchaseEvent(orderData);
```

#### `saveOrderLocally(orderData)`
Saves order to local storage
```javascript
saveOrderLocally(orderData);
```

#### `getOrderHistory()`
Retrieves order history from local storage
```javascript
const orders = getOrderHistory();
console.log(orders);
```

---

### Utility Functions

#### `generateOrderId()`
Generates unique order ID
```javascript
const orderId = generateOrderId();
// Returns: AE[timestamp][random]
```

#### `formatCurrency(amount)`
Formats amount as Indian Rupees
```javascript
formatCurrency(1000); // Returns: ₹1,000
```

#### `copyToClipboard(text)`
Copies text to clipboard with notification
```javascript
copyToClipboard("8956389723@barodampay");
```

#### `validatePaymentForm()`
Validates all form inputs
```javascript
const validation = validatePaymentForm();
if (validation.valid) {
    // Process payment
} else {
    console.log(validation.message);
}
```

---

## Usage Examples

### Example 1: Basic Product Purchase

```javascript
// 1. Define product
const product = {
    id: 1,
    name: "PlayStation 5 Console",
    price: 50000,
    originalPrice: 55000,
    category: "consoles",
    image: "images/ps5.png"
};

// 2. Open payment modal
openPaymentModal(product);

// 3. User fills form and submits
// 4. System handles everything automatically
```

### Example 2: Custom Integration

```javascript
// Get product from shop
function buyProduct(productId, event) {
    event.stopPropagation();
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    // Open payment modal
    openPaymentModal({
        ...product,
        image: product.images ? product.images[0] : product.image
    });
}
```

### Example 3: Access Payment System

```javascript
// Use window.AkkuPayment global object
AkkuPayment.init();                      // Initialize system
AkkuPayment.openModal(product);          // Open payment modal
AkkuPayment.getOrderHistory();           // Get all orders
AkkuPayment.formatCurrency(1000);        // Format currency

// Debug functions
AkkuPayment.DEBUG.showStatus();          // Show system status
AkkuPayment.DEBUG.showOrderHistory();    // Show order history
AkkuPayment.DEBUG.testWhatsApp();        // Test WhatsApp format
```

---

## Debug Tools

The system includes comprehensive debugging tools in the `DEBUG` object.

### Access Debug Tools

Open browser console and use:
```javascript
// All commands use the DEBUG object
DEBUG.showStatus();              // Show full system status
DEBUG.showOrderHistory();        // List all saved orders
DEBUG.createSampleOrder();       // Create sample order for testing
DEBUG.logSampleOrder();          // Log sample to Google Sheets
DEBUG.testWhatsApp();            // Show WhatsApp message format
DEBUG.testEmail();               // Show email format
DEBUG.printReceiptPreview();     // Show receipt HTML
DEBUG.clearAllOrders();          // Clear saved orders (with confirmation)
```

### Check System Status

```javascript
// Console will show:
DEBUG.showStatus();

// Output:
// ┌─────────────────┬──────────────────┐
// │ Payment System  │ Active           │
// │ UPI ID          │ 8956389723@...   │
// │ Store Phone     │ +918956389723    │
// │ Google Sheets   │ Connected        │
// │ EmailJS         │ Loaded           │
// │ Local Storage   │ Available        │
// │ Current Orders  │ 5                │
// └─────────────────┴──────────────────┘
```

---

## Troubleshooting

### Issue: Invoice not generating

**Possible Causes:**
- easyinvoice.js not loaded
- Missing product data
- API rate limiting

**Solution:**
```javascript
// Check in console
DEBUG.showStatus(); // Check if easyinvoice is loaded

// Manually test
const testInvoice = await generateCompleteInvoice(DEBUG.createSampleOrder());
```

### Issue: Emails not sending

**Possible Causes:**
- EmailJS not initialized
- Wrong credentials
- Service plan limits

**Solution:**
```javascript
// Check in console
typeof emailjs // Should not be undefined

// Verify credentials
CONFIG.emailjs // Check serviceId, templateId, publicKey
```

### Issue: WhatsApp not opening

**Possible Causes:**
- Invalid phone number
- WhatsApp not installed
- Browser restrictions

**Solution:**
```javascript
// Check phone number format
CONFIG.storePhone // Should be in format +918956389723

// Test message
DEBUG.testWhatsApp();
```

### Issue: Google Sheets not logging

**Possible Causes:**
- Invalid script URL
- Google Sheets API not enabled
- CORS restrictions

**Solution:**
```javascript
// Check in console
CONFIG.googleSheets.url // Should be valid Google Apps Script URL

// Test manually
await logToGoogleSheets(DEBUG.createSampleOrder());
```

### Issue: Local storage errors

**Possible Causes:**
- Private browsing mode
- Storage quota exceeded
- Browser restrictions

**Solution:**
```javascript
// Check storage availability
try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('Storage available');
} catch (e) {
    console.log('Storage not available');
}

// Clear storage if full
DEBUG.clearAllOrders();
```

---

## API Integration Points

### Add New Payment Method

```javascript
function openBankTransfer() {
    // Add your bank transfer logic
    const bankDetails = {
        bankName: "HDFC Bank",
        accountNo: "XXXXXXXXXX",
        ifsc: "HDFC0000123"
    };
    
    // Show bank details modal
    // Process payment
}
```

### Add Refund Functionality

```javascript
async function refundOrder(orderData) {
    try {
        // Call your refund API
        const response = await fetch('/api/refund', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Refund processed successfully!', 'success');
            // Update order status
            orderData.payment.status = 'REFUNDED';
            
            // Log to sheets
            await logToGoogleSheets(orderData);
        }
    } catch (error) {
        console.error('Refund error:', error);
    }
}
```

### Send Custom Notifications

```javascript
async function sendCustomNotification(orderData, message) {
    // Send SMS
    // Send Telegram
    // Send Slack webhook
    // Custom API call
    
    await fetch('/api/notification', {
        method: 'POST',
        body: JSON.stringify({
            orderId: orderData.orderId,
            message: message
        })
    });
}
```

---

## Performance Tips

1. **Minimize notifications** - Use Promise.allSettled() to send in parallel
2. **Cache products** - Load product data once
3. **Lazy load libraries** - Load easyinvoice only when needed
4. **Clean storage** - Run cleanupOrderHistory() regularly
5. **Monitor analytics** - Track conversion rates

---

## Security Considerations

1. **Validate all inputs** - Always use validatePaymentForm()
2. **Use HTTPS** - All API calls should be over HTTPS
3. **Protect API keys** - Never expose API keys in code
4. **Verify payments** - Always verify UPI transactions on backend
5. **Sanitize data** - Clean all user inputs before display
6. **Rate limiting** - Implement rate limiting on submission
7. **CSRF tokens** - Add CSRF protection for form submissions

---

## Support & Updates

**For Issues:**
- Check the debug tools
- Review browser console
- Verify configuration
- Test with sample data
- Review troubleshooting section

**Latest Version:**
- Currently: v2.0
- Features: Complete payment, invoicing, notifications
- Status: Production Ready
- Last Updated: 19 Feb 2026

**Contact Development:**
- Email: akkuelectronics.nagpur@gmail.com
- Phone: +91 8956389723
- Website: https://akkuelectronics.in

---

## Version History

### v2.0 (Current)
- ✅ Complete rewrite
- ✅ Advanced error handling
- ✅ Local storage backup
- ✅ Multiple notification channels
- ✅ Comprehensive debug tools
- ✅ Google Sheets integration
- ✅ Analytics tracking
- ✅ Receipt generation
- ✅ CSV export
- ✅ Full documentation

### v1.0 (Legacy)
- Basic payment functionality
- Simple email notification
- Invoice generation

---

## License & Terms

This payment system is proprietary to Akku Electronics.
All rights reserved © 2026 Akku Electronics

---

**Document Version:** 2.0  
**Last Updated:** 19 February 2026  
**Status:** Complete ✅
