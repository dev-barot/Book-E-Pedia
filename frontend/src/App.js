import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminNavbar from "./components/AdminPanel/AdminNavbar/AdminNavbar";
import AdminSidebar from "./components/AdminPanel/AdminSidebar/AdminSidebar";
import AdminDashboard from "./components/AdminPanel/AdminDashboard/AdminDashboard";

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/HomeScreen/Home';
import Login from './components/LoginScreen/Login';

function App() {
  return (
    <BrowserRouter>
      <AdminNavbar />
      <AdminSidebar />

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path="/" element={<AdminDashboard />} />
        <Route exact path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
