import React from 'react';
import './Invoice.css'; // Import the CSS file

const Invoice = () => {
    return (
        <div className="invoice">
        <div className="invoice-invoice-container">
            <div className="invoice-header">
                <h1>Invoice</h1>
            </div>

            <div className="invoice-details">
                {/* Left Section */}
                <div className="invoice-left">
                    <p><strong>Sold By:</strong> John Doe</p>
                    <p><strong>Retailer Address:</strong> 123 Retail St, City, Country</p>
                    <div className="invoice-gap"></div>
                    <p><strong>GST No.:</strong> 123456789</p>
                    <div className="invoice-gap"></div>
                    <p><strong>Order No.:</strong> 987654321</p>
                    <p><strong>Order Date:</strong> 2023-10-01</p>
                </div>
                {/* Right Section */}
                <div className="invoice-right">
                    <p><strong>Shipping Address:</strong></p>
                    <p>456 Customer Rd, City, Country</p>
                    <p><strong>Customer Address:</strong></p>
                    <p>789 Customer Ave, City, Country</p>
                    <p><strong>Invoice No.:</strong> INV-001</p>
                    <p><strong>Invoice Date:</strong> 2023-10-02</p>
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
                        <th>Tax Rate</th>
                        <th>Tax Type</th>
                        <th>Tax Amount</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key="1">
                        <td>1</td>
                        <td>Book Title</td>
                        <td>Physical</td>
                        <td>---</td>
                        <td>Rs. 20.00</td>
                        <td>1</td>
                        <td>Rs. 20.00</td>
                        <td>10%</td>
                        <td>GST</td>
                        <td>Rs. 2.00</td>
                        <td>Rs. 22.00</td>
                    </tr>
                    <tr key="2">
                        <td>2</td>
                        <td>Audio Book</td>
                        <td>Audio</td>
                        <td>1 Month</td>
                        <td>Rs. 15.00</td>
                        <td>1</td>
                        <td>Rs. 15.00</td>
                        <td>10%</td>
                        <td>GST</td>
                        <td>Rs. 1.50</td>
                        <td>Rs. 16.50</td>
                    </tr>
                </tbody>
            </table>

            <div className="invoice-total">
                <p><strong>Total Amount:</strong> Rs. 38.50</p>
                <p><strong>Total Amount in Words:</strong> Thirty-Eight Rupees and Fifty Cents</p>
            </div>

            <div className="invoice-payment">
                <p><strong>Payment Mode:</strong> Credit Card</p>
                <p><strong>Transaction ID:</strong> TXN-123456</p>
            </div>

            <div className="invoice-signature">
                <div className="invoice-sold-by">
                    For John Doe
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