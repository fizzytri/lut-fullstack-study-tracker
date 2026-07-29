import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { getSummary } from '../features/stats/statsSlice'
import { getGoals } from '../features/goals/goalSlice'
import StatCard from '../components/StatCard'
import Spinner from '../components/Spinner'
import { formatMinutes } from '../utils/format'

const Dashboard = () => {
  const [days, setDays] = useState(30)

  const dispatch = useDispatch()
  const { summary, isLoading } = useSelector((state) => state.stats)
  const { goals } = useSelector((state) => state.goals)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getSummary(days))
    dispatch(getGoals())
  }, [dispatch, days])

  if (isLoading || !summary) {
    return <Spinner />
  }

  const chartData = summary.timeline.map((day) => {
    return { date: day.date.slice(5), minutes: day.minutes }
  })

  const openGoals = goals.filter((goal) => !goal.completed).slice(0, 3)

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Hi {user.name}</h1>
          <p className="muted">Here is how your studying is going.</p>
        </div>

        <div className="range-switch">
          <button
            type="button"
            className={days === 7 ? 'btn btn-chip active' : 'btn btn-chip'}
            onClick={() => setDays(7)}
          >
            7 d
          </button>
          <button
            type="button"
            className={days === 30 ? 'btn btn-chip active' : 'btn btn-chip'}
            onClick={() => setDays(30)}
          >
            30 d
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Studied" value={formatMinutes(summary.totalMinutes)} />
        <StatCard label="Sessions" value={summary.sessions} />
        <StatCard label="Streak" value={summary.streak + ' days'} />
        <StatCard label="This week" value={summary.weeklyProgress + '%'} />
      </div>

      <div className="card">
        <h2>Minutes per day</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" interval="preserveStartEnd" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="two-col">
        <div className="card">
          <h2>Time per course</h2>
          {summary.perCourse.length === 0 ? (
            <p className="muted">No sessions yet.</p>
          ) : (
            <ul className="bar-list">
              {summary.perCourse.map((course) => (
                <li key={course.code}>
                  <span className="bar-label">
                    <span className="dot" style={{ background: course.colour }} />
                    {course.code}
                  </span>
                  <span className="bar-track">
                    <span
                      className="bar-fill"
                      style={{
                        width:
                          Math.round((course.minutes / summary.perCourse[0].minutes) * 100) + '%',
                      }}
                    />
                  </span>
                  <span className="bar-value">{formatMinutes(course.minutes)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2>Time per activity</h2>
          {summary.perActivity.length === 0 ? (
            <p className="muted">No sessions yet.</p>
          ) : (
            <ul className="bar-list">
              {summary.perActivity.map((item) => (
                <li key={item.activity}>
                  <span className="bar-label">{item.activity}</span>
                  <span className="bar-track">
                    <span
                      className="bar-fill"
                      style={{
                        width:
                          Math.round((item.minutes / summary.perActivity[0].minutes) * 100) + '%',
                      }}
                    />
                  </span>
                  <span className="bar-value">{formatMinutes(item.minutes)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Goals in progress</h2>
        {openGoals.length === 0 ? (
          <p className="muted">No open goals. Add one on the Goals page.</p>
        ) : (
          <ul className="bar-list">
            {openGoals.map((goal) => (
              <li key={goal._id}>
                <span className="bar-label">{goal.title}</span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: goal.progress + '%' }} />
                </span>
                <span className="bar-value">{goal.progress}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default Dashboard
