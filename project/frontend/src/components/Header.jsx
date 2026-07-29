import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBookOpen } from 'react-icons/fa'
import { logout } from '../features/auth/authSlice'

const Header = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <NavLink to="/" className="brand">
          <FaBookOpen /> Study Tracker
        </NavLink>

        <nav className="nav">
          {user ? (
            <>
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/courses">Courses</NavLink>
              <NavLink to="/sessions">Sessions</NavLink>
              <NavLink to="/goals">Goals</NavLink>
              <NavLink to="/profile">{user.name.split(' ')[0]}</NavLink>
              <button type="button" className="btn btn-ghost" onClick={onLogout}>
                <FaSignOutAlt /> Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <FaSignInAlt /> Log in
              </NavLink>
              <NavLink to="/register">
                <FaUserPlus /> Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
