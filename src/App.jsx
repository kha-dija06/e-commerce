// import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import { Suspense, lazy } from 'react';
// import Layout from './components/Layout';
// import UserLayout from './components/UserLayout';
// import ProtectedRoute from './components/ProtectedRoute';
// import AdminRoute from './components/AdminRoute';
// import AdminLayout from './components/AdminLayout';
// import LoadingSpinner from './components/LoadingSpinner';
// import { useAuth } from './hooks/useAuth';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import ProductsPage from './pages/Productspage';
// import AdminCategoriesPage from './pages/AdminCategoriesPage';


// // Lazy loading components
// const HomePage = lazy(() => import('./pages/HomePage'));
// const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
// const CartPage = lazy(() => import('./pages/CartPage'));
// const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
// const PaymentPage = lazy(() => import('./pages/PaymentPage'));
// const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
// const ProfilePage = lazy(() => import('./pages/ProfilePage'));
// const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
// const SupportPage = lazy(() => import('./pages/SupportPage'));
// const LoginPage = lazy(() => import('./pages/LoginPage'));
// const RegisterPage = lazy(() => import('./pages/RegisterPage'));
// const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
// const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
// const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
// const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
// const AdminSupportPage = lazy(() => import('./pages/AdminSupportPage'));

// const UserRoute = () => {
//   const { isAdmin, isAuthenticated } = useAuth();
//   if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;
//   return <Outlet />;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Suspense fallback={<LoadingSpinner />}>
//         <Routes>
//           {/* Public Auth Routes */}
//           <Route element={<Layout />}>
//             <Route path="login" element={<LoginPage />} />
//             <Route path="register" element={<RegisterPage />} />
//             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
//           </Route>

//           {/* User Shopping Interface */}
//           <Route element={<UserRoute />}>
//             <Route path="/" element={<UserLayout />}>
//               <Route index element={<HomePage />} />
//               <Route path="product/:id" element={<ProductDetailsPage />} />
//               <Route path="cart" element={<CartPage />} />
//               <Route path="support" element={<SupportPage />} />
//                <Route path="products" element={<ProductsPage />} />
              
//               <Route element={<ProtectedRoute />}>
//                 <Route path="checkout" element={<CheckoutPage />} />
//                 <Route path="payment" element={<PaymentPage />} />
//                 <Route path="orders" element={<OrderHistoryPage />} />
//                 <Route path="profile" element={<ProfilePage />} />
//                 <Route path="favorites" element={<FavoritesPage />} />
//               </Route>
//             </Route>
//           </Route>

//           {/* Admin Layout Routes */}
//           <Route element={<AdminRoute />}>
//               <Route path="/admin" element={<AdminLayout />}>
//               <Route index element={<AdminDashboardPage />} />
//               <Route path="products" element={<AdminProductsPage />} />
//               <Route path="orders" element={<AdminOrdersPage />} />
//               <Route path="users" element={<AdminUsersPage />} />
//               <Route path="support" element={<AdminSupportPage />} />
//               <Route path="profile" element={<ProfilePage />} />
//               <Route path="categories" element={<AdminCategoriesPage />} />
//             </Route>
//           </Route>
//         </Routes>
//       </Suspense>
//     </BrowserRouter>
//   );
// }

// export default App;
// import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import { Suspense, lazy } from 'react';
// import Layout from './components/Layout';
// import UserLayout from './components/UserLayout';
// import ProtectedRoute from './components/ProtectedRoute';
// import AdminRoute from './components/AdminRoute';
// import AdminLayout from './components/AdminLayout';
// import LoadingSpinner from './components/LoadingSpinner';
// import { useAuth } from './hooks/useAuth';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import ProductsPage from './pages/Productspage';
// import AdminCategoriesPage from './pages/AdminCategoriesPage';
// // import OrderDetailsPage from './pages/OrderDetailsPage';

// // Lazy loading components
// const HomePage = lazy(() => import('./pages/HomePage'));
// const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
// const CartPage = lazy(() => import('./pages/CartPage'));
// const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
// const PaymentPage = lazy(() => import('./pages/PaymentPage'));
// const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
// // const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
// const ProfilePage = lazy(() => import('./pages/ProfilePage'));
// const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
// const SupportPage = lazy(() => import('./pages/SupportPage'));
// const LoginPage = lazy(() => import('./pages/LoginPage'));
// const RegisterPage = lazy(() => import('./pages/RegisterPage'));
// const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
// const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
// const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
// const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
// const AdminSupportPage = lazy(() => import('./pages/AdminSupportPage'));

// const UserRoute = () => {
//   const { isAdmin, isAuthenticated } = useAuth();
//   if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;
//   return <Outlet />;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Suspense fallback={<LoadingSpinner />}>
//         <Routes>
//           {/* Public Auth Routes */}
//           <Route element={<Layout />}>
//             <Route path="login" element={<LoginPage />} />
//             <Route path="register" element={<RegisterPage />} />
//             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           </Route>

//           {/* User Shopping Interface */}
//           <Route element={<UserRoute />}>
//             <Route path="/" element={<UserLayout />}>
//               <Route index element={<HomePage />} />
//               {/* ✅ Support both singular and plural */}
//               {/* <Route path="product/:id" element={<ProductDetailsPage />} /> */}
//               <Route path="products/:id" element={<ProductDetailsPage />} />
//               <Route path="cart" element={<CartPage />} />
//               <Route path="support" element={<SupportPage />} />
//               <Route path="products" element={<ProductsPage />} />
              
//               <Route element={<ProtectedRoute />}>
//                 <Route path="checkout" element={<CheckoutPage />} />
//                 <Route path="payment" element={<PaymentPage />} />
//                 <Route path="orders" element={<OrderHistoryPage />} />
//                 {/* <Route path="orders/:id" element={<OrderDetailsPage />} /> */}
               
//                 <Route path="profile" element={<ProfilePage />} />
//                 <Route path="favorites" element={<FavoritesPage />} />
//               </Route>
//             </Route>
//           </Route>

//           {/* Admin Layout Routes */}
//           <Route element={<AdminRoute />}>
//             <Route path="/admin" element={<AdminLayout />}>
//               <Route index element={<AdminDashboardPage />} />
//               <Route path="products" element={<AdminProductsPage />} />
//               <Route path="orders" element={<AdminOrdersPage />} />
//               <Route path="users" element={<AdminUsersPage />} />
//               <Route path="support" element={<AdminSupportPage />} />
//               <Route path="profile" element={<ProfilePage />} />
//               <Route path="categories" element={<AdminCategoriesPage />} />
//             </Route>
//           </Route>
//         </Routes>
//       </Suspense>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import UserLayout from './components/UserLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import LoadingSpinner from './components/LoadingSpinner';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProductsPage from './pages/Productspage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';

// Lazy loading
const HomePage           = lazy(() => import('./pages/HomePage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage           = lazy(() => import('./pages/CartPage'));
const CheckoutPage       = lazy(() => import('./pages/CheckoutPage'));
const PaymentPage        = lazy(() => import('./pages/PaymentPage'));
const OrderHistoryPage   = lazy(() => import('./pages/OrderHistoryPage'));
const ProfilePage        = lazy(() => import('./pages/ProfilePage'));
const FavoritesPage      = lazy(() => import('./pages/FavoritesPage'));
const SupportPage        = lazy(() => import('./pages/SupportPage'));
const LoginPage          = lazy(() => import('./pages/LoginPage'));
const RegisterPage       = lazy(() => import('./pages/RegisterPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminProductsPage  = lazy(() => import('./pages/AdminProductsPage'));
const AdminOrdersPage    = lazy(() => import('./pages/AdminOrdersPage'));
const AdminUsersPage     = lazy(() => import('./pages/AdminUsersPage'));
const AdminSupportPage   = lazy(() => import('./pages/AdminSupportPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>

          {/* ── Auth pages (public) */}
          <Route element={<Layout />}>
            <Route path="login"           element={<LoginPage />} />
            <Route path="register"        element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* ── Public + User routes
               /products, /products/:id  → accessible à tous (visiteur, user, admin)
               /checkout, /orders, etc   → auth requise via ProtectedRoute
          */}
          <Route path="/" element={<UserLayout />}>
            <Route index               element={<HomePage />} />
            <Route path="products"     element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />
            
            {/* Auth required (user only — admin kayji mn /admin) */}
            <Route element={<ProtectedRoute />}>
            <Route path="cart"         element={<CartPage />} />
            <Route path="support"      element={<SupportPage />} />
              <Route path="checkout"   element={<CheckoutPage />} />
              <Route path="payment"    element={<PaymentPage />} />
              <Route path="orders"     element={<OrderHistoryPage />} />
              <Route path="profile"    element={<ProfilePage />} />
              <Route path="favorites"  element={<FavoritesPage />} />
            </Route>
          </Route>

          {/* ── Admin only routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index              element={<AdminDashboardPage />} />
              <Route path="products"    element={<AdminProductsPage />} />
              <Route path="orders"      element={<AdminOrdersPage />} />
              <Route path="users"       element={<AdminUsersPage />} />
              <Route path="support"     element={<AdminSupportPage />} />
              <Route path="categories"  element={<AdminCategoriesPage />} />
              <Route path="profile"     element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ── 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;