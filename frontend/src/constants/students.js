// Valores posibles de cada columna de la tabla students, con su etiqueta en español.
// `value` es exactamente lo que guarda Supabase y lo que espera la API de ML.

export const GENDER = [
  { value: 'female', label: 'Femenino' },
  { value: 'male', label: 'Masculino' },
]

export const ETHNICITY = ['A', 'B', 'C', 'D', 'E'].map((g) => ({ value: `group ${g}`, label: `Grupo ${g}` }))

// Ordenado de menor a mayor nivel educativo
export const PARENTAL_EDUCATION = [
  { value: 'some high school', label: 'Preparatoria incompleta' },
  { value: 'high school', label: 'Preparatoria' },
  { value: 'some college', label: 'Universidad incompleta' },
  { value: "associate's degree", label: 'Técnico superior' },
  { value: "bachelor's degree", label: 'Licenciatura' },
  { value: "master's degree", label: 'Maestría' },
]

export const LUNCH = [
  { value: 'standard', label: 'Estándar' },
  { value: 'free/reduced', label: 'Gratuito / reducido' },
]

export const TEST_PREP = [
  { value: 'completed', label: 'Completado' },
  { value: 'none', label: 'Ninguno' },
]

/** Etiqueta en español de un valor, o el valor tal cual si no está en la lista. */
export function labelOf(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}

// Recharts dibuja en SVG: usa hex (no var(--...)) para que los colores funcionen en todos los navegadores.
export const CHART_COLORS = {
  math: '#4F46E5',
  reading: '#10B981',
  writing: '#F59E0B',
  grid: '#E2E8F0',
  cursor: '#F1F5F9',
}
