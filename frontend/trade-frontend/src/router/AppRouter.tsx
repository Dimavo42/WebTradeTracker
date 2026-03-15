import { BrowserRouter, Route } from "react-router-dom";
import TradesPage from "../pages/TradesPage.";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Route path="/" element={<TradesPage />} />
    </BrowserRouter>
  );
}