import React, { useState } from "react";
import "./Reports.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const columnNameMappings = {
  Cust_ID: "Customer ID",
  Fname: "First Name",
  Lname: "Last Name",
  Email: "Email",
  MasterOrder_ID: "Order ID",
  Product_Name: "Product Name",
  Total_Amount: "Total Amount",
  Payment_Mode: "Payment Mode",
  Payment_Status: "Payment Status",
};

const cleanColumnName = (key) => {
  return columnNameMappings[key] || key.replace(/_/g, " ");
};

const Reports = () => {

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState("customer");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Demo Data (Frontend Only)
  const reportSamples = {
    customer: [
      { Cust_ID: 1, Fname: "John", Lname: "Doe", Email: "john@example.com" },
      { Cust_ID: 2, Fname: "Jane", Lname: "Smith", Email: "jane@example.com" }
    ],
    order: [
      { MasterOrder_ID: 101, Product_Name: "Book A", Total_Amount: 1200 },
      { MasterOrder_ID: 102, Product_Name: "Book B", Total_Amount: 800 }
    ],
    payment: [
      { MasterOrder_ID: 101, Payment_Mode: "UPI", Payment_Status: "Completed" },
      { MasterOrder_ID: 102, Payment_Mode: "Card", Payment_Status: "Pending" }
    ]
  };

  const reportData = reportSamples[selectedReport] || [];

  const sortData = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...reportData].sort((a, b) => {
      if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
      if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    reportSamples[selectedReport] = sortedData;
    setSortConfig({ key: column, direction });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = Object.keys(reportData[0] || {}).map(cleanColumnName);
    const tableRows = reportData.map(row => Object.values(row));

    autoTable(doc, { head: [tableColumn], body: tableRows });
    doc.save("report.pdf");
  };

  const downloadCSV = () => {
    const csvHeaders = Object.keys(reportData[0] || {}).map(cleanColumnName).join(",");
    const csvRows = reportData.map(row => Object.values(row).join(","));
    const csvContent = [csvHeaders, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>

      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 max-w-5xl w-full text-center">

          <h1 className="text-4xl font-bold mb-6">
            📊 Generate Reports
          </h1>

          <div className="mb-6">
            <select
              className="p-3 border rounded-lg"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="customer">Customer Report</option>
              <option value="order">Order Report</option>
              <option value="payment">Payment Report</option>
            </select>
          </div>

          <div className="flex gap-4 mb-6" style={{ padding: "8px" }}>
            <button
              onClick={downloadPDF}
              className="px-6 py-3 text-white rounded-lg"
              style={{ background: "crimson" }}
            >
              📄 Download PDF
            </button>

            <button
              onClick={downloadCSV}
              className="px-6 py-3 text-white rounded-lg"
              style={{ background: "green" }}
            >
              📊 Download CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white shadow-lg rounded-lg">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  {reportData.length > 0 &&
                    Object.keys(reportData[0]).map((key) => (
                      <th
                        key={key}
                        className="py-3 px-5 border cursor-pointer"
                        onClick={() => sortData(key)}
                      >
                        {cleanColumnName(key)}
                        {sortConfig.key === key && (
                          <span>
                            {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                          </span>
                        )}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index} className="border-t even:bg-gray-100">
                    {Object.keys(item).map((key, idx) => (
                      <td key={idx} className="py-3 px-5 border text-center">
                        {item[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Reports;
