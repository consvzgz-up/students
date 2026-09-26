import styles from './Page.module.css'

// Por construir en el Paso 7.7 de la guía (con Claude Code + PRD.md).
export default function DataExplorer() {
  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Explorador de datos</h1>
        <p className={styles.subtitle}>Filtra y exporta los registros de estudiantes</p>
      </header>

      <div className={styles.placeholder}>
        <h2>Pendiente: filtros, tabla y exportación CSV</h2>
        <p>
          Pide a Claude que construya este componente (<code>src/pages/DataExplorer.jsx</code>) con el prompt del
          Paso 7.7. Usa <code>DataTable</code> de <code>src/components/ui/</code>.
        </p>
      </div>
    </section>
  )
}
