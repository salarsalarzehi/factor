// تابع تبدیل اعداد انگلیسی به فارسی
function toPersianNum(num) {
    if (num === null || num === undefined) return "۰";
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, x => farsiDigits[x]);
}

// تابع تبدیل اعداد فارسی به انگلیسی (برای محاسبات پشت صحنه)
function toEnglishNum(str) {
    if (!str) return "";
    const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    let englishStr = str.toString();
    for (let i = 0; i < 10; i++) {
        englishStr = englishStr.replace(persianDigits[i], i);
    }
    return englishStr;
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
        
        // پاکسازی کاماها و تبدیل اعداد فارسی احتمالی به انگلیسی برای انجام محاسبه ریاضی
        let rawPrice = toEnglishNum(priceInput.value.replace(/,/g, ''));
        let rawQty = toEnglishNum(qtyInput.value);
        let rawDiscount = toEnglishNum(discountInput.value);

        let price = parseFloat(rawPrice) || 0;
        let qty = parseFloat(rawQty) || 0;
        let discount = parseFloat(rawDiscount) || 0;
        
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

// مدیریت هوشمند ورود اعداد، کاماسازی قیمت و تبدیل خودکار به ارقام فارسی
document.addEventListener("input", function(e) {
    if (e.target.classList.contains("price")) {
        let val = toEnglishNum(e.target.value.replace(/,/g, ''));
        if (!isNaN(val) && val !== "") {
            // اعمال کاما و تبدیل به ارقام فارسی به صورت همزمان
            let formatted = Number(val).toLocaleString();
            e.target.value = toPersianNum(formatted);
        }
        calculate();
    }
    else if (e.target.classList.contains("qty") || e.target.classList.contains("discount")) {
        let val = toEnglishNum(e.target.value);
        // تبدیل ارقام تایپ شده (چه با بالای کیبورد چه سمت راست) به فارسی
        e.target.value = toPersianNum(val);
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
        <td><input type="text" class="qty fillable-field" value="" placeholder="۱"></td>
        <td><input type="text" class="discount fillable-field" value="" placeholder="۰"></td>
        <td class="row-total">۰</td>
    `;
    tbody.appendChild(newRow);
}

// اجرای محاسبات اولیه هنگام بارگذاری صفحه
window.onload = function() {
    calculate();
};
