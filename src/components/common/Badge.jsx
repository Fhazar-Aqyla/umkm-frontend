import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../../utils/constants'
import styles from './Badge.module.css'

const Badge = ({ status, label, color }) => {
  const displayLabel = label || ORDER_STATUS_LABEL[status] || status
  const displayColor = color || ORDER_STATUS_COLOR[status] || '#6B7280'

  return (
    <span
      className={styles.badge}
      style={{
        backgroundColor: `${displayColor}18`,
        color: displayColor,
        border: `1px solid ${displayColor}30`,
      }}
    >
      <span
        className={styles.dot}
        style={{ backgroundColor: displayColor }}
      />
      {displayLabel}
    </span>
  )
}

export default Badge
