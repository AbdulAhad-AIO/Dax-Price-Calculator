const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Serve index.html for any route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/calculate', (req, res) => {
    const { sourcingPrice, sellingPrice, packagingCost, commissionPercentage, shippingOption, requiredProfitType, requiredProfitValue } = req.body;

    const VAT = 0.18;
    const SHIPPING_COST = 50; // Default shipping fee
    const FREE_SHIPPING_COST = 150; // Shared free shipping

    // Commission fee calculation
    const commissionFee = (sellingPrice * commissionPercentage) / 100;
    const commissionFeeWithVAT = commissionFee + commissionFee * VAT;

    // Payment fee calculation (1.75% of selling price)
    const paymentFee = (sellingPrice * 0.0175);
    const paymentFeeWithVAT = paymentFee + paymentFee * VAT;

    // Handling fee calculation based on selling price
    let handlingFee = 0;
    if (sellingPrice <= 500) {
        handlingFee = 10;
    } else if (sellingPrice <= 1000) {
        handlingFee = 15;
    } else if (sellingPrice <= 2000) {
        handlingFee = 20;
    } else {
        handlingFee = 60;
    }
    const handlingFeeWithVAT = handlingFee + handlingFee * VAT;

    // Shipping fee calculation
    let shippingFee = 0;
    if (shippingOption === "shared") {
        shippingFee = FREE_SHIPPING_COST + FREE_SHIPPING_COST * VAT;
    } else {
        shippingFee = SHIPPING_COST + SHIPPING_COST * VAT;
    }

    // Total deductions calculation
    const totalDeductions = packagingCost + commissionFeeWithVAT + paymentFeeWithVAT + handlingFeeWithVAT + shippingFee;

    // Profit Calculation
    const profitAmount = sellingPrice - (totalDeductions + sourcingPrice);
    const profitPercentage = ((profitAmount / sellingPrice) * 100).toFixed(2);

    // Suggested Selling Price Calculation (only if Required Profit Type is chosen)
    let suggestedSellingPrice = sellingPrice; // Default to selling price
    if (requiredProfitType === "percentage") {
        suggestedSellingPrice = totalDeductions + sourcingPrice + (requiredProfitValue / 100) * (totalDeductions + sourcingPrice);
    } else if (requiredProfitType === "fixed") {
        suggestedSellingPrice = totalDeductions + sourcingPrice + requiredProfitValue;
    }

    // Return results as JSON
    res.json({
        totalDeductions: totalDeductions.toFixed(2),
        totalProfit: profitAmount.toFixed(2),
        suggestedSellingPrice: suggestedSellingPrice.toFixed(2),
        profitAmount: profitAmount.toFixed(2),
        profitPercentage: profitPercentage
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);

    const cors = require('cors');
app.use(cors());  // Enable CORS

});
    