import { useTheme } from '../../context/ThemeContext'
import styles from './ThemeToggle.module.css'

const ThemeToggle = ({ compact = false }) => {
  const { theme, toggleTheme, isDark } = useTheme()

  if (compact) {
    return (
      <button className={styles.compact} onClick={toggleTheme} title={isDark ? 'Switch ke Light Mode' : 'Switch ke Dark Mode'}>
        {isDark ? '☀️' : '🌙'}
      </button>
    )
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
      <button
        className={`${styles.toggle} ${isDark ? styles.dark : styles.light}`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <span className={styles.thumb} />
      </button>
    </div>
  )
}

export default ThemeToggle
