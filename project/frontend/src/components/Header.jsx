import { Link, useNavigate } from 'react-router-dom'
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
        <Link to="/" className="brand">
          <FaBookOpen /> Study Tracker
        </Link>

        <nav className="nav">
          {user ? (
            <>
              <Link to="/">Dashboard</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/sessions">Sessions</Link>
              <Link to="/goals">Goals</Link>
              <Link to="/profile">Profile</Link>
              <button type="button" className="btn btn-ghost" onClick={onLogout}>
                <FaSignOutAlt /> Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <FaSignInAlt /> Log in
              </Link>
              <Link to="/register">
                <FaUserPlus /> Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
