// src/components/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
// import Sidebar from './components/Sidebar';

import "./App.css";
import AddCategory from "./components/Category/AddCategoryForm.jsx";
import AddSubcategory from "./components/Category/AddSubCategoryForm.jsx";
import Category from "./components/Category/CategoryManager.jsx";
import Subcategory from "./components/Category/SubCategoryListing.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./components/Login.jsx";
import NoPage from "./components/NoPage.jsx";
import Orders from "./components/Orders.jsx";
import OrderDetails from "./components/OrdersDetail.jsx";
import AddProduct from "./components/Product/AddProduct.jsx";
import EditProduct from "./components/Product/EditAllProducts.jsx";
import ViewProduct from "./components/Product/PreviewAllProducts.jsx";
import Products from "./components/Product/ProductList.jsx";
import Profile from "./components/Profile/Profile.jsx";
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import CouponForm from "./components/CouponManagement/CouponForm.jsx";
import Coupons from "./components/CouponManagement/CouponList.jsx";
import Settings from "./components/Settings.jsx";
import SignUp from "./components/SignUp.jsx";

const App = () => {
  const NAVIGATION = [
    { path: "/", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/orders", element: <Orders /> },
    { path: "/orderDetail/:id", element: <OrderDetails /> },
    { path: "/products", element: <Products /> },
    { path: "/add-product", element: <AddProduct /> },
    { path: "/settings", element: <Settings /> },
    { path: "/profile", element: <Profile /> },
    { path: "/category", element: <Category /> },
    { path: "/editProduct/:id", element: <EditProduct /> },
    { path: "/viewProduct/:id", element: <ViewProduct /> },
    { path: "/addCategory", element: <AddCategory /> },
    { path: "/subcategory/:id", element: <Subcategory /> },
    { path: "/addSubCategory/:id", element: <AddSubcategory /> },
    { path: "/coupons", element: <Coupons /> },
    { path: "/coupon-form", element: <CouponForm /> },
  ];

  return (
    <>
      <Routes>
        {NAVIGATION.map((nav, index) => (
          <Route key={index} path={nav.path} element={nav.element} />
        ))}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  );
};

export default App;
