import styles from './Page.module.css'

// Por construir en el Paso 7.8 de la guía (con Claude Code + PRD.md).
export default function Predictor() {
  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Predictor ML</h1>
        <p className={styles.subtitle}>¿Aprobará matemáticas este estudiante?</p>
      </header>

      <div className={styles.placeholder}>
        <h2>Pendiente: formulario y resultado de predicción</h2>
        <p>
          Pide a Claude que construya este componente (<code>src/pages/Predictor.jsx</code>) con el prompt del
          Paso 7.8. Usa el hook <code>useMLPredict</code> de <code>src/hooks/</code>.
        </p>
      </div>
    </section>
  )
}
