import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import Loading from '../components/common/Loading'

const PrivateRoute = () => {
  const { isLoggedIn, isLoading } = useAuthContext()

  if (isLoading) return <Loading fullScreen />

  if (!isLoggedIn) return <Navigate to="/login" replace />

  return <Outlet />
}

export default PrivateRoute
