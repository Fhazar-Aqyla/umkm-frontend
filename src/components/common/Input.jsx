import styles from './Input.module.css'

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  icon,
  ...rest
}) => {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${styles.input} ${icon ? styles.withIcon : ''}`}
          {...rest}
        />
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
    </div>
  )
}

export default Input
