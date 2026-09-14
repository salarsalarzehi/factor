function calculate() {
    let rows = document.querySelectorAll("#items-body tr");
    let subTotal = 0;

    rows.forEach((row, index) => {
        let price = parseFloat(row.querySelector(".price").value) || 0;
        let qty = parseFloat(row.querySelector(".qty").value) || 0;
        let discount = parseFloat(row.querySelector(".discount").value) || 0;
        
        let total = (price * qty) - discount;
        row.querySelector(".row-total").innerText = total.toLocaleString();
        subTotal += total;
    });

    let tax = subTotal * 0.10; // محاسبه 10 درصد مالیات بر ارزش افزوده
    let grandTotal = subTotal + tax;

    document.getElementById("sub-total").innerText = subTotal.toLocaleString();
    document.getElementById("tax-amount").innerText = tax.toLocaleString();
    document.getElementById("grand-total").innerText = grandTotal.toLocaleString();
}

function addRow() {
    let tbody = document.getElementById("items-body");
    let rowCount = tbody.rows.length + 1;
    
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" placeholder="شرح کالا"></td>
        <td><input type="number" class="price" value="0" oninput="calculate()"></td>
        <td><input type="number" class="qty" value="1" oninput="calculate()"></td>
        <td><input type="number" class="discount" value="0" oninput="calculate()"></td>
        <td class="row-total">۰</td>
    `;
    tbody.appendChild(newRow);
}
