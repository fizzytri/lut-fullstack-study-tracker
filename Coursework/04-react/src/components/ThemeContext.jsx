import { createContext, useContext, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false)

  const value = useMemo(() => ({ dark, toggle: () => setDark((prev) => !prev) }), [dark])

  return (
    <ThemeContext.Provider value={value}>
      <div className={dark ? 'theme dark' : 'theme'}>{children}</div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
