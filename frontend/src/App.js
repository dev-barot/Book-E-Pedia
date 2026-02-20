import React, { useState, useEffect } from "react";
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';

// Assets
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import book1 from "./components/ProductScreen/epic.jpeg";
// Website Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/HomeScreen/Home';
import AboutUs from './components/AboutUsScreen/AboutUs';
import ContactForm from './components/ContactUsScreen/contactUs';
import Login from './components/LoginScreen/Login';
import CustomerCart from './components/CustomerPanel/CustomerCart/CustomerCart';
import Products from './components/ProductScreen/Products';
import Categories from "./components/CategoryScreen/Category";
import CategoryProducts from "./components/CategoryScreen/CategoryProducts";
import ProductDetail from './components/ProductScreen/ProductDetail';
import AudioBook from "./components/ProductScreen/AudioBook";
import VideoBook from "./components/ProductScreen/VideoBook";
import E_Book from "./components/ProductScreen/E_Book";
//import Payment from "./components/PaymentScreen/Payment";
import Invoice from "./components/CustomerPanel/CustomerOrders/Invoice";
import Entertainment from "./components/CategoryScreen/Entertainment";

// Customer Panel
import CustomerRegisteration from './components/CustomerPanel/CustomerRegistration/CustomerRegisteration';
import CustomerLogout from "./components/CustomerPanel/CustomerLogout/CustomerLogout";
import CustomerDashboard from './components/CustomerPanel/CustomerDashboard/CustomerDashboard';
import CustomerForgetPassword from './components/CustomerPanel/CustomerForgetPassword/CustomerForgetPassword';
import CustomerProfile from './components/CustomerPanel/CustomerProfile/CustomerProfile';
import CustomerOrders from './components/CustomerPanel/CustomerOrders/CustomerOrders';
import SendOtp from './components/CustomerPanel/CustomerForgetPassword/SendOtp';
import ResetPassword from './components/CustomerPanel/CustomerForgetPassword/ResetPassword';
import CustomerHelpSupport from "./components/CustomerPanel/CustomerHelpSupport/CustomerHelpSupport";

// Employee Panel
import EmployeeDashboard from './components/EmployeePanel/EmployeeDashboard/EmployeeDashboard';
import EmployeeManageOrders from './components/EmployeePanel/EmployeeManageOrders/EmployeeManageOrders';
import EmployeeViewCategory from './components/EmployeePanel/EmployeeViewCategory/EmployeeViewCategory';
import EmployeeManageBookType from './components/EmployeePanel/EmployeeManageBookType/EmployeeManageBookType';
import EmployeeManageProducts from './components/EmployeePanel/EmployeeManageProducts/EmployeeManageProducts';
import EmployeeProfile from './components/EmployeePanel/EmployeeProfile/EmployeeProfile';
import EmployeeForgetPassword from './components/EmployeePanel/EmployeeForgetPassword/EmployeeForgetPassword';
import EmployeeAddBookType from './components/EmployeePanel/EmployeeManageBookType/EmployeeAddBookType';
import EmployeeAddProducts from './components/EmployeePanel/EmployeeManageProducts/EmployeeAddProducts';

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

// Contexts
import { CartContext, UserProvider } from './Context'; // Import UserProvider

const checkCart = localStorage.getItem('cartData');

function App() {
  // Dynamic cart state
  const [cartData, setCartData] = useState(checkCart ? JSON.parse(checkCart) : []);

  // Static data (products, employees, categories, book types)
  const [products, setProducts] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookTypes, setBookTypes] = useState([]);

  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleAddBookType = (newBookType) => {
    newBookType.Book_ID = bookTypes.length + 1;
    setBookTypes((prevBookTypes) => [...prevBookTypes, newBookType]);
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployeeList((prevList) => [...prevList, newEmployee]);
  };

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const noHeaderFooterRoutes = [
    '/employee/dashboard',
    '/employee/manage-orders',
    '/employee/manage-categories',
    '/employee/manage-booktype',
    '/employee/add-booktype',
    '/employee/manage-products',
    '/employee/add-products',
    '/employee/profile',
    '/employee/forget-password',
    '/admin/dashboard',
    '/admin/manage-orders',
    '/admin/manage-categories',
    '/admin/add-category',
    '/admin/manage-booktype',
    '/admin/add-booktype',
    '/admin/manage-products',
    '/admin/add-products',
    '/admin/view-products',
    '/admin/manage-employees',
    '/admin/add-employees',
    '/admin/view-customers',
    '/admin/profile',
    '/admin/manage-feedback',
    '/admin/reports',
  ];

  const shouldDisplayHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <UserProvider> {/* Add UserProvider to provide UserContext */}
      <CartContext.Provider value={{ cartData, setCartData }}>
        {shouldDisplayHeaderFooter && <Header />}
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/aboutus' element={<AboutUs />} />
          <Route exact path='/contactus' element={<ContactForm />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/cart' element={<CustomerCart />} />
          //<Route exact path='/payment' element={<Payment />} />

          <Route exact path="/categories" element={<Categories />} />
          <Route exact path='/category/:category_slug/:Category_ID' element={<CategoryProducts />} />
          <Route exact path="/products/Entertainment" element={<Entertainment />} />
          <Route exact path="/products/Technology" element={<Technology />} />

          <Route exact path='/products' element={<Products />} />
          <Route exact path='/product/:product_slug/:Product_ID' element={<ProductDetail />} />
          <Route exact path='/audio-book' element={<AudioBook />} />
          <Route exact path='/video-book' element={<VideoBook />} />
          <Route exact path='/e-book' element={<E_Book />} />
          <Route exact path='/invoice' element={<Invoice />} />

          {/* Customer */}
          <Route exact path='/register' element={<CustomerRegisteration />} />
          <Route exact path='/customer/dashboard' element={<CustomerDashboard />} />
          <Route exact path='/customer/orders' element={<CustomerOrders />} />
          <Route exact path="/customer/profile/:customerId" element={<CustomerProfile />} />
          <Route exact path='/customer/forget-password' element={<CustomerForgetPassword />} />
          <Route exact path='/customer/send-otp' element={<SendOtp />} />
          <Route exact path='/customer/reset-password' element={<ResetPassword />} />
          <Route exact path='/customer/help-support' element={<CustomerHelpSupport />} />
          <Route exact path="/customer/logout" element={<CustomerLogout />} />

          {/* Employee */}
          <Route exact path='/employee/dashboard' element={<EmployeeDashboard />} />
          <Route exact path='/employee/manage-orders' element={<EmployeeManageOrders />} />
          <Route exact path='/employee/manage-categories' element={<EmployeeViewCategory categories={categories} onAddCategory={handleAddCategory} />} />
          <Route exact path='/employee/manage-booktype' element={<EmployeeManageBookType bookTypes={bookTypes} onAddBookType={handleAddBookType} />} />
          <Route exact path='/employee/add-booktype' element={<EmployeeAddBookType onAddBookType={handleAddBookType} />} />
          <Route exact path='/employee/manage-products' element={<EmployeeManageProducts products={products} />} />
          <Route exact path='/employee/add-products' element={<EmployeeAddProducts onAddProduct={handleAddProduct} />} />
          <Route exact path='/employee/profile' element={<EmployeeProfile />} />
          <Route exact path='/employee/forget-password' element={<EmployeeForgetPassword />} />

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
        {shouldDisplayHeaderFooter && <Footer />}
      </CartContext.Provider>
    </UserProvider>
  );
}

export default App;
