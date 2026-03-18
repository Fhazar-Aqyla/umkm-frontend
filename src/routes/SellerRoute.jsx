import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { USER_ROLE } from '../utils/constants'
import Loading from '../components/common/Loading'

const SellerRoute = () => {
  const { user, isLoading } = useAuthContext()

  if (isLoading) return <Loading fullScreen />

  if (!user || user.role !== USER_ROLE.SELLER) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default SellerRoute
