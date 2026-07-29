import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    const { name, email, password } = formData
    dispatch(register({ name, email, password }))
  }

  if (isLoading) return <Spinner />

  return (
    <section className="card form-card">
      <h1>Create an account</h1>
      <p className="muted">Start logging your study sessions today.</p>

      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={formData.name} onChange={onChange} required />

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

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          required
        />

        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
      </form>

      <p className="muted">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}

export default Register
