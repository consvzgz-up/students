import styles from './FormControls.module.css'

/** Campo con etiqueta. */
export function Field({ label, htmlFor, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  )
}

/** Select a partir de [{ value, label }]. `allLabel` agrega una opción "Todos" con value 'all'. */
export function Select({ id, value, onChange, options, allLabel }) {
  return (
    <select id={id} className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
      {allLabel && <option value="all">{allLabel}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/** Grupo de botones tipo "pill" que se comporta como radio. */
export function RadioPills({ name, value, onChange, options }) {
  return (
    <div className={styles.pills} role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <label key={o.value} className={`${styles.pill} ${value === o.value ? styles.pillActive : ''}`}>
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className={styles.srOnly}
          />
          {o.label}
        </label>
      ))}
    </div>
  )
}

/** Interruptor on/off. */
export function Toggle({ id, checked, onChange, label }) {
  return (
    <label className={styles.toggle} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.srOnly}
      />
      <span className={`${styles.track} ${checked ? styles.trackOn : ''}`}>
        <span className={styles.thumb} />
      </span>
      <span>{label}</span>
    </label>
  )
}

/** Input numérico + slider sincronizados (0–100). */
export function ScoreInput({ id, value, onChange, min = 0, max = 100 }) {
  const set = (raw) => {
    const n = Number(raw)
    onChange(Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : min)
  }
  return (
    <div className={styles.score}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(e.target.value)}
        className={styles.slider}
        aria-label={`${id} (slider)`}
      />
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(e.target.value)}
        className={styles.number}
      />
    </div>
  )
}

/** Input numérico simple. */
export function NumberInput({ id, value, onChange, min, max, placeholder }) {
  return (
    <input
      id={id}
      type="number"
      min={min}
      max={max}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={styles.select}
    />
  )
}
