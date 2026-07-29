import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateProfile } from '../features/auth/authSlice'
import { formatMinutes } from '../utils/format'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: user.name,
    weeklyTargetMinutes: user.weeklyTargetMinutes,
  })

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const profileData = {
      name: formData.name,
      weeklyTargetMinutes: Number(formData.weeklyTargetMinutes),
    }

    const result = await dispatch(updateProfile(profileData))

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Profile updated')
    } else {
      toast.error(result.payload)
    }
  }

  return (
    <section className="card form-card">
      <h1>Profile</h1>
      <p className="muted">{user.email}</p>

      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={formData.name} onChange={onChange} required />

        <label htmlFor="weeklyTargetMinutes">Weekly target (minutes)</label>
        <input
          id="weeklyTargetMinutes"
          type="number"
          name="weeklyTargetMinutes"
          min="0"
          step="30"
          value={formData.weeklyTargetMinutes}
          onChange={onChange}
        />
        <span className="muted">
          That is {formatMinutes(Number(formData.weeklyTargetMinutes))} per week.
        </span>

        <button type="submit" className="btn btn-primary btn-block">
          Save
        </button>
      </form>
    </section>
  )
}

export default Profile
