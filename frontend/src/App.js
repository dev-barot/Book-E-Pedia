import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminNavbar from "./components/AdminPanel/AdminNavbar/AdminNavbar";
import AdminSidebar from "./components/AdminPanel/AdminSidebar/AdminSidebar";
import AdminDashboard from "./components/AdminPanel/AdminDashboard/AdminDashboard";

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/HomeScreen/Home';
import Login from './components/LoginScreen/Login';


// Admin Panel
import AdminDashboard from './components/AdminPanel/AdminDashboard/AdminDashboard';
import AdminManageCategory from './components/AdminPanel/AdminManageCategory/AdminManageCategory';
import AdminManageEmployees from './components/AdminPanel/AdminManageEmployees/AdminManageEmployees';
import AdminManageFeedback from './components/AdminPanel/AdminManageFeedback/AdminManageFeedback';
import AdminManageOrders from './components/AdminPanel/AdminManageOrders/AdminManageOrders';
import AdminManageProducts from './components/AdminPanel/AdminManageProducts/AdminManageProducts';
import AdminProfile from './components/AdminPanel/AdminProfile/AdminProfile';
import AdminViewCustomers from './components/AdminPanel/AdminViewCustomers/AdminViewCustomers';
import Reports from './components/AdminPanel/Reports/Reports';
import AdminManageBookType from './components/AdminPanel/AdminManageBookType/AdminManageBookType';
import AdminAddCategory from './components/AdminPanel/AdminManageCategory/AdminAddCategory';
import AdminAddBookType from './components/AdminPanel/AdminManageBookType/AdminAddBookType';
import AdminAddEmployees from './components/AdminPanel/AdminManageEmployees/AdminAddEmployees';
import AdminAddProducts from './components/AdminPanel/AdminManageProducts/AdminAddProducts';
import Technology from "./components/CategoryScreen/Technology";


function App() {
  return (
    <BrowserRouter>
      <AdminNavbar />
      <AdminSidebar />

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path="/" element={<AdminDashboard />} />
        <Route exact path='/login' element={<Login />} />

        
          {/* Admin */}
          <Route exact path='/admin/dashboard' element={<AdminDashboard />} />
          <Route exact path='/admin/manage-orders' element={<AdminManageOrders />} />
          <Route path="/admin/manage-categories" element={<AdminManageCategory categories={categories} onAddCategory={handleAddCategory} />} />
          <Route path="/admin/add-category" element={<AdminAddCategory onAddCategory={handleAddCategory} />} />
          <Route path="/admin/manage-booktype" element={<AdminManageBookType bookTypes={bookTypes} onAddBookType={handleAddBookType} />} />
          <Route path="/admin/add-booktype" element={<AdminAddBookType onAddBookType={handleAddBookType} />} />
          <Route exact path='/admin/manage-products' element={<AdminManageProducts products={products} />} />
          <Route exact path='/admin/add-products' element={<AdminAddProducts onAddProduct={handleAddProduct} />} />
          <Route path="/admin/manage-employees" element={<AdminManageEmployees employeeList={employeeList} onAddEmployee={handleAddEmployee} />} />
          <Route path="/admin/add-employees" element={<AdminAddEmployees onAddEmployee={handleAddEmployee} />} />
          <Route exact path='/admin/view-customers' element={<AdminViewCustomers />} />
          <Route exact path='/admin/profile' element={<AdminProfile />} />
          <Route exact path='/admin/manage-feedback' element={<AdminManageFeedback />} />
          <Route exact path='/admin/reports' element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
