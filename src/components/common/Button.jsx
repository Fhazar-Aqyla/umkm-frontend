import styles from './Button.module.css'
import Loading from './Loading'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <>
          <Loading size="sm" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
