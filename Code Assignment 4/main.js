var input = [];
var serialNo = 1;
var allTotalAmount = 0;
var fullAmount = 0;
var gstNoInput = document.getElementById("gstNo");
var add1 = document.getElementById("address");
var add2 = document.getElementById("address2");
var pin = document.getElementById("pincode");
var d = document.getElementById("date");
var invoice_data = document.getElementById("invoice");

function addRow() {
    // Extracting input values
    let description = document.getElementById("description").value;
    let unit = document.getElementById("unit").value;
    let qty = document.getElementById("qty").value;
    let rate = document.getElementById("rate").value;
    let amount = parseFloat(qty) * parseFloat(rate);
    let cgstPercentage = parseFloat(document.getElementById("cgst").value);
    let sgstPercentage = parseFloat(document.getElementById("sgst").value);
    let cgst = (amount * cgstPercentage) / 100;
    let sgst = (amount * sgstPercentage) / 100;
    let totalGst = cgst + sgst;
    let grandTotal = amount + cgst + sgst;
    let gst = cgstPercentage + sgstPercentage;
    let supplierName = document.getElementById("supplierName").value;

    // Extracting additional input values
    let invoice_data = document.getElementById("invoice").value;
    let date = document.getElementById("date").value;
    let address = document.getElementById("address").value;
    let address2 = document.getElementById("address2").value;
    let pincode = document.getElementById("pincode").value;
    let gstNo = document.getElementById("gstNo").value;

    // Inserting new row into the table
    var table = document.getElementById("dataTable");
    var newRow = table.insertRow(table.rows.length);
    var cells = [
        serialNo++,
        invoice_data,
        date,
        description,
        unit,
        qty,
        rate,
        amount.toFixed(2),
        cgst.toFixed(2),
        sgst.toFixed(2),
        grandTotal.toFixed(2),
        supplierName,
        address,
        address2,
        pincode,
        gstNo,
        cgstPercentage,
        sgstPercentage,
    ];

    // Inserting cell data into the new row
    cells.forEach((cell, index) => {
        var newCell = newRow.insertCell(index);
        newCell.textContent = cell;
        newCell.classList.add("py-3", "px-4", "border", "border-white", "break-all", "whitespace-nowrap", "text-sm");
    });

    // Pushing data to input array
    input.push({
        date,
        invoice_data,
        description,
        unit,
        qty,
        rate,
        amount: amount.toFixed(2),
        cgst: cgst.toFixed(2),
        sgst: sgst.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
        gst,
        totalGst,
        supplierName,
        address,
        address2,
        pincode,
        gstNo,
        cgstPercentage,
        sgstPercentage,
    });

    // Updating total amounts
    fullAmount += amount;
    allTotalAmount += grandTotal;
    document.getElementById("allTotalAmount").value = allTotalAmount.toFixed(2);

    // Inserting delete button
    var deleteButtonCell = newRow.insertCell(cells.length);
    deleteButtonCell.appendChild(addDeleteButton(newRow));
    deleteButtonCell.classList.add("py-3", "px-4", "border", "border-white", "text-center");

    // Clearing input fields
    clearInputFields();
}

function clearInputFields() {
    document.getElementById("description").value = "";
    document.getElementById("unit").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("cgst").value = "";
    document.getElementById("sgst").value = "";
    document.getElementById("supplierName").value = "";
}

function addDeleteButton(row) {
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600";
    deleteButton.onclick = function () {
        removeRow(row);
    };
    return deleteButton;
}


function removeRow(row) {
    var table = document.getElementById("dataTable");
    var index = row.rowIndex;

    // Subtract the deleted row's grandTotal from allTotalAmount
    var grandTotalToRemove = parseFloat(
        table.rows[index].cells[9].textContent
    );
    allTotalAmount -= grandTotalToRemove;
    document.getElementById("allTotalAmount").value =
        allTotalAmount.toFixed(2);

    table.deleteRow(index);
    serialNo--;

    // Update the S.no column in the table
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[0].textContent = i;
    }

    // Remove the corresponding item from input array
    input.splice(index - 1, 1);
    console.log(input);
}

function generateExcel() {
    var table = document.getElementById("dataTable");
    var data = [
        [
            "S.no",
            "Invoice no",
            "Date",
            "Description",
            "Unit",
            "Qty",
            "Rate",
            "Amount",
            "CGST",
            "SGST",
            "Grand Total",
            "Supplier Name",
            "Address Line-1",
            "Address Line-2",
            "Pincode",
            "GST No",
            "CGST %",
            "SGST %",
        ],
    ];

    for (var i = 1; i < table.rows.length; i++) {
        var rowData = [];
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            rowData.push(table.rows[i].cells[j].textContent);
        }
        data.push(rowData);
    }

    // Create a new Excel workbook
    var workbook = XLSX.utils.book_new();

    // Add data to a new worksheet
    var worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice Data");

    // Save the workbook as an Excel file
    XLSX.writeFile(workbook, "invoice_data.xlsx");
}

function generatePDF() {
    // Retrieve values from input fields
    var table = document.getElementById("dataTable");
    var row1 = "  ";
    var gstNo = document.getElementById("gstNo").value;
    var add1 = document.getElementById("address").value;
    var add2 = document.getElementById("address2").value;
    var add2 = document.getElementById("address2").value;
    var pin = document.getElementById("pincode").value;
    var d = document.getElementById("date").value;
    var invoice = document.getElementById("invoice").value;

    // Define table HTML content
    var tableContent = `
<h1 style="font-size: 40px; font-weight: 500; text-align: center;">Tax Invoice</h1>
<table border="1" cellspacing="0" cellpadding="0" class="container">
<tr>
<td colspan="3" align="center" class="data" style="font-size: 25px;font-weight: 600"><strong>MURUGAPPA AGENCY</strong></td>
</tr>
<tr>
<td colspan="3" align="center" class="data">136A, ELANGO STREET, MURUGAPPA NAGAR, ERNAVOOR,</td>
</tr>
<tr>
<td colspan="3" align="center" class="data">CHENNAI : 60057.</td>
</tr>
<tr>
<td colspan="3" align="center" class="data"><strong>INVNO : ${invoice}</strong></td>
</tr>
<tr>
<td colspan="3" align="center" class="data"><strong>DATE : ${d}</strong></td>
</tr>
<tr>
<td rowspan="4" valign="top" class="data"><strong>INVOICE TO</strong></td>
<td colspan="2" class="data"><strong>OUR DETAILS,</strong></td>
</tr>
<tr>
<td colspan="2" class="data">GST NO : 33BGOPP7961C1Z4,</td>
</tr>
<tr>
<td colspan="2" class="data">EMAIL : meenakshipalam@gmail.com,</td>
</tr>
<tr>
<td colspan="2" class="data">Cellno : 7871915511</td>
</tr>
<tr>
<td colspan="3" class="data data1"><strong>${add1},</strong></td>
</tr>
<tr>
<td colspan="3" class="data data1">${add2},</td>
</tr>
<tr>
<td colspan="3" class="data data1">Chennai - ${pin}</td>
</tr>
<tr>
<td colspan="3" class="data">GST : ${gstNo}</td>
</tr>
</table>`;

    var items = `
<table class="container">
<thead>
<tr>
    <td>S.NO</td>
    <td>Description</td>
    <td>QTY</td>
    <td>Price(Each)</td>
    <td>GST(%)</td>
    <td class="right-align">Total</td>
</tr>
</thead>
<tbody>
${input
            .map(
                (row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${row.description}</td>
        <td>${row.qty} ${row.unit}</td>
        <td>${row.rate}</td>
        <td>${row.gst}</td>
        <td>${row.grandTotal}</td>
      </tr>
      `
            )
            .join("")}
  <tr>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  </tr>

   
  <tr>
  <td class="empty">${row1}</td>
  <td><strong>TOTAL <strong>(Without GST)</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td>${fullAmount.toFixed(2)}</td>
  </tr>

  ${input
            .map(
                (row) => `
  <tr>
    <td class="empty">${row1}</td>
    <td><strong>CGST%:</strong>${row.cgstPercentage}</td>
    <td><strong>SGST%:</strong>${row.sgstPercentage}</td>
    <td><strong>CGST:</strong>${row.cgst}</td>  
    <td><strong>SGST:</strong>${row.sgst}</td>
    <td>${row.totalgst}</td>
  <tr>
    `
            )
            .join("")}

  <tr>
  <td class="empty">${row1}</td>
  <td><strong>GRAND TOTAL:<strong></td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td>${allTotalAmount.toFixed(2)}</td>
  </tr>

  <tr>
  <td class="empty">${row1}</td>
  <td><strong>TERMS & CONDITIONS <strong></td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  </tr> 
  
  <tr>
  <td class="empty">${row1}</td>
  <td>PAYMENT : WITHIN 15 DAYS</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  </tr>

  <tr>
  <td class="empty">${row1}</td>
  <td>TAX : AS APPLICABLE</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  <td class="empty">${row1}</td>
  </tr>
  

  </table>
</tbody>
</table>
`;

    // Combine supplier details and table into a single HTML content
    var pdfContent = `
<div>
    ${tableContent}
    ${items}
</div>`;

    var options = {
        margin: 10,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 8, logging: true, dpi: 800 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate PDF from HTML content
    html2pdf().from(pdfContent).set(options).save();
}