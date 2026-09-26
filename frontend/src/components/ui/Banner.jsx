import styles from './Banner.module.css'

/**
 * Mensaje destacado. tone: 'error' (rojo) | 'warning' (amarillo) | 'info'.
 * <Banner tone="error" title="No se pudieron cargar los datos" action={{ label: 'Reintentar', onClick: refetch }}>
 *   {error.message}
 * </Banner>
 */
export default function Banner({ tone = 'info', title, children, action }) {
  return (
    <div className={`${styles.banner} ${styles[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
      <div className={styles.body}>
        {title && <strong className={styles.title}>{title}</strong>}
        {children && <span className={styles.text}>{children}</span>}
      </div>
      {action && (
        <button className={styles.action} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
