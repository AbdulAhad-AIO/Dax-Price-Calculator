document.addEventListener("DOMContentLoaded", function () {
    const sourcingPriceInput = document.getElementById("sourcingPrice");
    const sellingPriceInput = document.getElementById("sellingPrice");
    const packagingCostInput = document.getElementById("packagingCost");
    const commissionPercentageInput = document.getElementById("commissionPercentage");
    const shippingOptionInput = document.getElementById("shippingOption");
    const requiredProfitTypeInput = document.getElementById("requiredProfitType");
    const requiredProfitValueInput = document.getElementById("requiredProfitValue");

    const totalProfitInput = document.getElementById("totalProfit");
    const totalDeductionsInput = document.getElementById("totalDeductions");
    const suggestedSellingPriceInput = document.getElementById("suggestedSellingPrice");
    const profitPercentageBox = document.getElementById("profitPercentageBox");

    // Constants for VAT and default shipping cost
    const VAT = 0.18;
    const SHIPPING_COST = 50; // Assuming 50 Rs as the standard shipping cost for "No Free Shipping"
    const FREE_SHIPPING_COST = 150;

    // Calculate Total Deductions and Profit when input changes
    function calculateResults() {
        const sourcingPrice = parseFloat(sourcingPriceInput.value) || 0;
        const sellingPrice = parseFloat(sellingPriceInput.value) || 0;
        const packagingCost = parseFloat(packagingCostInput.value) || 0;
        const commissionPercentage = parseFloat(commissionPercentageInput.value) || 0;
        const shippingOption = shippingOptionInput.value;
        const requiredProfitType = requiredProfitTypeInput.value;
        const requiredProfitValue = parseFloat(requiredProfitValueInput.value) || 0;

        // Commission fee calculation
        const commissionFee = (sellingPrice * commissionPercentage) / 100;
        const commissionFeeWithVAT = commissionFee + commissionFee * VAT;

        // Payment fee calculation
        const paymentFee = (sellingPrice * 0.0175); // Payment fee is 1.75% of selling price
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

        // Calculate Total Profit based on required profit type
        let totalProfit = 0;
        if (requiredProfitType === "percentage") {
            totalProfit = (sellingPrice * requiredProfitValue) / 100;
        } else if (requiredProfitType === "fixed") {
            totalProfit = requiredProfitValue;
        }

        // Suggested Selling Price Calculation
        let suggestedSellingPrice = 0;
        if (totalProfit > 0) {
            suggestedSellingPrice = totalDeductions + sourcingPrice + totalProfit;
        }

        // Show results in the form
        totalDeductionsInput.value = totalDeductions.toFixed(2);
        totalProfitInput.value = (sellingPrice - totalDeductions - sourcingPrice).toFixed(2);
        suggestedSellingPriceInput.value = suggestedSellingPrice.toFixed(2);

        // Profit Percentage Display (Total Profit in percentage)
        const profitAmount = sellingPrice - (totalDeductions + sourcingPrice);
        const profitPercentage = ((profitAmount / sellingPrice) * 100).toFixed(2);
        profitPercentageBox.textContent = `${profitPercentage}%`;

        // Apply green or red color depending on the profit amount
        profitPercentageBox.className = profitPercentage > 0 ? 'result-box green' : 'result-box red';
    }

    // Event listeners to trigger calculation on input change
    sourcingPriceInput.addEventListener("input", calculateResults);
    sellingPriceInput.addEventListener("input", calculateResults);
    packagingCostInput.addEventListener("input", calculateResults);
    commissionPercentageInput.addEventListener("input", calculateResults);
    shippingOptionInput.addEventListener("change", calculateResults);
    requiredProfitTypeInput.addEventListener("change", calculateResults);
    requiredProfitValueInput.addEventListener("input", calculateResults);
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calculator-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        // Collecting form data
        const sourcingPrice = parseFloat(document.getElementById("sourcingPrice").value);
        const sellingPrice = parseFloat(document.getElementById("sellingPrice").value);
        const packagingCost = parseFloat(document.getElementById("packagingCost").value);
        const commissionPercentage = parseFloat(document.getElementById("commissionPercentage").value);
        const shippingOption = document.getElementById("shippingOption").value;
        const requiredProfitType = document.getElementById("requiredProfitType").value;
        const requiredProfitValue = parseFloat(document.getElementById("requiredProfitValue").value);

        // Send data to the backend
        fetch('http://localhost:3000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sourcingPrice,
                sellingPrice,
                packagingCost,
                commissionPercentage,
                shippingOption,
                requiredProfitType,
                requiredProfitValue
            })
        })
        .then(response => response.json())
        .then(data => {
            // Displaying the results
            document.getElementById("totalDeductions").value = data.totalDeductions.toFixed(2);
            document.getElementById("totalProfit").value = data.profitAmount.toFixed(2);
            document.getElementById("suggestedSellingPrice").value = data.suggestedSellingPrice.toFixed(2);
            document.getElementById("profitPercentageBox").textContent = `${data.profitPercentage}%`;
        })
        .catch(error => console.error('Error:', error));
    });
});
