# Payment System Integration Guide
## Akku Electronics UPI Payment System

Your payment system has been successfully implemented! Here's how to complete the setup:

---

## 🎯 What's Been Implemented

✅ **UPI Payment with QR Code Generation**
- Automatic QR code creation with product amount
- Support for all UPI apps (PhonePe, Google Pay, Paytm, etc.)
- Direct deep links to open payment apps

✅ **Customer Order Flow**
- Product selection → Payment modal
- QR code scan or UPI app link
- UTR (transaction ID) submission
- Customer details collection

✅ **Invoice Generation**
- Automatic PDF invoice creation
- Professional branded invoice with order details
- Includes customer info, product details, payment info

✅ **Dual Notifications**
- Email notifications (to you and customer)
- WhatsApp notification to your number
- Invoice PDF attached to emails

✅ **Google Sheets Logging**
- All orders automatically logged
- Complete customer and order details
- Payment tracking with UTR

---

## 📧 Step 1: Setup EmailJS (FREE - 200 emails/month)

1. **Create Account:**
   - Go to https://www.emailjs.com/
   - Sign up for FREE account

2. **Create Email Service:**
   - Go to Email Services → Add New Service
   - Choose Gmail (or any provider)
   - Connect your email: `akkuelectronics.nagpur@gmail.com`
   - Copy the **Service ID**

3. **Create Email Template:**
   - Go to Email Templates → Create New Template
   - Template Name: "New Order Notification"
   - Add these variables in your template:

   **For Store Owner Email:**
   ```
   Subject: 🛒 New Order {{order_id}} - Akku Electronics

   New order received!

   ORDER DETAILS:
   Order ID: {{order_id}}
   Date: {{timestamp}}

   CUSTOMER DETAILS:
   Name: {{customer_name}}
   Email: {{customer_email}}
   Phone: {{customer_phone}}
   Address: {{customer_address}}

   PRODUCT:
   {{product_name}}
   Amount: ₹{{amount}}

   PAYMENT:
   Method: UPI
   UTR: {{utr}}
   Status: Pending Verification

   Please verify this payment in your UPI app.

   ---
   Akku Electronics
   ```

   **For Customer Email:**
   ```
   Subject: Order Confirmation {{order_id}} - Akku Electronics

   Dear {{to_name}},

   Thank you for your order!

   Your order {{order_id}} has been received and is being processed.

   Product: {{product_name}}
   Amount: ₹{{amount}}
   Payment: UPI ({{utr}})

   We will verify your payment and contact you within 24 hours.

   Invoice is attached to this email.

   Thanks,
   Akku Electronics
   Phone: +91 8956389723
   ```

   - Copy the **Template ID**

4. **Get Public Key:**
   - Go to Account → API Keys
   - Copy your **Public Key**

5. **Update payment.js:**
   Open `payment.js` and replace these values (lines 8-10):
   ```javascript
   const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Replace with your Service ID
   const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Replace with your Template ID
   const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Replace with your Public Key
   ```

---

## 📊 Step 2: Setup Google Sheets Logging

1. **Create Google Sheet:**
   - Go to https://sheets.google.com
   - Create new sheet named "Akku Electronics Orders"
   - Add these column headers in Row 1:
     - A1: `Timestamp`
     - B1: `Order ID`
     - C1: `Customer Name`
     - D1: `Customer Email`
     - E1: `Customer Phone`
     - F1: `Customer Address`
     - G1: `Product Name`
     - H1: `Category`
     - I1: `Original Price`
     - J1: `Final Price`
     - K1: `Discount`
     - L1: `Payment Method`
     - M1: `UTR`
     - N1: `Status`

2. **Create Apps Script:**
   - In your Google Sheet: Extensions → Apps Script
   - Delete existing code
   - Paste this code:

   ```javascript
   function doPost(e) {
     try {
       const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       const data = JSON.parse(e.postData.contents);
       
       sheet.appendRow([
         data.timestamp,
         data.orderId,
         data.customerName,
         data.customerEmail,
         data.customerPhone,
         data.customerAddress,
         data.productName,
         data.productCategory,
         data.originalPrice,
         data.finalPrice,
         data.discount,
         data.paymentMethod,
         data.utr,
         data.status
       ]);
       
       return ContentService.createTextOutput(JSON.stringify({
         status: 'success',
         message: 'Order logged successfully'
       })).setMimeType(ContentService.MimeType.JSON);
       
     } catch (error) {
       return ContentService.createTextOutput(JSON.stringify({
         status: 'error',
         message: error.toString()
       })).setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

   - Save the project (name it "Order Logger")

3. **Deploy as Web App:**
   - Click Deploy → New Deployment
   - Select type: Web App
   - Description: "Order Logger API"
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy
   - Authorize the app (sign in with your Google account)
   - Copy the **Web App URL**

4. **Update payment.js:**
   Open `payment.js` and replace line 13:
   ```javascript
   const GOOGLE_SHEETS_URL = "YOUR_WEB_APP_URL"; // Paste your Web App URL here
   ```

---

## ✅ Step 3: Test the System

1. **Open your shop page:**
   ```
   http://localhost/shop.html (or your live URL)
   ```

2. **Click "Buy Now" on any product**

3. **Test the flow:**
   - ✅ Payment modal opens
   - ✅ QR code displays
   - ✅ Amount shows correctly
   - ✅ Click "I've Paid"
   - ✅ Fill customer form
   - ✅ Enter dummy UTR: `123456789012`
   - ✅ Submit

4. **Verify:**
   - ✅ Success message appears
   - ✅ Email received (check spam folder)
   - ✅ WhatsApp opens with order details
   - ✅ Google Sheet has new row

---

## 📱 WhatsApp Notification

The system automatically opens WhatsApp with a pre-filled message containing:
- Order ID
- Customer details
- Product info
- Amount
- UTR
- Timestamp

You can then send this to yourself or save it as a reminder.

---

## 🔒 Security Notes

1. **Payment Verification:** 
   - System collects UTR for manual verification
   - Always verify payment in your UPI app before shipping
   - Status is "Pending Verification" until you confirm

2. **Email Credentials:**
   - EmailJS keys are safe to use in frontend
   - They're limited to 200 emails/month on free plan
   - Upgrade if you need more

3. **Google Sheets:**
   - Data is logged to your private sheet
   - Only you have access (unless you share it)
   - Web App URL can be public (doesn't expose data)

---

## 🎨 Customization

### Change UPI ID:
Edit `payment.js` line 6:
```javascript
const UPI_ID = "8956389723@barodampay"; // Your UPI ID
```

### Change Colors:
Edit `payment.css` to match your brand colors.

### Add More Payment Methods:
You can add Razorpay, PayU, etc. later if needed.

---

## 📞 Customer Experience Flow

1. **Browse Products** → Customer sees products with "Buy Now" button
2. **Click Buy Now** → Payment modal opens
3. **See QR Code** → Scan with any UPI app
4. **Pay Amount** → Complete payment in their UPI app
5. **Get UTR** → Copy transaction ID from UPI app
6. **Submit Form** → Enter details and UTR
7. **Get Confirmation** → Success message + email with invoice
8. **Wait for Verification** → You verify and ship within 24 hours

---

## 🚀 Going Live

1. ✅ Replace all placeholder IDs in `payment.js`
2. ✅ Test with small amount (₹10)
3. ✅ Verify email arrives
4. ✅ Check Google Sheet logging
5. ✅ Upload to your live site
6. ✅ Start selling!

---

## 💡 Tips

- Check spam folder for first few emails
- Add `no-reply@emailjs.com` to contacts
- Keep Google Sheet organized (sort by date)
- Archive old orders monthly
- Update UTR status in sheet after verification
- Consider adding order status tracking page later

---

## 🆘 Troubleshooting

**QR Code not showing?**
- Check browser console for errors
- Ensure QRCode.js library loaded

**Email not sending?**
- Verify EmailJS credentials
- Check spam folder
- Ensure template has correct variables

**Google Sheets not logging?**
- Check Web App URL is correct
- Ensure script deployment is "Anyone" access
- Check script permissions

**WhatsApp not opening?**
- Ensure WhatsApp is installed
- Check phone number format

---

## 📈 Future Enhancements

Consider adding later:
- Payment gateway integration (Razorpay/PayU)
- Automatic payment verification API
- Order status tracking page
- SMS notifications
- Inventory management
- Shipping tracking

---

## ✨ Your System is Ready!

You now have a complete payment system with:
- ✅ UPI QR Code payments
- ✅ Invoice generation
- ✅ Email notifications
- ✅ WhatsApp notifications
- ✅ Google Sheets order logging

Just complete the EmailJS and Google Sheets setup, and you're ready to start selling!

---

**Need Help?**
- EmailJS Docs: https://www.emailjs.com/docs/
- Google Apps Script: https://developers.google.com/apps-script
- UPI Deep Links: https://www.npci.org.in/what-we-do/upi

Good luck with your online store! 🎮🎯
