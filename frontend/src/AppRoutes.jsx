import { Route, Routes } from "react-router-dom";
import MainPage from './pages/MainPage/MainPage'
import AllCategoriesPage from "./pages/AllCategoriesPage/AllCategoriesPage";
import AllProductsPage from './pages/AllProductsPage/AllProductsPage'
import AllSalesPage from './pages/AllSalesPage/AllSalesPage'
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage'

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/categories" element={<AllCategoriesPage/>} />
        <Route path="/products" element={<AllProductsPage/>}/>
        <Route path="/sales" element={<AllSalesPage/>}/>
        <Route path="/cart" element={<ShoppingCartPage/>}/>
      </Routes>
  );
}
export default AppRoutes;