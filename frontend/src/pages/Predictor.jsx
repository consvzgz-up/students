import { useEffect, useState } from 'react'
import Banner from '../components/ui/Banner.jsx'
import { Field, RadioPills, ScoreInput, Select, Toggle } from '../components/ui/FormControls.jsx'
import { ETHNICITY, GENDER, LUNCH, PARENTAL_EDUCATION, labelOf } from '../constants/students.js'
import { checkMLHealth, useMLPredict } from '../hooks/useMLPredict.js'
import pageStyles from './Page.module.css'
import styles from './Predictor.module.css'

const HISTORY_KEY = 'eduinsights:predictions'
const HISTORY_SIZE = 5

const INITIAL_FORM = {
  gender: 'female',
  ethnicity: 'group C',
  parental_education: 'some college',
  lunch: 'standard',
  test_prep: 'none',
  reading_score: 70,
  writing_score: 70,
}

export default function Predictor() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [history, setHistory] = useState(loadHistory)
  const { predict, result, loading, error } = useMLPredict()

  // "Despierta" el servicio de Render en cuanto se abre la página
  useEffect(() => {
    checkMLHealth().catch(() => {})
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } catch {
      // sessionStorage no disponible: el historial vive solo en memoria
    }
  }, [history])

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const input = { ...form }
    const res = await predict(input)
    if (res) {
      setHistory((h) => [{ id: Date.now(), input, result: res }, ...h].slice(0, HISTORY_SIZE))
    }
  }

  return (
    <section>
      <header className={pageStyles.header}>
        <h1 className={pageStyles.title}>Predictor ML</h1>
        <p className={pageStyles.subtitle}>Estima si un estudiante aprobará matemáticas (≥ 60) con un modelo Random Forest</p>
      </header>

      <div className={styles.layout}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h2 className={styles.cardTitle}>Datos del estudiante</h2>

          <Field label="Género">
            <RadioPills name="gender" value={form.gender} onChange={set('gender')} options={GENDER} />
          </Field>

          <div className={styles.row}>
            <Field label="Grupo étnico" htmlFor="p-ethnicity">
              <Select id="p-ethnicity" value={form.ethnicity} onChange={set('ethnicity')} options={ETHNICITY} />
            </Field>
            <Field label="Educación de los padres" htmlFor="p-edu">
              <Select
                id="p-edu"
                value={form.parental_education}
                onChange={set('parental_education')}
                options={PARENTAL_EDUCATION}
              />
            </Field>
          </div>

          <Field label="Tipo de almuerzo">
            <RadioPills name="lunch" value={form.lunch} onChange={set('lunch')} options={LUNCH} />
          </Field>

          <Field label="Curso de preparación">
            <Toggle
              id="p-prep"
              checked={form.test_prep === 'completed'}
              onChange={(on) => set('test_prep')(on ? 'completed' : 'none')}
              label={form.test_prep === 'completed' ? 'Completado' : 'No completado'}
            />
          </Field>

          <Field label="Calificación de lectura" htmlFor="p-reading">
            <ScoreInput id="p-reading" value={form.reading_score} onChange={set('reading_score')} />
          </Field>

          <Field label="Calificación de escritura" htmlFor="p-writing">
            <ScoreInput id="p-writing" value={form.writing_score} onChange={set('writing_score')} />
          </Field>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading && <span className={styles.btnSpinner} aria-hidden="true" />}
            {loading ? 'Prediciendo…' : 'Predecir'}
          </button>
          {loading && <p className={styles.hint}>Si el servidor estaba inactivo, la primera respuesta puede tardar hasta 60 s.</p>}
        </form>

        <div className={styles.side}>
          {error &&
            (error.isNetworkError ? (
              <Banner tone="warning" title="El modelo no respondió">
                {error.message}
              </Banner>
            ) : (
              <Banner tone="error" title="Error en la predicción">
                {error.message}
              </Banner>
            ))}

          <div className={styles.card}>{result ? <ResultCard result={result} /> : <EmptyResult />}</div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Historial de la sesión</h2>
            {history.length === 0 ? (
              <p className={styles.muted}>Aquí aparecerán tus últimas {HISTORY_SIZE} predicciones.</p>
            ) : (
              <ul className={styles.history}>
                {history.map((h) => (
                  <li key={h.id} className={styles.historyItem}>
                    <span className={`${styles.dot} ${h.result.prediction === 1 ? styles.dotPass : styles.dotFail}`} />
                    <span className={styles.historyText}>
                      {labelOf(GENDER, h.input.gender)} · {labelOf(PARENTAL_EDUCATION, h.input.parental_education)} ·
                      L {h.input.reading_score} / E {h.input.writing_score}
                      {h.input.test_prep === 'completed' ? ' · con curso' : ''}
                    </span>
                    <strong className={h.result.prediction === 1 ? styles.textPass : styles.textFail}>
                      {Math.round(h.result.confidence * 100)}%
                    </strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ResultCard({ result }) {
  const pass = result.prediction === 1
  const pct = Math.round(result.confidence * 100)
  const high = result.confidence > 0.75

  return (
    <div className={styles.result}>
      <span className={`${styles.badge} ${pass ? styles.badgePass : styles.badgeFail}`}>{pass ? 'APRUEBA' : 'EN RIESGO'}</span>
      <p className={styles.resultText}>
        {pass
          ? 'El modelo estima que este estudiante aprobará matemáticas.'
          : 'El modelo estima que este estudiante podría reprobar matemáticas.'}
      </p>

      <div className={styles.confidence}>
        <div className={styles.confidenceHeader}>
          <span>Confianza</span>
          <strong>{pct}%</strong>
        </div>
        <div className={styles.track} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className={`${styles.fill} ${pass ? styles.fillPass : styles.fillFail}`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`${styles.level} ${high ? styles.levelHigh : styles.levelMid}`}>
          {high ? 'Alta confianza' : 'Confianza moderada'}
        </span>
      </div>

      <p className={styles.muted}>
        Probabilidad de aprobar {Math.round(result.probabilities.pass * 100)}% · reprobar{' '}
        {Math.round(result.probabilities.fail * 100)}%
      </p>
    </div>
  )
}

function EmptyResult() {
  return (
    <div className={styles.empty}>
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
        <circle cx="48" cy="48" r="44" fill="#EEF2FF" />
        <rect x="28" y="24" width="40" height="50" rx="6" fill="#fff" stroke="#C7D2FE" strokeWidth="2" />
        <path d="M36 38h24M36 47h24M36 56h14" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" />
        <circle cx="64" cy="64" r="12" fill="#4F46E5" />
        <path d="M59 64l3.5 3.5L69 61" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p>Completa el formulario y presiona «Predecir» para ver el resultado.</p>
    </div>
  )
}

function loadHistory() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(HISTORY_KEY))
    return Array.isArray(saved) ? saved.slice(0, HISTORY_SIZE) : []
  } catch {
    return []
  }
}
