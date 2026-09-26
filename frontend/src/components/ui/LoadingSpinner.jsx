import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner({ label = 'Cargando…', size = 32 }) {
  return (
    <div className={styles.container} role="status">
      <span className={styles.spinner} style={{ width: size, height: size }} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )
}

/** Bloque gris animado para skeleton loaders: <Skeleton height={96} /> */
export function Skeleton({ width = '100%', height = 16, radius = 8 }) {
  return <span className={styles.skeleton} style={{ width, height, borderRadius: radius }} aria-hidden="true" />
}
