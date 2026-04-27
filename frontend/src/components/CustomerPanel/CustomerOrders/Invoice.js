import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Invoice.css";
import { BASE_URL } from "../../../utils/config";

const Invoice = () => {
  const location = useLocation();
  const orderData = location.state?.orderData || null;

  const [customerName, setCustomerName] = useState("Valued Customer");

  useEffect(() => {
    const cid = localStorage.getItem("customer_id");
    if (cid) {
      fetch(`${BASE_URL}/api/customer/${cid}/`)
        .then(res => res.json())
        .then(data => {
          if (data && data.Fname) {
            setCustomerName(data.Fname);
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  if (!orderData) {
    return (
      <div className="invoice" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: '#1A3B5C', marginBottom: '20px' }}>Invoice Not Found</h2>
        <p style={{ color: '#555', marginBottom: '30px' }}>Could not find order details. Please open the invoice directly from the Order History page.</p>
        <Link 
          to="/customer-dashboard/orders" 
          style={{ 
            background: '#1A3B5C', color: '#fff', padding: '10px 25px', 
            textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' 
          }}
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  // ✅ Maps Dynamic Data
  const invoiceData = {
    seller: "Book-E-Pedia Pvt Ltd",
    sellerAddress: "123 Retail St, Ahmedabad, India",
    gst: "24ABCDE1234F1Z5",
    orderNo: `ORD-${orderData.MasterOrder_ID}`,
    orderDate: "2026-04-16", // Mock order date as backend doesn't support timestamps yet
    invoiceNo: `INV-${orderData.MasterOrder_ID}-${Math.floor(100 + Math.random() * 900)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentMode: "Online Transaction",
    transactionId: `TXN-BP${orderData.MasterOrder_ID}0X99`,
    customerAddress: customerName,
    shippingAddress: customerName,
    taxRate: 12,
    items: orderData.products.map((p, index) => ({
      id: index + 1,
      description: p.name,
      orderType: p.orderType || "Standard",
      timePeriod: "---", // Digital products don't expire in this current DB model
      unitPrice: p.price,
      quantity: p.quantity,
    })),
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
            <p><strong>Customer details:</strong></p>
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
              <th>Type</th>
              <th>Time Period</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Net Amount</th>
              <th>Tax (12%)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item) => {
              const netAmount = item.unitPrice * item.quantity;
              const taxAmount = (netAmount * invoiceData.taxRate) / 100;
              const totalAmount = netAmount + taxAmount;

              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
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
