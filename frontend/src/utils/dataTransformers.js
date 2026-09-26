/**
 * Agrupa filas por una columna y promedia columnas numéricas.
 *
 * groupBy(rows, 'gender', ['math_score', 'reading_score'])
 * → [{ gender: 'female', math_score: 63.6, reading_score: 72.6, count: 518 }, ...]
 */
export function groupBy(rows, key, valueKeys = [], { decimals = 1 } = {}) {
  const groups = new Map()
  for (const row of rows ?? []) {
    const k = row[key]
    if (!groups.has(k)) groups.set(k, { count: 0, sums: Object.fromEntries(valueKeys.map((v) => [v, 0])) })
    const g = groups.get(k)
    g.count += 1
    for (const v of valueKeys) g.sums[v] += Number(row[v]) || 0
  }
  return [...groups.entries()].map(([k, g]) => ({
    [key]: k,
    ...Object.fromEntries(valueKeys.map((v) => [v, round(g.sums[v] / g.count, decimals)])),
    count: g.count,
  }))
}

/** Promedio de una columna numérica. */
export function average(rows, key, decimals = 1) {
  if (!rows?.length) return 0
  return round(rows.reduce((acc, r) => acc + (Number(r[key]) || 0), 0) / rows.length, decimals)
}

/** Porcentaje (0–100) de filas que cumplen una condición. */
export function percentage(rows, predicate, decimals = 1) {
  if (!rows?.length) return 0
  return round((rows.filter(predicate).length / rows.length) * 100, decimals)
}

/** Ordena según un orden fijo de categorías (las no listadas van al final). */
export function sortByOrder(rows, key, order) {
  const idx = (v) => (order.includes(v) ? order.indexOf(v) : order.length)
  return [...rows].sort((a, b) => idx(a[key]) - idx(b[key]))
}

/** Convierte filas a CSV y lo descarga en el navegador. */
export function downloadCSV(rows, filename = 'students.csv') {
  if (!rows?.length) return
  const headers = Object.keys(rows[0])
  const escape = (val) => {
    const s = String(val ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click()
  URL.revokeObjectURL(url)
}

export const PARENTAL_EDUCATION_ORDER = [
  'some high school',
  'high school',
  'some college',
  "associate's degree",
  "bachelor's degree",
  "master's degree",
]

function round(n, decimals) {
  const f = 10 ** decimals
  return Math.round(n * f) / f
}
