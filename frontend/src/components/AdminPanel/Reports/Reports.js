import React, { useState, useEffect } from "react";
import "./Reports.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const columnNameMappings = {
  MasterOrder_ID: "MasterOrder ID",
  MasterOrder_ID_id: "Order ID (Ref)",
  Payment_Date: "Payment Date",
  Payment_Mode: "Payment Mode",
  Payment_Status: "Payment Status",
  Transaction_ID: "Transaction ID",
  Cust_ID: "Customer ID",
  Cust_Fname: "Customer First Name",
  Cust_Lname: "Customer Last Name",
  Product_ID: "Product ID",
  Product_Name: "Product Name",
  Category_ID: "Category ID",
  Category_Name: "Category Name",
  Product_Price: "Product Price",
  Product_Quantity: "Product Quantity",
  Total_Amount: "Total Amount",
  IsActive: "Is Active",
  DOB: "Date of Birth"
};

const cleanColumnName = (key) => {
  let cleanKey = key.split("__").pop();
  let normalizedKey = cleanKey.toLowerCase();
  let mappedKey = Object.keys(columnNameMappings).find(
    (k) => k.toLowerCase() === normalizedKey
  );
  return mappedKey
    ? columnNameMappings[mappedKey]
    : cleanKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const Reports = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };


  const [selectedReport, setSelectedReport] = useState("customer");
  const [reportData, setReportData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    fetchReportData(selectedReport);
  }, [selectedReport]);

  const fetchReportData = (reportType) => {
    fetch(`http://127.0.0.1:8000/api/get_report_data/${reportType}/`)
      .then((response) => response.json())
      .then((data) => setReportData(data))
      .catch((error) => console.error("Error fetching report data:", error));
  };

  const sortData = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
    const sortedData = [...reportData].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setReportData(sortedData);
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
      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>


    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="bg-white/30 backdrop-blur-md shadow-xl rounded-2xl p-6 max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold text-black mt-4 mb-6 drop-shadow-lg">
          📊 Generate Reports
        </h1>

        <div className="mb-6">
          <select
            className="p-3 border rounded-lg text-black"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <option value="customer">Customer Report</option>
            <option value="order">Order Report</option>
            <option value="payment">Payment Report</option>
          </select>
        </div>

        <div className="flex gap-4 mb-6" style={{padding:'8px'}}>
          <button
            onClick={downloadPDF}
            className="px-6 py-3 text-white bg-red-500 hover:bg-red-700 rounded-lg shadow-md transition transform duration-300" style={{background:'crimson'}}
          >
            📄 Download PDF 
          </button>   <button
            onClick={downloadCSV}
            className="px-6 py-3 text-white font-medium bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-md hover:scale-105 transition transform duration-300" style={{background:'green'}}
          >
            📊 Download CSV
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-indigo-600 text-white text-lg">
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
                <tr
                  key={index}
                  className="border-t even:bg-gray-100 odd:bg-gray-200 hover:bg-gray-300 transition"
                >
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
