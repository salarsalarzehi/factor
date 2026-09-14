// تابع تبدیل اعداد انگلیسی به فارسی
function toPersianNum(num) {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, x => farsiDigits[x]);
}

// تابع جداکننده هزارگان و تبدیل به ارقام فارسی
function formatNumber(num) {
    if (isNaN(num) || num === "") return "۰";
    let parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return toPersianNum(parts.join("."));
}

// تابع محاسبه مبالغ، مالیات و جمع کل
function calculate() {
    let rows = document.querySelectorAll("#items-body tr");
    let subTotal = 0;

    rows.forEach((row) => {
        let priceInput = row.querySelector(".price");
        let qtyInput = row.querySelector(".qty");
        let discountInput = row.querySelector(".discount");
        
        let rawPrice = priceInput.value.replace(/,/g, '');
        let price = parseFloat(rawPrice) || 0;
        let qty = parseFloat(qtyInput.value) || 0;
        let discount = parseFloat(discountInput.value) || 0;
        
        let total = (price * qty) - discount;
        row.querySelector(".row-total").innerText = formatNumber(total);
        subTotal += total;
    });

    let tax = subTotal * 0.10; // محاسبه ۱۰ درصد مالیات بر ارزش افزوده
    let grandTotal = subTotal + tax;

    document.getElementById("sub-total").innerText = formatNumber(subTotal);
    document.getElementById("tax-amount").innerText = formatNumber(tax);
    document.getElementById("grand-total").innerText = formatNumber(grandTotal);
}

// مدیریت کاماسازی زنده هنگام تایپ در فیلد قیمت
document.addEventListener("input", function(e) {
    if (e.target.classList.contains("price")) {
        let val = e.target.value.replace(/,/g, '');
        if (!isNaN(val) && val !== "") {
            e.target.value = Number(val).toLocaleString();
        }
        calculate();
    }
    if (e.target.classList.contains("qty") || e.target.classList.contains("discount")) {
        calculate();
    }
});

// تابع افزودن سطر جدید به جدول کالاها
function addRow() {
    let tbody = document.getElementById("items-body");
    let rowCount = tbody.rows.length + 1;
    
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${toPersianNum(rowCount)}</td>
        <td><input type="text" class="item-desc fillable-field" placeholder="نام و شرح محصول..."></td>
        <td><input type="text" class="price fillable-field" value="" placeholder="۰"></td>
        <td><input type="number" class="qty fillable-field" value="1" placeholder="۱"></td>
        <td><input type="number" class="discount fillable-field" value="" placeholder="۰"></td>
        <td class="row-total">۰</td>
    `;
    tbody.appendChild(newRow);
}

// اجرای محاسبات اولیه هنگام بارگذاری صفحه
window.onload = function() {
    calculate();
};
