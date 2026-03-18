import styles from './EmptyState.module.css'
import Button from './Button'

const EmptyState = ({
  icon = '📦',
  title = 'Tidak ada data',
  description = '',
  actionLabel,
  onAction,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
