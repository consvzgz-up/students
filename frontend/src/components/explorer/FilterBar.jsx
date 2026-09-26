import { Field, NumberInput, Select } from '../ui/FormControls.jsx'
import { GENDER, PARENTAL_EDUCATION, TEST_PREP } from '../../constants/students.js'
import styles from './FilterBar.module.css'

export const DEFAULT_FILTERS = {
  gender: 'all',
  parental_education: 'all',
  test_prep: 'all',
  minMath: '',
  maxMath: '',
  pass_math: 'all',
}

const RESULT_OPTIONS = [
  { value: '1', label: 'Aprueba' },
  { value: '0', label: 'Reprueba' },
]

/** Barra de filtros del Explorador. `filters` usa la forma de DEFAULT_FILTERS. */
export default function FilterBar({ filters, onChange }) {
  const set = (key) => (value) => onChange({ ...filters, [key]: value })
  const isDirty = Object.keys(DEFAULT_FILTERS).some((k) => filters[k] !== DEFAULT_FILTERS[k])

  return (
    <div className={styles.bar}>
      <Field label="Género" htmlFor="f-gender">
        <Select id="f-gender" value={filters.gender} onChange={set('gender')} options={GENDER} allLabel="Todos" />
      </Field>
      <Field label="Educación de los padres" htmlFor="f-edu">
        <Select
          id="f-edu"
          value={filters.parental_education}
          onChange={set('parental_education')}
          options={PARENTAL_EDUCATION}
          allLabel="Todos"
        />
      </Field>
      <Field label="Curso de preparación" htmlFor="f-prep">
        <Select id="f-prep" value={filters.test_prep} onChange={set('test_prep')} options={TEST_PREP} allLabel="Todos" />
      </Field>
      <Field label="Matemáticas (mín – máx)" htmlFor="f-min">
        <div className={styles.range}>
          <NumberInput id="f-min" value={filters.minMath} onChange={set('minMath')} min={0} max={100} placeholder="0" />
          <span aria-hidden="true">–</span>
          <NumberInput id="f-max" value={filters.maxMath} onChange={set('maxMath')} min={0} max={100} placeholder="100" />
        </div>
      </Field>
      <Field label="Resultado" htmlFor="f-result">
        <Select id="f-result" value={filters.pass_math} onChange={set('pass_math')} options={RESULT_OPTIONS} allLabel="Todos" />
      </Field>
      <button className={styles.clear} onClick={() => onChange(DEFAULT_FILTERS)} disabled={!isDirty}>
        Limpiar filtros
      </button>
    </div>
  )
}
