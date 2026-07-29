import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isLoading, isError, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, message, navigate, dispatch])

  const onChange = (event) =>
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const onSubmit = (event) => {
    event.preventDefault()
    dispatch(login(formData))
  }

  if (isLoading) return <Spinner />

  return (
    <section className="card form-card">
      <h1>Welcome back</h1>
      <p className="muted">Log in to keep tracking your study time.</p>

      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          required
        />

        <button type="submit" className="btn btn-primary btn-block">
          Log in
        </button>
      </form>

      <p className="muted">
        No account yet? <Link to="/register">Register here</Link>
      </p>
    </section>
  )
}

export default Login
