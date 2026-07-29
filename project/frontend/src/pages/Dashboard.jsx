import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { fetchSummary } from '../features/stats/statsSlice'
import { fetchGoals } from '../features/goals/goalSlice'
import StatCard from '../components/StatCard'
import Spinner from '../components/Spinner'
import { formatMinutes } from '../utils/format'

const ranges = [7, 30, 90]

const Dashboard = () => {
  const [days, setDays] = useState(30)
  const dispatch = useDispatch()
  const { summary, isLoading } = useSelector((state) => state.stats)
  const { items: goals } = useSelector((state) => state.goals)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchSummary(days))
    dispatch(fetchGoals())
  }, [dispatch, days])

  if (isLoading || !summary) return <Spinner />

  const chartData = summary.timeline.map((entry) => ({
    date: entry.date.slice(5),
    minutes: entry.minutes,
  }))

  const openGoals = goals.filter((goal) => !goal.completed).slice(0, 3)

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Hi {user.name.split(' ')[0]}</h1>
          <p className="muted">Here is how your studying is going.</p>
        </div>

        <div className="range-switch">
          {ranges.map((value) => (
            <button
              key={value}
              type="button"
              className={`btn btn-chip ${days === value ? 'active' : ''}`}
              onClick={() => setDays(value)}
            >
              {value} d
            </button>
          ))}
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Studied"
          value={formatMinutes(summary.totalMinutes)}
          hint={`over ${summary.rangeDays} days`}
        />
        <StatCard label="Sessions" value={summary.sessions} hint={`avg focus ${summary.averageFocus}/5`} />
        <StatCard label="Current streak" value={`${summary.streak} d`} hint="consecutive study days" />
        <StatCard
          label="This week"
          value={`${summary.weeklyProgress}%`}
          hint={`${formatMinutes(summary.weekMinutes)} of ${formatMinutes(
            summary.weeklyTargetMinutes
          )}`}
        />
      </div>

      <div className="card">
        <h2>Daily study minutes</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatMinutes(value)} />
            <Area type="monotone" dataKey="minutes" stroke="#4f46e5" fill="url(#fill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="two-col">
        <div className="card">
          <h2>Time per course</h2>
          {summary.perCourse.length === 0 ? (
            <p className="muted">No sessions logged in this range.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={summary.perCourse}
                  dataKey="minutes"
                  nameKey="code"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {summary.perCourse.map((entry) => (
                    <Cell key={entry.courseId} fill={entry.colour} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatMinutes(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2>Activity split</h2>
          {summary.perActivity.length === 0 ? (
            <p className="muted">No sessions logged in this range.</p>
          ) : (
            <ul className="bar-list">
              {summary.perActivity.map((entry) => {
                const max = summary.perActivity[0].minutes || 1
                return (
                  <li key={entry.activity}>
                    <span className="bar-label">{entry.activity}</span>
                    <span className="bar-track">
                      <span
                        className="bar-fill"
                        style={{ width: `${Math.round((entry.minutes / max) * 100)}%` }}
                      />
                    </span>
                    <span className="bar-value">{formatMinutes(entry.minutes)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Goals in progress</h2>
        {openGoals.length === 0 ? (
          <p className="muted">No open goals. Add one on the Goals page.</p>
        ) : (
          <ul className="goal-mini-list">
            {openGoals.map((goal) => (
              <li key={goal._id}>
                <div>
                  <strong>{goal.title}</strong>
                  <span className="muted"> {goal.course ? goal.course.code : 'All courses'}</span>
                </div>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${goal.progress}%` }} />
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
