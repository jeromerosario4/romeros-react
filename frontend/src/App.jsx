// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';

import Home from './Components/Home';
import ProductDetails from './Components/Product/ProductDetails';
import Login from './Components/User/Login';
import Register from './Components/User/Register';
import ForgotPassword from './Components/User/ForgotPassword';
import NewPassword from './Components/User/NewPassword';
import Profile from './Components/User/Profile';
import UpdateProfile from './Components/User/UpdateProfile';
import UpdatePassword from './Components/User/UpdatePassword';
import ConfirmOrder from './Components/Cart/ConfirmOrder';
import Cart from './Components/Cart/Cart';
import Shipping from './Components/Cart/Shipping';
import Payment from './Components/Cart/Payment';
import OrderSuccess from './Components/Cart/OrderSuccess';
import ListOrders from './Components/Order/ListOrders';
import OrderDetails from './Components/Order/OrderDetails';

import Dashboard from './Components/Admin/Dashboard';
import ProductsList from './Components/Admin/ProductsList';
import NewProduct from './Components/Admin/NewProduct';
import UpdateProduct from './Components/Admin/UpdateProduct';
import OrdersList from './Components/Admin/OrdersList';
import ProcessOrder from './Components/Admin/ProcessOrder';
import UsersList from './Components/Admin/UsersList';
import UpdateUser from './Components/Admin/UpdateUser';
import ProductReviews from './Components/Admin/ProductReviews';

import ProtectedRoute from './Components/Route/ProtectedRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function App() {
  // Cart and shipping state
  const [state, setState] = useState({
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo'))
      : {},
  });

  // Add item to cart
  const addItemToCart = async (id, quantity) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`);
      const item = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity,
      };

      const isItemExist = state.cartItems.find(i => i.product === item.product);

      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map(i =>
            i.product === isItemExist.product ? item : i
          ),
        });
      } else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item],
        });
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      toast.success('Item added to cart', { position: 'bottom-right' });
    } catch (error) {
      toast.error(error.message || 'Error adding item', { position: 'top-left' });
    }
  };

  // Remove item from cart
  const removeItemFromCart = (id) => {
    const updatedCart = state.cartItems.filter(i => i.product !== id);
    setState({ ...state, cartItems: updatedCart });
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  // Save shipping info
  const saveShippingInfo = (data) => {
    setState({ ...state, shippingInfo: data });
    localStorage.setItem('shippingInfo', JSON.stringify(data));
  };

  return (
    <Router>
      <Header cartItems={state.cartItems} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} />
        <Route path="/search/:keyword" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<NewPassword />} />

        {/* User Account */}
        <Route path="/me" element={<Profile />} />
        <Route path="/me/update" element={<UpdateProfile />} />
        <Route path="/password/update" element={<UpdatePassword />} />

        {/* Cart & Checkout */}
        <Route path="/cart" element={<Cart cartItems={state.cartItems} addItemToCart={addItemToCart} removeItemFromCart={removeItemFromCart} />} />
        <Route path="/shipping" element={<Shipping shipping={state.shippingInfo} saveShippingInfo={saveShippingInfo} />} />
        <Route path="/confirm" element={<ConfirmOrder cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
        <Route path="/payment" element={<Payment cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/orders/me" element={<ListOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />

        {/* Admin Routes */}
        <Route path="/admin/product" element={<NewProduct />} />
        <Route path="/admin/product/:id" element={<UpdateProduct />} />
        <Route path="/admin/orders" element={<OrdersList />} />
        <Route path="/admin/order/:id" element={<ProcessOrder />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/user/:id" element={<UpdateUser />} />
        <Route path="/admin/products" element={
          <ProtectedRoute isAdmin={true}>
            <ProductsList />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute isAdmin={true}>
            <ProductReviews />
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
