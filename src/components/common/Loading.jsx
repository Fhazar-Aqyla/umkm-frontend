import styles from './Loading.module.css'

const Loading = ({ fullScreen = false, size = 'md', text = '' }) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={styles.spinner} data-size="lg" />
        {text && <p className={styles.text}>{text}</p>}
      </div>
    )
  }

  return (
    <div className={styles.inline}>
      <div className={styles.spinner} data-size={size} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  )
}

export default Loading
