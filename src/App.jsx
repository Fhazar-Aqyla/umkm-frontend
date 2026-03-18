import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import PrivateRoute    from './routes/PrivateRoute'
import SellerRoute     from './routes/SellerRoute'
import SideNav         from './components/common/SideNav'
import BottomNav       from './components/common/BottomNav'
import Loading         from './components/common/Loading'
import { ThemeProvider } from './context/ThemeContext'

import LoginPage       from './pages/auth/LoginPage'
import RegisterPage    from './pages/auth/RegisterPage'
import HomePage        from './pages/buyer/HomePage'
import ExplorePage     from './pages/buyer/ExplorePage'
import StoreDetailPage from './pages/buyer/StoreDetailPage'
import CartPage        from './pages/buyer/CartPage'
import CheckoutPage    from './pages/buyer/CheckoutPage'
import OrderListPage   from './pages/buyer/OrderListPage'
import OrderDetailPage from './pages/buyer/OrderDetailPage'
import ProfilePage     from './pages/buyer/ProfilePage'
import SellerDashboard    from './pages/seller/SellerDashboard'
import SellerProductPage  from './pages/seller/SellerProductPage'
import SellerStorePage    from './pages/seller/SellerStorePage'
import SellerFinancePage  from './pages/seller/SellerFinancePage'

const AUTH_PATHS = ['/login', '/register']

const Layout = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthContext()
  const { pathname } = useLocation()
  const isAuth = AUTH_PATHS.includes(pathname)

  if (isLoading) return <Loading fullScreen />

  if (isAuth) {
    return (
      <div style={{ width: '100%', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    )
  }

  return (
    <div className="app-shell">
      {}
      {isLoggedIn && <SideNav />}

      {}
      <div className="main-content-area">
        {children}
        {}
        {isLoggedIn && <BottomNav />}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: { fontFamily:"'Poppins',sans-serif", fontSize:'0.875rem', borderRadius:'12px', maxWidth:'360px', fontWeight:'500' },
              success: { iconTheme: { primary:'#0D9488', secondary:'#fff' } },
            }}
          />
          <Layout>
            <Routes>
              <Route path="/login"     element={<LoginPage />} />
              <Route path="/register"  element={<RegisterPage />} />
              <Route path="/store/:id" element={<StoreDetailPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/"           element={<HomePage />} />
                <Route path="/explore"    element={<ExplorePage />} />
                <Route path="/cart"       element={<CartPage />} />
                <Route path="/checkout"   element={<CheckoutPage />} />
                <Route path="/orders"     element={<OrderListPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/profile"    element={<ProfilePage />} />
                <Route path="/seller/register-store" element={<SellerStorePage />} />

                <Route element={<SellerRoute />}>
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  <Route path="/seller/products"  element={<SellerProductPage />} />
                  <Route path="/seller/store"     element={<SellerStorePage />} />
                  <Route path="/seller/finance"   element={<SellerFinancePage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
