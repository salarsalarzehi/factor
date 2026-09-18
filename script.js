function toPersianNum(num) {
    if (num === null || num === undefined) return "۰";
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, x => farsiDigits[x]);
}

function toEnglishNum(str) {
    if (!str) return "";
    const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    let englishStr = str.toString();
    for (let i = 0; i < 10; i++) {
        englishStr = englishStr.replace(persianDigits[i], i);
    }
    return englishStr;
}

function formatNumber(num) {
    if (isNaN(num) || num === "") return "۰";
    let parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return toPersianNum(parts.join("."));
}

// تابع دقیق تبدیل عدد به حروف فارسی
function NumberToWords(n) {
    if (n === 0 || isNaN(n)) return "صفر ریال";
    if (n < 0) n = Math.abs(n);

    let bخش = ['','هزار','میلیون','میلیارد','تریلیون'];
    let یکان‌ها = ['','یک','دو','سه','چهار','پنج','شش','هفت','هشت','نه'];
    let دهگان‌ها = ['','ده','بیست‌','سی‌','چهل‌','پنجاه‌','شصت‌','هفتاد‌','هشتاد‌','نود‌'];
    let ده‌ها = ['ده','یازده','دوازده','سیزده','چهارده','پانزده','شانزده','هفده','هجده','نوزده'];
    let صدگان‌ها = ['','صد','دویست','سیصد','چهارصد','پانصد','ششصد','هفتصد','هشتصد','نهصد'];

    function threeDigitsToWords(num) {
        let sb = [];
        let س = Math.floor(num / 100);
        let د_ی = num % 100;
        let د = Math.floor(د_ی / 10);
        let ی = د_ی % 10;

        if (س > 0) sb.push(صدگان‌ها[س]);
        if (د_ی >= 10 && د_ی <= 19) {
            sb.push(ده‌ها[د_ی - 10]);
        } else {
            if (د > 0) sb.push(دهگان‌ها[د]);
            if (ی > 0) sb.push(یکان‌ها[ی]);
        }
        return sb.join(' و ');
    }

    let s = n.toString();
    let parts = [];
    while (s.length > 0) {
        parts.push(s.slice(-3));
        s = s.slice(0, -3);
    }

    let wordParts = [];
    for (let i = 0; i < parts.length; i++) {
        let p = parseInt(parts[i]);
        if (p > 0) {
            let str = threeDigitsToWords(p);
            if (bخش[i] !== '') str += ' ' + bخش[i];
            wordParts.push(str);
        }
    }
    return wordParts.reverse().join(' و ') + ' ریال';
}

function calculate() {
    let rows = document.querySelectorAll("#items-body tr");
    let subTotal = 0;

    rows.forEach((row) => {
        let priceInput = row.querySelector(".price");
        let qtyInput = row.querySelector(".qty");
        let discountInput = row.querySelector(".discount");
        
        let rawPrice = toEnglishNum(priceInput.value.replace(/,/g, ''));
        let rawQty = toEnglishNum(qtyInput.value);
        let rawDiscount = toEnglishNum(discountInput.value.replace(/,/g, ''));

        let price = parseFloat(rawPrice) || 0;
        let qty = parseFloat(rawQty) || 0;
        let discount = parseFloat(rawDiscount) || 0;
        
        let total = (price * qty) - discount;
        if (total < 0) total = 0;

        row.querySelector(".row-total").innerText = formatNumber(total);
        subTotal += total;
    });

    let tax = subTotal * 0.10; // ۱۰ درصد مالیات
    let grandTotal = subTotal + tax;

    document.getElementById("sub-total").innerText = formatNumber(subTotal);
    document.getElementById("tax-amount").innerText = formatNumber(tax);
    document.getElementById("grand-total").innerText = formatNumber(grandTotal);
    
    // تبدیل خودکار مبلغ کل به حروف فارسی و قرار دادن در فیلد مربوطه
    let wordsResult = NumberToWords(Math.round(grandTotal));
    let wordsInput = document.getElementById("grand-total-words");
    if (wordsInput) {
        wordsInput.value = wordsResult;
        autoResizeTextarea(wordsInput);
    }
}

// تابع تنظیم خودکار ارتفاع تکست‌آریا
function autoResizeTextarea(el) {
    el.style.height = "auto";
    el.style.height = (el.scrollHeight) + "px";
}

// گوش دادن به تغییرات قیمت، تعداد و تخفیف و همچنین تکست‌آریاها
document.addEventListener("input", function(e) {
    if (e.target.classList.contains("price") || e.target.classList.contains("discount")) {
        let val = toEnglishNum(e.target.value.replace(/,/g, ''));
        if (!isNaN(val) && val !== "") {
            let formatted = Number(val).toLocaleString();
            e.target.value = toPersianNum(formatted);
        }
        calculate();
    }
    else if (e.target.classList.contains("qty")) {
        let val = toEnglishNum(e.target.value);
        e.target.value = toPersianNum(val);
        calculate();
    }
    else if (e.target.classList.contains("item-desc")) {
        autoResizeTextarea(e.target);
    }
});

// تابع اضافه کردن سطر جدید
function addRow() {
    let tbody = document.getElementById("items-body");
    let rowCount = tbody.rows.length + 1;
    
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td data-label="ردیف:">${toPersianNum(rowCount)}</td>
        <td data-label="کد کالا:"><input type="text" class="item-code fillable-field" value="..."></td>
        <td data-label="شرح کالا یا خدمت:"><textarea class="item-desc fillable-field">نام و شرح محصول...</textarea></td>
        <td data-label="تعداد:"><input type="text" class="qty fillable-field" value="۱"></td>
        <td data-label="واحد اندازه گیری:"><input type="text" class="unit fillable-field" value="عدد"></td>
        <td data-label="مبلغ واحد (ریال):"><input type="text" class="price fillable-field" value=""></td>
        <td data-label="تخفیف (ریال):"><input type="text" class="discount fillable-field" value=""></td>
        <td data-label="مبلغ کل (ریال):" class="row-total">۰</td>
        <td data-label="عملیات:"><button type="button" class="delete-btn" onclick="deleteRow(this)">حذف</button></td>
    `;
    tbody.appendChild(newRow);
    
    let newTextarea = newRow.querySelector(".item-desc");
    if (newTextarea) autoResizeTextarea(newTextarea);
}

// تابع حذف سطر مشخص
function deleteRow(button) {
    let row = button.closest("tr");
    row.remove();
    updateRowNumbers();
    calculate();
}

// تابع به‌روزرسانی شماره ردیف‌ها بعد از حذف
function updateRowNumbers() {
    let rows = document.querySelectorAll("#items-body tr");
    rows.forEach((row, index) => {
        let numCell = row.querySelector("td:first-child");
        if (numCell) {
            numCell.innerText = toPersianNum(index + 1);
        }
    });
}

// تابع درج خودکار تاریخ روز به صورت شمسی
function setCurrentDate() {
    let dateInput = document.getElementById("invoice-date");
    if (dateInput && !dateInput.value) {
        let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        let todayPersian = new Intl.DateTimeFormat('fa-IR', options).format(new Date());
        dateInput.value = todayPersian;
    }
}

// تابع پرینت سفارشی برای باز کردن کامل تکست‌آریاها قبل از چاپ
function triggerPrint() {
    document.querySelectorAll("textarea.item-desc, #grand-total-words").forEach(textarea => {
        textarea.style.height = "auto";
        textarea.style.height = (textarea.scrollHeight) + "px";
    });
    window.print();
}

window.onload = function() {
    calculate();
    setCurrentDate();
    
    document.querySelectorAll("textarea.item-desc, #grand-total-words").forEach(textarea => {
        autoResizeTextarea(textarea);
    });
};
