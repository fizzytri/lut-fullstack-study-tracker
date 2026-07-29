const StatCard = ({ label, value, hint }) => (
  <div className="card stat-card">
    <span className="stat-label">{label}</span>
    <strong className="stat-value">{value}</strong>
    {hint && <span className="stat-hint">{hint}</span>}
  </div>
)

export default StatCard
