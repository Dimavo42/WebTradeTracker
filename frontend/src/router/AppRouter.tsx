import { BrowserRouter, Route, Routes } from "react-router-dom";
import TradesPage from "../pages/TradesPage";
import Navbar from "../components/layout/Navbar";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import StockPage from "../pages/StockPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<TradesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/stocks" element={<StockPage />} />
      </Routes>

    </BrowserRouter>
  );
}