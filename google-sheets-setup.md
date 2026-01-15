# Google Sheets Setup for Akku Electronics Orders
## Complete Step-by-Step Guide

---

## 📊 Step 1: Create Your Google Sheet

1. **Open Google Sheets**
   - Go to: https://sheets.google.com
   - Click "+ Blank" to create new spreadsheet

2. **Name Your Sheet**
   - Click "Untitled spreadsheet" at top
   - Rename to: **"Akku Electronics Orders"**

---

## 📝 Step 2: Setup Column Headers

**Copy and paste these headers exactly in Row 1:**

| Column | Header Name |
|--------|-------------|
| A1 | Timestamp |
| B1 | Order ID |
| C1 | Customer Name |
| D1 | Customer Email |
| E1 | Customer Phone |
| F1 | Customer Address |
| G1 | Product Name |
| H1 | Category |
| I1 | Original Price |
| J1 | Final Price |
| K1 | Discount |
| L1 | Payment Method |
| M1 | UTR |
| N1 | Status |

**Quick Copy-Paste (Select A1 and paste this):**
```
Timestamp	Order ID	Customer Name	Customer Email	Customer Phone	Customer Address	Product Name	Category	Original Price	Final Price	Discount	Payment Method	UTR	Status
```

---

## 🎨 Step 3: Format Your Sheet (Optional but Recommended)

1. **Header Row Formatting:**
   - Select Row 1 (click on "1")
   - Background color: Gold/Yellow (#FFD700)
   - Text: Bold
   - Text color: Black
   - Alignment: Center

2. **Column Widths:**
   - Column A (Timestamp): 180px
   - Column B (Order ID): 150px
   - Column C (Customer Name): 150px
   - Column D (Customer Email): 200px
   - Column E (Customer Phone): 130px
   - Column F (Customer Address): 250px
   - Column G (Product Name): 250px
   - Column H (Category): 120px
   - Column I (Original Price): 110px
   - Column J (Final Price): 110px
   - Column K (Discount): 90px
   - Column L (Payment Method): 130px
   - Column M (UTR): 150px
   - Column N (Status): 150px

3. **Freeze Header Row:**
   - Click View → Freeze → 1 row

4. **Add Filters:**
   - Select header row
   - Click Data → Create a filter

---

## 🔧 Step 4: Create Apps Script

1. **Open Script Editor:**
   - In your Google Sheet, click: **Extensions → Apps Script**
   - A new tab will open with code editor

2. **Delete Existing Code:**
   - Select all existing code (Ctrl+A)
   - Delete it

3. **Paste This Code:**

```javascript
/**
 * Akku Electronics Order Logger
 * Receives order data from website and logs to Google Sheets
 */

function doPost(e) {
  try {
    // Get the active spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Sheet1'); // Change if your sheet has different name
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Log received data (for debugging)
    Logger.log('Received order data: ' + JSON.stringify(data));
    
    // Prepare row data in correct order matching headers
    const rowData = [
      data.timestamp || new Date().toLocaleString('en-IN'),
      data.orderId || '',
      data.customerName || '',
      data.customerEmail || '',
      data.customerPhone || '',
      data.customerAddress || '',
      data.productName || '',
      data.productCategory || '',
      data.originalPrice || 0,
      data.finalPrice || 0,
      data.discount || 0,
      data.paymentMethod || 'UPI',
      data.utr || '',
      data.status || 'Pending Verification'
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Optional: Format the new row
    const lastRow = sheet.getLastRow();
    
    // Format price columns as currency
    sheet.getRange(lastRow, 9).setNumberFormat('₹#,##0.00'); // Original Price
    sheet.getRange(lastRow, 10).setNumberFormat('₹#,##0.00'); // Final Price
    sheet.getRange(lastRow, 11).setNumberFormat('₹#,##0.00'); // Discount
    
    // Add color coding for status
    const statusCell = sheet.getRange(lastRow, 14);
    if (data.status === 'Pending Verification') {
      statusCell.setBackground('#FFF3CD'); // Light yellow
      statusCell.setFontColor('#856404'); // Dark yellow
    }
    
    // Send success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Order logged successfully',
      orderId: data.orderId,
      row: lastRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error for debugging
    Logger.log('Error: ' + error.toString());
    
    // Send error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify setup
 * Run this from the editor to test
 */
function testOrderLogger() {
  const testData = {
    timestamp: new Date().toLocaleString('en-IN'),
    orderId: 'TEST123456',
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '9876543210',
    customerAddress: 'Test Address, Nagpur',
    productName: 'Test Product',
    productCategory: 'controllers',
    originalPrice: 5000,
    finalPrice: 4500,
    discount: 500,
    paymentMethod: 'UPI',
    utr: 'TEST789012',
    status: 'Pending Verification'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}
```

4. **Save the Script:**
   - Click the disk icon or Ctrl+S
   - Project name: **"Akku Electronics Order Logger"**
   - Click **OK**

---

## 🚀 Step 5: Deploy as Web App

1. **Click Deploy Button:**
   - Top right: Click **Deploy → New deployment**

2. **Configure Deployment:**
   - Click gear icon ⚙️ next to "Select type"
   - Choose: **Web app**

3. **Settings:**
   - **Description:** "Akku Electronics Order API v1"
   - **Execute as:** **Me** (your email)
   - **Who has access:** **Anyone**
   
4. **Deploy:**
   - Click **Deploy** button
   - You'll see: "Authorize access" - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to Akku Electronics Order Logger (unsafe)**
   - Click **Allow**

5. **Copy Web App URL:**
   - You'll see a deployment success screen
   - **Copy the "Web app" URL** - it looks like:
     ```
     https://script.google.com/macros/s/AKfycbxxx.../exec
     ```
   - **SAVE THIS URL!** You'll need it in the next step

---

## 🔗 Step 6: Update Your Website

1. **Open payment.js file**
   - Find line 13

2. **Replace with your URL:**
   ```javascript
   const GOOGLE_SHEETS_URL = "PASTE_YOUR_WEB_APP_URL_HERE";
   ```

3. **Example:**
   ```javascript
   const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxxx.../exec";
   ```

---

## ✅ Step 7: Test Your Setup

### Method 1: Test from Apps Script

1. **In Apps Script editor:**
   - Select function: `testOrderLogger`
   - Click **Run** (▶️ button)
   - Click **Review permissions** if prompted
   - Authorize the app

2. **Check Results:**
   - Go back to your Google Sheet
   - You should see a test row added
   - If successful, delete the test row

### Method 2: Test from Website

1. **Open your shop page**
2. **Click "Buy Now" on any product**
3. **Fill the form with test data:**
   - Use your real email
   - UTR: `TEST123456789`
4. **Submit**
5. **Check Google Sheet:**
   - Refresh the sheet
   - New row should appear

---

## 📊 Example Data Row

After your first order, you'll see data like this:

| Timestamp | Order ID | Customer Name | ... | Status |
|-----------|----------|---------------|-----|--------|
| 15/01/2026 14:30:45 | AE1705318245123 | John Doe | ... | Pending Verification |

---

## 🔐 Security & Privacy

✅ **Safe to use:**
- Only you can access the sheet (unless you share it)
- Web App URL is public but doesn't expose data
- Data is write-only from website
- You control all permissions

✅ **Best Practices:**
- Don't share the sheet publicly
- Keep Web App URL in your code only
- Regularly backup important orders
- Update status after verifying payments

---

## 🎯 Managing Orders

### Update Order Status:
1. After verifying payment in UPI app
2. Change status from "Pending Verification" to:
   - ✅ "Payment Verified"
   - 📦 "Processing"
   - 🚚 "Shipped"
   - ✔️ "Delivered"
   - ❌ "Cancelled"

### Filter Orders:
- Use filter dropdown on Status column
- View only pending orders
- Sort by date, amount, etc.

### Monthly Reports:
1. Create new sheet for each month
2. Copy relevant orders
3. Archive old data

---

## 🔄 Common Issues & Solutions

### Issue: "Authorization required"
**Solution:** Run `testOrderLogger` function first to authorize

### Issue: "Script not found"
**Solution:** Make sure deployment is set to "Anyone" access

### Issue: "Data not appearing"
**Solution:** 
- Check Web App URL is correct in payment.js
- Check sheet name is "Sheet1" or update in code
- View Apps Script logs: View → Logs

### Issue: "Permission denied"
**Solution:** Redeploy with "Execute as: Me"

---

## 📞 Support

If you encounter issues:
1. Check Apps Script logs: Extensions → Apps Script → View → Logs
2. Verify deployment settings
3. Test with `testOrderLogger` function
4. Check browser console for errors

---

## ✨ Your Sheet is Ready!

Once setup is complete:
- ✅ Orders log automatically
- ✅ Data formatted nicely
- ✅ Easy to filter and search
- ✅ Secure and private
- ✅ Accessible from anywhere

**Next:** Update the Web App URL in payment.js and you're done! 🎉

---

## 📸 Quick Visual Checklist

- [ ] Sheet created with name "Akku Electronics Orders"
- [ ] 14 columns with correct headers (A1-N1)
- [ ] Headers formatted (bold, colored)
- [ ] Row 1 frozen
- [ ] Apps Script code pasted
- [ ] Script saved as "Akku Electronics Order Logger"
- [ ] Deployed as Web App
- [ ] "Execute as: Me" selected
- [ ] "Who has access: Anyone" selected
- [ ] Web App URL copied
- [ ] URL pasted in payment.js line 13
- [ ] Test run successful

---

**Estimated Setup Time:** 10-15 minutes

Good luck! 🚀
