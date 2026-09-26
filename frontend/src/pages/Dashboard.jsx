import ConnectionStatus from '../components/ui/ConnectionStatus.jsx'
import styles from './Page.module.css'

// Por construir en el Paso 7.6 de la guía (con Claude Code + PRD.md).
export default function Dashboard() {
  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Resumen del rendimiento académico</p>
      </header>

      <div className={styles.placeholder}>
        <h2>Pendiente: KPIs y gráficas</h2>
        <p>
          Pide a Claude que construya este componente (<code>src/pages/Dashboard.jsx</code>) con el prompt del
          Paso 7.6.
        </p>
        <ConnectionStatus />
      </div>
    </section>
  )
}
