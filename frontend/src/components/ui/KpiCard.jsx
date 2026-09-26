import { Skeleton } from './LoadingSpinner.jsx'
import styles from './KpiCard.module.css'

/**
 * Tarjeta de indicador.
 * <KpiCard label="Promedio Matemáticas" value="66.1" detail="de 100 puntos" accent="primary" loading={loading} />
 * accent: 'primary' | 'success' | 'warning' | 'danger'
 */
export default function KpiCard({ label, value, detail, accent = 'primary', loading = false }) {
  return (
    <div className={`${styles.card} ${styles[accent]}`}>
      <span className={styles.label}>{label}</span>
      {loading ? (
        <>
          <Skeleton height={34} width="60%" />
          <Skeleton height={14} width="80%" />
        </>
      ) : (
        <>
          <span className={styles.value}>{value}</span>
          {detail && <span className={styles.detail}>{detail}</span>}
        </>
      )}
    </div>
  )
}
