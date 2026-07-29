import { useTheme } from './ThemeContext'

const ThemeToggle = () => {
  const { dark, toggle } = useTheme()

  return (
    <button type="button" className="ghost" onClick={toggle}>
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

export default ThemeToggle
