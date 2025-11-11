# Payment Gateway Setup Guide

## Current Payment Options

Your shop.html now includes multiple payment options:

1. **WhatsApp Order** ✅ (Currently Active)
   - Customers can directly message you on WhatsApp
   - No setup required
   - Phone: 9960599605

2. **Cash on Delivery (COD)** ✅ (Currently Active)
   - Orders confirmed via alert
   - You can manually process these orders

3. **Online Payment** (UPI/Card/Net Banking) - Requires Razorpay Setup

---

## How to Enable Razorpay Payment Gateway

### Step 1: Create Razorpay Account

1. Go to https://razorpay.com
2. Click "Sign Up" (Free for Indian businesses)
3. Complete business verification
4. Get your API Keys from Dashboard

### Step 2: Add Razorpay Script to shop.html

Add this line in the `<head>` section of `shop.html` (before closing `</head>` tag):

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 3: Update script.js with Your API Key

In `script.js`, find the `initiateRazorpayPayment` function and:

1. Uncomment the Razorpay integration code (lines marked with /* */)
2. Replace `'YOUR_RAZORPAY_KEY_ID'` with your actual Razorpay Key ID
3. Add your logo path if needed

```javascript
const options = {
    key: 'rzp_test_XXXXXXXXXX', // Your Razorpay Key ID
    amount: amount,
    currency: 'INR',
    name: 'Akku Electronics',
    description: currentProduct.name,
    image: './images/logo.png',
    // ... rest of the code
};
```

### Step 4: Test Payment

1. Use Razorpay Test Mode first
2. Test with dummy card numbers provided by Razorpay
3. Once verified, switch to Live Mode

---

## Payment Flow

### For Customers:

1. **Browse Products** → Click "Buy Now"
2. **Payment Modal Opens** → Shows order summary
3. **Select Payment Method**:
   - WhatsApp: Opens chat with pre-filled message
   - COD: Confirms order, you'll receive notification
   - UPI/Card/Net Banking: Opens Razorpay payment gateway

### For You (Shop Owner):

1. **WhatsApp Orders**: Manually handle via WhatsApp chat
2. **COD Orders**: Currently shows alert, you can add backend to receive email/SMS
3. **Razorpay Orders**: Automatic payment processing, check dashboard for confirmed payments

---

## Backend Integration (Optional but Recommended)

To receive order notifications automatically:

### Option 1: Simple Email Notification
Add EmailJS or similar service to send you emails when orders are placed

### Option 2: Database Storage
Set up a simple backend (Node.js/PHP) to store orders in a database

### Option 3: Google Sheets Integration
Use Google Sheets API to log orders automatically

---

## Razorpay Pricing (India)

- **Setup**: Free
- **Transaction Fee**: 2% per transaction
- **Settlement**: T+2 days to bank account
- **No setup or maintenance fees**

---

## Testing Checklist

- [ ] WhatsApp link opens correctly
- [ ] COD order shows confirmation
- [ ] Payment modal opens on "Buy Now"
- [ ] Product details display correctly in modal
- [ ] Modal closes properly (X button, outside click, Escape key)
- [ ] Responsive on mobile devices
- [ ] All payment buttons are clickable

---

## Support & Resources

- **Razorpay Documentation**: https://razorpay.com/docs/
- **Razorpay Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **WhatsApp Business**: https://business.whatsapp.com/

---

## Security Notes

⚠️ **Important**: 
- Never expose your Razorpay Secret Key in frontend code
- Only use Key ID in frontend
- Keep Secret Key on your backend server
- Enable 2FA on Razorpay account
- Use HTTPS for production website

---

## Current Status

✅ Shop page with professional product cards
✅ Payment modal with multiple options
✅ WhatsApp integration (Active)
✅ COD option (Active)
⏳ Razorpay integration (Pending - requires signup)

---

**Need Help?** Contact Razorpay support or check their comprehensive documentation.
