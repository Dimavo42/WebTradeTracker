import { BrowserRouter, Route, Routes } from "react-router-dom";
import TradesPage from "../pages/TradesPage";
import Navbar from "../components/layout/Navbar";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import StockPage from "../pages/StockPage";
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";
import Chatbot from "../components/chatbot/Chatbot";
import styles from "../styles/main.module.css";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className={styles.pageContent} >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trades" element={<TradesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/stocks" element={<StockPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </main>
      <Chatbot />
    </BrowserRouter>
  );
}