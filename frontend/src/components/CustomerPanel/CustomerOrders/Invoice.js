import React from "react";
import "./Invoice.css";

const Invoice = () => {

  // ✅ Dummy Order Data
  const invoiceData = {
    seller: "Book-E-Pedia Pvt Ltd",
    sellerAddress: "123 Retail St, Ahmedabad, India",
    gst: "24ABCDE1234F1Z5",
    orderNo: "ORD-1001",
    orderDate: "2024-02-10",
    invoiceNo: "INV-1001",
    invoiceDate: "2024-02-11",
    paymentMode: "Credit Card",
    transactionId: "TXN-987654",
    customerAddress: "Mit Sheth, 456 Gandhinagar, Gujarat, India",
    shippingAddress: "Mit Sheth, 456 Gandhinagar, Gujarat, India",
    taxRate: 10,
    items: [
      {
        id: 1,
        description: "The Alchemist",
        orderType: "Physical",
        timePeriod: "---",
        unitPrice: 300,
        quantity: 1,
      },
      {
        id: 2,
        description: "Harry Potter (Audio)",
        orderType: "Audio",
        timePeriod: "1 Month",
        unitPrice: 200,
        quantity: 2,
      },
    ],
  };

  // ✅ Calculations
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    invoiceData.items.forEach((item) => {
      const netAmount = item.unitPrice * item.quantity;
      const taxAmount = (netAmount * invoiceData.taxRate) / 100;

      subtotal += netAmount;
      totalTax += taxAmount;
    });

    const grandTotal = subtotal + totalTax;

    return {
      subtotal,
      totalTax,
      grandTotal,
    };
  };

  const { subtotal, totalTax, grandTotal } = calculateTotals();

  return (
    <div className="invoice">
      <div className="invoice-invoice-container">

        <div className="invoice-header">
          <h1>Invoice</h1>
        </div>

        <div className="invoice-details">

          <div className="invoice-left">
            <p><strong>Sold By:</strong> {invoiceData.seller}</p>
            <p><strong>Retailer Address:</strong> {invoiceData.sellerAddress}</p>
            <p><strong>GST No.:</strong> {invoiceData.gst}</p>
            <p><strong>Order No.:</strong> {invoiceData.orderNo}</p>
            <p><strong>Order Date:</strong> {invoiceData.orderDate}</p>
          </div>

          <div className="invoice-right">
            <p><strong>Shipping Address:</strong></p>
            <p>{invoiceData.shippingAddress}</p>
            <p><strong>Customer Address:</strong></p>
            <p>{invoiceData.customerAddress}</p>
            <p><strong>Invoice No.:</strong> {invoiceData.invoiceNo}</p>
            <p><strong>Invoice Date:</strong> {invoiceData.invoiceDate}</p>
          </div>

        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Description</th>
              <th>Order Type</th>
              <th>Time Period</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Net Amount</th>
              <th>Tax (10%)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => {
              const netAmount = item.unitPrice * item.quantity;
              const taxAmount = (netAmount * invoiceData.taxRate) / 100;
              const totalAmount = netAmount + taxAmount;

              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.description}</td>
                  <td>{item.orderType}</td>
                  <td>{item.timePeriod}</td>
                  <td>Rs. {item.unitPrice.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {netAmount.toFixed(2)}</td>
                  <td>Rs. {taxAmount.toFixed(2)}</td>
                  <td>Rs. {totalAmount.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="invoice-total">
          <p><strong>Subtotal:</strong> Rs. {subtotal.toFixed(2)}</p>
          <p><strong>Total Tax:</strong> Rs. {totalTax.toFixed(2)}</p>
          <p><strong>Grand Total:</strong> Rs. {grandTotal.toFixed(2)}</p>
        </div>

        <div className="invoice-payment">
          <p><strong>Payment Mode:</strong> {invoiceData.paymentMode}</p>
          <p><strong>Transaction ID:</strong> {invoiceData.transactionId}</p>
        </div>

        <div className="invoice-signature">
          <div className="invoice-sold-by">
            For {invoiceData.seller}
          </div>
          <div className="invoice-sign">
            Authorized Signatory
          </div>
        </div>

      </div>
    </div>
  );
};

export default Invoice;
