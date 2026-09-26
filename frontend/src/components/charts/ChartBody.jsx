import { Skeleton } from '../ui/LoadingSpinner.jsx'
import styles from './charts.module.css'

/** Muestra skeleton, error o "sin datos" en lugar de la gráfica cuando corresponde. */
export default function ChartBody({ height, loading, error, onRetry, empty, children }) {
  if (loading) {
    return (
      <div className={styles.state}>
        <Skeleton height={height} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${styles.state} ${styles.message}`} style={{ height }}>
        <p>No se pudo cargar la gráfica: {error.message}</p>
        {onRetry && (
          <button className={styles.retry} onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    )
  }

  if (empty) {
    return (
      <div className={`${styles.state} ${styles.message}`} style={{ height }}>
        <p>Sin datos</p>
      </div>
    )
  }

  return children
}
