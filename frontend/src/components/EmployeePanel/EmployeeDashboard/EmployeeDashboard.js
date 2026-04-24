import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "../../AdminPanel/AdminDashboard/AdminDashboard.css";
import "../EmployeeCommon.css";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { BASE_URL } from "../../../utils/config";

function EmployeeDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    total_customers: 0,
    total_products: 0,
    total_categories: 0,
    total_orders: 0,
    total_sales: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [fulfillmentRate, setFulfillmentRate] = useState(0);
  const [lowStock, setLowStock] = useState([]);

  // Chart states
  const [revenueData, setRevenueData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendingChartData, setTrendingChartData] = useState([]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [countsRes, ordersRes, productsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/admin/dashboard-counts/`),
          fetch(`${BASE_URL}/api/admin/orders/`),
          fetch(`${BASE_URL}/api/products/`)
        ]);
        const trendingRes = await fetch(`${BASE_URL}/api/admin/trending-books/`);
        const trendingData = await trendingRes.json();

        const tBooks = trendingData.books || [];

        // Horizontal Bar Chart Aggregation
        setTrendingChartData(tBooks.slice(0, 5).map(b => ({
          name: b.name.length > 15 ? b.name.substring(0, 15) + "..." : b.name,
          orders: b.total
        })));

        // Update dashboard counts
        if (countsRes.ok) {
          const dData = await countsRes.json();
          setDashboardData(dData);
          setFulfillmentRate(dData.fulfillment_rate || 0);
        }

        const lowStockRes = await fetch(`${BASE_URL}/api/admin/low-stock/`);
        const lowStockData = await lowStockRes.json();
        setLowStock(lowStockData.products || []);

        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          const orderArr = orders.orders || [];

          setRecentOrders([...orderArr]
            .sort((a, b) => b.MasterOrder_ID - a.MasterOrder_ID)
            .slice(0, 5)
          );

          // Aggregate Revenue Trend Data
          const trendData = [...orderArr]
            .filter(o => o.Order_Status !== "Cancelled")
            .sort((a, b) => a.MasterOrder_ID - b.MasterOrder_ID)
            .slice(-15) // Recent 15 successful orders stream
            .map((o) => ({
              name: `Ord #${o.MasterOrder_ID}`,
              revenue: parseFloat(o.T_Amount) || 0
            }));
          setRevenueData(trendData.length > 0 ? trendData : [{ name: "No Data", revenue: 0 }]);

          // Aggregate Order Status Pie Data
          const statusCounts = orderArr.reduce((acc, o) => {
            acc[o.Order_Status] = (acc[o.Order_Status] || 0) + 1;
            return acc;
          }, {});

          const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
          const pData = Object.keys(statusCounts).map((key, index) => ({
            name: key,
            value: statusCounts[key],
            color: COLORS[index % COLORS.length]
          }));
          setStatusData(pData.length > 0 ? pData : [{ name: "No Data", value: 1, color: "#ccc" }]);
        }

        if (productsRes.ok) {
          const products = await productsRes.json();
          const pData = products.data || products || [];

          // Catalog Analytics Aggregation
          const catCounts = pData.reduce((acc, p) => {
            const cName = p.category_name || "Unknown";
            acc[cName] = (acc[cName] || 0) + 1;
            return acc;
          }, {});

          setCategoryData(Object.keys(catCounts).map(k => ({
            name: k,
            products: catCounts[k]
          })).sort((a, b) => b.products - a.products));
        }


      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ background: "rgba(255,255,255,0.9)", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
          <p className="label" style={{ margin: 0, fontWeight: "bold", color: "#1f2937" }}>{`${label}`}</p>
          <p className="intro" style={{ margin: 0, color: "#3b82f6" }}>{`₹${payload[0].value || payload[0].payload.products}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`} translate="no">
      <div className="dashboard-ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>

        <div className="admin-header-section">
          <div className="admin-header-titles">
            <br></br>
            <br></br>
            <h1 className="text-gradient-lux" >Employee Workspace</h1>
            <p>Welcome back. Real-time platform analytics & operational metrics.</p>
          </div>
        </div>

        {/* TOP METRICS GRID */}
        <div className="metrics-grid">
          <div className="metric-card glass-card">
            <div className="metric-card-inner">
              <div className="metric-icon-wrapper glow-blue">
                <i className="fa-solid fa-users"></i>
                <div className="icon-pulse"></div>
              </div>
              <div className="metric-info">
                <h3>Total Customers</h3>
                <h2 className="counter-value">{dashboardData.total_customers}</h2>
              </div>
              <div className="metric-decoration decor-blue"></div>
            </div>
          </div>

          <div className="metric-card glass-card">
            <div className="metric-card-inner">
              <div className="metric-icon-wrapper glow-purple">
                <i className="fa-solid fa-box-open"></i>
                <div className="icon-pulse"></div>
              </div>
              <div className="metric-info">
                <h3>Total Products</h3>
                <h2 className="counter-value">{dashboardData.total_products}</h2>
              </div>
              <div className="metric-decoration decor-purple"></div>
            </div>
          </div>

          <div className="metric-card glass-card">
            <div className="metric-card-inner">
              <div className="metric-icon-wrapper glow-green">
                <i className="fa-solid fa-layer-group"></i>
                <div className="icon-pulse"></div>
              </div>
              <div className="metric-info">
                <h3>Total Categories</h3>
                <h2 className="counter-value">{dashboardData.total_categories}</h2>
              </div>
              <div className="metric-decoration decor-green"></div>
            </div>
          </div>

          <div className="metric-card glass-card">
            <div className="metric-card-inner">
              <div className="metric-icon-wrapper glow-orange">
                <i className="fa-solid fa-cart-shopping"></i>
                <div className="icon-pulse"></div>
              </div>
              <div className="metric-info">
                <h3>Total Orders</h3>
                <h2 className="counter-value">{dashboardData.total_orders}</h2>
              </div>
              <div className="metric-decoration decor-orange"></div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION - CHARTS */}
        <div className="charts-grid border-glow">
          <div className="main-chart-panel glass-card panel-large">
            <div className="panel-header">
              <div className="panel-title-group">
                <div className="live-indicator">
                  <span className="recording-dot"></span> Live
                </div>
                <h2>Order Trends</h2>
                <p>Recent order stream performance overview</p>
              </div>
              <div className="panel-value-group">
                <span className="value-label">Total Revenue</span>
                <h2 className="massive-number text-gradient-lux">₹{dashboardData.total_sales}</h2>
              </div>
            </div>

            <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.4)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="side-data-panel glass-card panel-side">
            <div className="panel-header" style={{ marginBottom: "10px" }}>
              <h2><i className="fa-solid fa-chart-pie me-2 text-primary"></i> Order Status</h2>
            </div>

            <div style={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                    itemStyle={{ color: "#1f2937", fontWeight: "bold" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="health-section" style={{ marginTop: "20px" }}>
              <h4>Order Fulfillment Rate</h4>
              <div className="health-bar">
                <div
                  className="health-fill"
                  style={{ width: `${fulfillmentRate}%`, background: "linear-gradient(90deg, #10b981 0%, #34d399 100%)" }}
                ></div>
              </div>
              <p>{fulfillmentRate}% Orders Completed</p>
            </div>
          </div>
        </div>

        {/* CATALOG INSIGHTS GRID */}
        <div className="charts-grid border-glow" style={{ marginTop: "20px" }}>
          <div className="main-chart-panel glass-card panel-large">
            <div className="panel-header">
              <div className="panel-title-group">
                <h2>Product Diversity Overview</h2>
                <p>Volume of products distributed across catalog categories</p>
              </div>
            </div>
            <div style={{ width: '100%', height: 260, marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.4)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="products" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="side-data-panel glass-card panel-side">
            <div className="panel-header">
              <h2><i className="fa-solid fa-fire text-warning"></i> Trending Order Distribution</h2>
            </div>
            <div style={{ width: '100%', height: 250, marginTop: '10px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendingChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.4)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#1f2937", fontSize: 11, fontWeight: 500 }} width={90} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="orders" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM BLOCKS */}
        <div className="bottom-dashboard-grid mt-4" style={{ display: 'flex', gap: '20px' }}>
          <div className="glass-card panel-side" style={{ flex: 1 }}>
            <div className="panel-header" style={{ marginBottom: "20px" }}>
              <h2><i className="fa-solid fa-cart-shopping me-2"></i> Recent Orders</h2>
            </div>
            <div className="activity-list" style={{ paddingRight: "10px" }}>
              {recentOrders.length > 0 ? recentOrders.map((order, i) => {
                let statusColor = "optimal";
                if (order.Order_Status === "Pending" || order.Order_Status === "Processing") statusColor = "danger";
                else if (order.Order_Status === "Shipped") statusColor = "warning";

                return (
                  <div className="dashboard-list-item" key={i}>
                    <div className="item-left-info">
                      <div className="activity-icon-glass glow-blue"><i className="fa-solid fa-receipt"></i></div>
                      <div className="item-titles">
                        <h4>Order #{order.MasterOrder_ID} - Cust {order.Cust_ID}</h4>
                        <p>Amount: ₹{order.T_Amount}</p>
                      </div>
                    </div>
                    <span className={`status-badge ${statusColor}`}>{order.Order_Status}</span>
                  </div>
                );
              }) : <p className="text-muted text-center mt-4">No recent orders found.</p>}
            </div>
          </div>

          <div className="glass-card panel-side" style={{ flex: 1 }}>
            <div className="panel-header" style={{ marginBottom: "20px" }}>
              <h2><i className="fa-solid fa-triangle-exclamation me-2 text-danger"></i> Low Stock Alerts</h2>
            </div>
            <div className="activity-list">
              {lowStock.length === 0 ? (
                <p style={{ color: "green", fontWeight: 500, textAlign: "center", marginTop: "10px" }}>✓ All stock levels optimal</p>
              ) : (
                lowStock.map((item, index) => (
                  <div key={index} className="low-stock-item" style={{ display: "flex", gap: "15px", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <img
                      src={item.image ? (item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`) : "https://via.placeholder.com/40x55"}
                      alt={item.name}
                      style={{ width: "40px", height: "55px", borderRadius: "4px", objectFit: "cover" }}
                    />
                    <div className="low-stock-info">
                      <p style={{ margin: 0, fontWeight: 600, color: "#1f2937" }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: item.stock === 0 ? "#ef4444" : "#f59e0b", fontWeight: 500 }}>
                        {item.stock === 0 ? "Out of Stock" : `Only ${item.stock} left`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;
