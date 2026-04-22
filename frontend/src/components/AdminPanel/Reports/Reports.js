import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../AdminCommon.css";
import "./Reports.css";

const columnNameMappings = {
  Order_ID: "Order ID",
  MasterOrder_ID: "Master Order ID",
  MasterOrder_ID__Order_DateTime: "Order Date",
  MasterOrder_ID__Order_Status: "Order Status",
  MasterOrder_ID__Cust_ID__Fname: "Customer First Name",
  MasterOrder_ID__Cust_ID__Lname: "Customer Last Name",
  Product_ID__Product_Name: "Product Name",
  Product_ID__Category_ID__Category_Name: "Category Name",
  Product_Price: "Product Price",
  Product_Quantity: "Quantity",
  T_amount: "Total Amount",
  Payment_Date: "Payment Date",
  Payment_Mode: "Payment Mode",
  Payment_Status: "Payment Status",
  Transaction_ID: "Transaction ID",
  Cust_ID: "Customer ID",
  Fname: "First Name",
  Lname: "Last Name",
  Gender: "Gender",
  DOB: "Date of Birth",
  Email: "Email Address",
  Phone_Number: "Phone Number",
  City: "City",
  State: "State",
  Country: "Country",
  Product_ID: "Product ID",
  Product_Name: "Product Name",
  Category_ID__Category_Name: "Category",
  Book_ID__Book_Name: "Book Format",
  Stock: "Stock",
  Category_ID: "Category ID",
  Category_Name: "Category Name",
  Category_Description: "Description",
  IsActive: "Is Active",
};

const cleanColumnName = (key) => {
  if (columnNameMappings[key]) return columnNameMappings[key];

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
  const [selectedReport, setSelectedReport] = useState("order");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isLoading, setIsLoading] = useState(false);

  // Check if temporal to show date filters
  const isTemporal = ["order", "payment"].includes(selectedReport);

  const fetchReportData = () => {
    setIsLoading(true);
    let url = `http://127.0.0.1:8000/api/get_report_data/${selectedReport}/`;

    const params = new URLSearchParams();
    if (isTemporal && startDate) params.append("start_date", startDate);
    if (isTemporal && endDate) params.append("end_date", endDate);

    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setReportData(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching report data:", error);
        setReportData([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line
  }, [selectedReport]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const sortData = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
    const sortedData = [...reportData].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Handle nulls
      if (aValue === null) aValue = "";
      if (bValue === null) bValue = "";

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setReportData(sortedData);
  };

  const formatCellValue = (value) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean" || value === "1" || value === "0") {
      if (value === true || value === "1") return <span className="status-badge active" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}>Yes</span>;
      if (value === false || value === "0") return <span className="status-badge inactive" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>No</span>;
    }
    return value;
  };

  const downloadPDF = () => {
    if (reportData.length === 0) return;
    const doc = new jsPDF("landscape");
    const tableColumn = Object.keys(reportData[0] || {}).map(cleanColumnName);
    const tableRows = reportData.map(row => Object.values(row));

    doc.text(`System Report: ${selectedReport.toUpperCase()}`, 14, 15);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20, theme: "grid", headStyles: { fillColor: [31, 78, 121] } });
    doc.save(`${selectedReport}_report.pdf`);
  };

  const downloadCSV = () => {
    if (reportData.length === 0) return;
    const items = reportData;
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(items[0]);
    const csv = [
      header.map(cleanColumnName).join(','),
      ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${selectedReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Ambient glass background */}
      <div className="dashboard-ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content reports-content-area ${isSidebarCollapsed ? "expanded" : ""}`}>

        {/* Header Section */}
        <div className="admin-header-titles">
          <h1 className="text-gradient-lux">Insight &amp; Analytics Reports</h1>
          <p>Generate, filter, and export detailed system data.</p>
        </div>

        {/* Filter Toolbar (Glassmorphism Card) */}
        <div className="reports-toolbar glass-card">
          <div className="toolbar-controls">
            <div className="filter-group">
              <label>Report Type</label>
              <select
                className="lux-input"
                value={selectedReport}
                onChange={(e) => {
                  setSelectedReport(e.target.value);
                  setStartDate("");
                  setEndDate("");
                }}
              >
                <option value="order">Orders Report</option>
                <option value="payment">Payments Report</option>
                <option value="customer">Customers Report</option>
                <option value="product">Products Status Report</option>
                <option value="category">Categories Report</option>
              </select>
            </div>

            {isTemporal && (
              <div className="filter-group date-filters animate-fade-in">
                <div className="date-field">
                  <label>Start Date</label>
                  <input type="date" className="lux-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="date-field">
                  <label>End Date</label>
                  <input type="date" className="lux-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            )}

            <div className="filter-group button-group">
              <button onClick={fetchReportData} className="btn-primary-lux fetch-btn">
                <i className="fa-solid fa-rotate"></i> Fetch Data
              </button>
            </div>
          </div>

          <div className="export-controls">
            <button
              onClick={downloadPDF}
              className="btn-lux-outline pdf-btn"
              disabled={reportData.length === 0}
            >
              <i className="fa-regular fa-file-pdf"></i> PDF
            </button>
            <button
              onClick={downloadCSV}
              className="btn-lux-outline csv-btn"
              disabled={reportData.length === 0}
            >
              <i className="fa-solid fa-file-csv"></i> CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="admin-table-wrapper glass-card reports-table-wrapper">
          {isLoading ? (
            <div className="reports-loading-state">
              <div className="loader-spinner"></div>
              <p>Aggregating data...</p>
            </div>
          ) : reportData.length === 0 ? (
            <div className="empty-state-cell" style={{ padding: '3rem' }}>
              <div className="empty-state-content">
                <i className="fa-solid fa-folder-open empty-icon"></i>
                <p>No records found for the selected criteria.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-wrapper">
              <table className="admin-lux-table reports-lux-table">
                <thead>
                  <tr>
                    {Object.keys(reportData[0]).map((key) => (
                      <th
                        key={key}
                        onClick={() => sortData(key)}
                        className={sortConfig.key === key ? "sorted-col" : ""}
                      >
                        {cleanColumnName(key)}
                        <span className="sort-indicator">
                          {sortConfig.key === key ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      {Object.keys(item).map((key, idx) => (
                        <td key={idx}>{formatCellValue(item[key])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reports;
