# 🎮 PAYMENT SYSTEM - QUICK REFERENCE

## ⚡ INSTANT ACCESS

### Global Payment Object
```javascript
window.AkkuPayment
```

All payment functions accessible via `window.AkkuPayment` object

---

## 🎯 MAIN FUNCTIONS

### Open Payment Modal
```javascript
openPaymentModal({
    id: 1,
    name: "Product Name",
    price: 1000,
    originalPrice: 1500,
    category: "console",
    image: "image.jpg"
})
```

### Close Payment Modal
```javascript
closePaymentModal()
```

### Generate Order ID
```javascript
const orderId = generateOrderId()
// Returns: AKKU-20260219-1450282961
```

---

## 🧪 DEBUG TOOLS (Console)

### System Status
```javascript
DEBUG.showStatus()
```

Shows:
- Payment System Active/Inactive
- UPI ID configuration
- Store phone & email
- Google Sheets connection
- EmailJS library status
- Local storage available
- Current number of orders

### View All Orders
```javascript
DEBUG.showOrderHistory()
```

Shows all saved orders in local storage

### Create Test Order
```javascript
const sample = DEBUG.createSampleOrder()
console.log(sample)
```

Creates sample order for testing

### Test WhatsApp Message
```javascript
DEBUG.testWhatsApp()
```

Previews WhatsApp message in console

### Test Email
```javascript
DEBUG.testEmail()
```

Previews customer and store emails

### Receipt Preview
```javascript
DEBUG.printReceiptPreview()
```

Shows HTML receipt in console

### Log Sample Order
```javascript
DEBUG.logSampleOrder()
```

Logs sample order to Google Sheets

### Clear All Orders
```javascript
DEBUG.clearAllOrders()
```

⚠️ Permanently deletes all saved orders (with confirmation)

---

## 📊 CONFIGURATION

### Located in: `payment.js` (Lines 12-48)

```javascript
const CONFIG = {
    // UPI Details
    upiId: "8956389723@barodampay",
    upiMobile: "918956389723",
    
    // Store Contact
    storeEmail: "akkuelectronics.nagpur@gmail.com",
    storePhone: "+918956389723",
    
    // Third-party Services
    emailjs: {
        serviceId: "service_n0k02w5",
        templateId: "template_o0reqai",
        publicKey: "H0DYylQzCYbPNlrq9"
    },
    
    googleSheets: {
        url: "https://script.google.com/macros/s/..."
    },
    
    // Tax Settings
    tax: {
        gstRate: 0,      // Change to 5, 12, 18, 28 as needed
        gstNo: "27AABCA1234H1Z2"
    }
}
```

### Quick Changes

**Change GST Rate:**
```javascript
CONFIG.tax.gstRate = 18  // 18% GST
```

**Change Store Email:**
```javascript
CONFIG.storeEmail = "newemail@example.com"
```

**Change Google Sheets URL:**
```javascript
CONFIG.googleSheets.url = "https://script.google.com/macros/s/YOUR-ID/exec"
```

---

## 🔄 PAYMENT FLOW

```
1. User clicks "Buy Now" on product
   ↓
2. openPaymentModal(product) triggered
   ↓
3. Payment modal displays with:
   - Product image
   - Product name
   - Original price
   - Discount (if any)
   - Final price
   ↓
4. User selects payment method (PhonePe, Google Pay, Paytm, Web UPI)
   ↓
5. Payment instructions shown
   ↓
6. User enters UTR (Transaction ID) after paying
   ↓
7. submitPayment() processes form
   ↓
8. Order data created & validated
   ↓
9. Invoice generated (PDF)
   ↓
10. Parallel processing:
    - Email sent to customer
    - Email sent to store
    - WhatsApp message sent
    - Order logged to Google Sheets
    - Analytics event tracked
    - Order saved to local storage
   ↓
11. Success screen displays with:
    - Order confirmation
    - Download invoice button
    - Next steps
   ↓
12. Done
```

---

## 📱 USER-FACING SCREENS

### Screen 1: Payment Instructions
- Product image
- Product name & details
- Price breakdown
- UPI app buttons (PhonePe, Google Pay, Paytm)
- Amount to pay
- "I've Paid" button

### Screen 2: UPI Payment
- QR code for web UPI
- Amount showing
- Instructions to scan QR
- Confirmation button

### Screen 3: Transaction Details
- Enter Transaction ID (UTR)
- Enter customer name
- Enter email address
- Enter phone number
- Enter address
- Submit button

### Screen 4: Success
- ✓ Order confirmation
- Order ID
- Product details
- Download invoice button
- WhatsApp contact button
- Store contact details

---

## 📧 EMAIL TEMPLATES

### Customer Email
```
Subject: Order Confirmation - Akku Electronics
Content:
- Thank you message
- Order details
- Product information
- Invoice PDF attachment
- Next steps
- Contact information
```

### Store Email
```
Subject: New Order - [Product Name]
Content:
- New order notification
- Complete customer info
- Product & payment details
- Order ID
- Customer contact
- Invoice generated
```

---

## 💬 WHATSAPP MESSAGE FORMAT

```
🎮 Order Confirmation - Akku Electronics

Order ID: AKKU-20260219-XXXXX
Date: 19/02/2026, 02:30 PM

📦 Product: PlayStation 5 Controller
💰 Amount: ₹4,500

✅ Payment Status: PENDING VERIFICATION

📋 Order Details
Customer: John Doe
Email: john@example.com
Phone: +91 98765 43210

🏪 Store Details
Akku Electronics
📞 +91 8956 389 723
📧 akkuelectronics.nagpur@gmail.com
🌐 https://akkuelectronics.in

Next Steps:
✓ Your payment is being verified
✓ We will confirm via WhatsApp
✓ Invoice is attached/sent
✓ Contact us for any queries

Thank you for shopping! 🙏
```

---

## 💾 LOCAL STORAGE

### Stored Data
- Last 100 orders
- Order ID, timestamp, all details
- Automatic backup when cloud fails
- Cleared automatically (keeps last 100)

### Access Orders
```javascript
const orders = getOrderHistory()
orders.forEach(order => {
    console.log(order.orderId, order.customer.name)
})
```

### Clear Orders
```javascript
DEBUG.clearAllOrders()
```

---

## 📊 GOOGLE SHEETS LOGGING

### Auto-Logged Fields (16 total)
1. Order ID
2. Timestamp (ISO)
3. Formatted Date
4. Formatted Time
5. Product Name
6. Product Price
7. Product Category
8. Customer Name
9. Customer Email
10. Customer Phone
11. Customer Address
12. Payment Method
13. Payment Status
14. Transaction ID (UTR)
15. Amount Paid
16. Store Name

### Access Orders
1. Go to Google Sheets
2. Google Forms linked to sheet
3. Orders appear as new rows automatically
4. Can export to CSV/Excel

---

## 📈 GOOGLE ANALYTICS TRACKING

### Tracked Events
```javascript
event_tracking {
    transaction_id: "AKKU-20260219-XXXXX",
    value: 4500,
    currency: "INR",
    items: [
        {
            item_id: "1",
            item_name: "PlayStation 5 Controller",
            price: 4500,
            quantity: 1
        }
    ]
}
```

### View Analytics
1. Go to Google Analytics
2. Go to "Conversions" > "All Conversions"
3. Should see purchase events
4. Can create purchase revenue reports

---

## 🐛 TROUBLESHOOTING

### Payment Modal Not Opening
```javascript
DEBUG.showStatus()
// Check if payment system is Active
// If not, refresh page
```

### Email Not Sending
```javascript
// Check EmailJS configuration
console.log(CONFIG.emailjs)

// Check if emailjs library loaded
console.log(typeof emailjs)
// Should show 'object', not 'undefined'
```

### Invoice Not Generating
```javascript
// Check if easyinvoice library loaded
console.log(typeof easyinvoice)
// Should show 'object', not 'undefined'
```

### Google Sheets Not Logging
```javascript
// Verify Google Sheets URL
console.log(CONFIG.googleSheets.url)

// Check browser console for error
// Look for CORS or network errors
```

### WhatsApp Link Not Opening
```javascript
// Check WhatsApp Web
// Some browsers block wa.me links
// Try different browser or device
```

### Local Storage Full
```javascript
// Clear old orders
DEBUG.clearAllOrders()

// Should free up space
```

---

## 🔐 IMPORTANT SECURITY NOTES

- ✅ Keep UPI ID confidential (already in config)
- ✅ Don't share EmailJS public key widely (safe to share)
- ✅ Don't expose Google Sheets URL in client code (needed for logging)
- ✅ Always verify payments manually
- ✅ Monitor for fraud
- ✅ Check orders in Google Sheets daily
- ✅ Keep local backups of transaction data

---

## 📱 RESPONSIVE DESIGN

- **Desktop:** Full-size modal, all features
- **Tablet:** Optimized layout, touch-friendly
- **Mobile:** Stack layout, mobile-optimized UPI apps

### Test Responsiveness
```
1. Right-click in browser
2. Click "Inspect" or "Inspect Element"
3. Click device toggle (top-left of DevTools)
4. Select different devices to test
```

---

## ⚙️ ADVANCED SETTINGS

### Change Payment Methods
In `payment.js`, look for `openUPIApp()` function:
```javascript
const apps = {
    phonepe: { ... },
    gpay: { ... },
    paytm: { ... }
}
// Add/remove payment apps here
```

### Customize Email Templates
Look for `buildCustomerEmailMessage()` function:
```javascript
// Edit HTML template to match your branding
// Change colors, logos, text
```

### Modify Invoice Format
Look for `generateCompleteInvoice()` function:
```javascript
// Customize invoice layout
// Add/remove fields
// Change colors and fonts
```

---

## 📞 QUICK CONTACTS

**Technical Support:**
- Email: akkuelectronics.nagpur@gmail.com
- Phone: +918956389723
- WhatsApp: https://wa.me/918956389723

**Business Follow-up:**
- Monitor Google Sheets for orders
- Check emails for customer inquiries
- Respond via WhatsApp messages
- Update order status as needed

---

## 🎓 RELATED DOCUMENTATION

- 📖 [PAYMENT_SYSTEM_DOCUMENTATION.md](PAYMENT_SYSTEM_DOCUMENTATION.md) - Complete function reference
- ✅ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Testing & deployment guide
- 📊 [PAYMENT_IMPLEMENTATION_COMPLETE.md](PAYMENT_IMPLEMENTATION_COMPLETE.md) - Implementation summary
- 💻 [payment.js](payment.js) - Source code
- 🛍️ [shop.html](shop.html) - Shop page

---

## 🚀 QUICK START (3 STEPS)

### 1. Test the System
```javascript
// In your browser console, type:
DEBUG.showStatus()
```

### 2. Create Test Order
```javascript
const testOrder = DEBUG.createSampleOrder()
console.log(testOrder)
```

### 3. Go Live
```
Click "Buy Now" on any product in shop.html
Test the complete payment flow
```

---

**Your Payment System is Live! 🎉**

**Enjoy processing orders with Akku Electronics Payment System v2.0!**
