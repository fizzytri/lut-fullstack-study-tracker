import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth)

  if (user) {
    return <Outlet />
  }

  return <Navigate to="/login" />
}

export default PrivateRoute
