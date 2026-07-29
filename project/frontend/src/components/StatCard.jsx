const StatCard = ({ label, value }) => {
  return (
    <div className="card stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  )
}

export default StatCard
