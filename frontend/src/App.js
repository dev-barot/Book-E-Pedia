import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminNavbar from "./components/AdminPanel/AdminNavbar/AdminNavbar";
import AdminSidebar from "./components/AdminPanel/AdminSidebar/AdminSidebar";
import AdminDashboard from "./components/AdminPanel/AdminDashboard/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <AdminNavbar />
      <AdminSidebar />

      <Routes>
        <Route path="/" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
