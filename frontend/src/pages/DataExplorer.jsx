import { useState } from 'react'
import FilterBar, { DEFAULT_FILTERS } from '../components/explorer/FilterBar.jsx'
import Banner from '../components/ui/Banner.jsx'
import DataTable from '../components/ui/DataTable.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import { ETHNICITY, GENDER, LUNCH, PARENTAL_EDUCATION, TEST_PREP, labelOf } from '../constants/students.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { runSupabaseQuery, useSupabase } from '../hooks/useSupabase.js'
import { downloadCSV } from '../utils/dataTransformers.js'
import pageStyles from './Page.module.css'
import styles from './DataExplorer.module.css'

const PAGE_SIZE = 10

const COLUMNS = [
  { key: 'id', label: 'ID', align: 'right' },
  { key: 'gender', label: 'Género', render: (v) => labelOf(GENDER, v) },
  { key: 'ethnicity', label: 'Grupo', render: (v) => labelOf(ETHNICITY, v) },
  { key: 'parental_education', label: 'Educación padres', render: (v) => labelOf(PARENTAL_EDUCATION, v) },
  { key: 'lunch', label: 'Almuerzo', render: (v) => labelOf(LUNCH, v) },
  { key: 'test_prep', label: 'Curso prep', render: (v) => labelOf(TEST_PREP, v) },
  { key: 'math_score', label: 'Mate', align: 'right' },
  { key: 'reading_score', label: 'Lectura', align: 'right' },
  { key: 'writing_score', label: 'Escritura', align: 'right' },
  {
    key: 'pass_math',
    label: 'Resultado',
    render: (v) => (
      <span className={`${styles.badge} ${v === 1 ? styles.pass : styles.fail}`}>{v === 1 ? 'Aprueba' : 'Reprueba'}</span>
    ),
  },
]

/** Aplica los filtros de la FilterBar a una consulta de Supabase. */
function applyFilters(query, f) {
  let q = query
  if (f.gender !== 'all') q = q.eq('gender', f.gender)
  if (f.parental_education !== 'all') q = q.eq('parental_education', f.parental_education)
  if (f.test_prep !== 'all') q = q.eq('test_prep', f.test_prep)
  if (f.minMath !== '') q = q.gte('math_score', Number(f.minMath))
  if (f.maxMath !== '') q = q.lte('math_score', Number(f.maxMath))
  if (f.pass_math !== 'all') q = q.eq('pass_math', Number(f.pass_math))
  return q
}

function applySort(query, sort) {
  const q = query.order(sort.key, { ascending: sort.dir === 'asc' })
  return sort.key === 'id' ? q : q.order('id', { ascending: true })
}

export default function DataExplorer() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort] = useState({ key: 'id', dir: 'asc' })
  const [page, setPage] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  // Espera a que el usuario deje de escribir en los campos de rango antes de consultar
  const activeFilters = useDebouncedValue(filters, 300)

  const total = useSupabase((sb) => sb.from('students').select('id', { count: 'exact', head: true }))

  const { data, count, error, loading, refetch } = useSupabase(
    (sb) => {
      const from = page * PAGE_SIZE
      const q = applyFilters(sb.from('students').select('*', { count: 'exact' }), activeFilters)
      return applySort(q, sort).range(from, from + PAGE_SIZE - 1)
    },
    [activeFilters, sort, page],
  )

  // Al cambiar filtros u orden se vuelve a la primera página en el mismo render,
  // para no pedir a Supabase un rango fuera de los resultados nuevos.
  const handleFilters = (next) => {
    setFilters(next)
    setPage(0)
  }

  const handleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
    setPage(0)
  }

  const handleExport = async () => {
    setExporting(true)
    setExportError(null)
    try {
      const { data: rows } = await runSupabaseQuery((sb) =>
        applySort(applyFilters(sb.from('students').select('*'), activeFilters), sort),
      )
      downloadCSV(rows, `estudiantes_${new Date().toISOString().slice(0, 10)}.csv`)
    } catch (err) {
      setExportError(err)
    } finally {
      setExporting(false)
    }
  }

  const invalidRange =
    filters.minMath !== '' && filters.maxMath !== '' && Number(filters.minMath) > Number(filters.maxMath)
  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  const shown = count ?? 0
  const totalCount = total.count ?? shown

  return (
    <section>
      <header className={pageStyles.header}>
        <h1 className={pageStyles.title}>Explorador de datos</h1>
        <p className={pageStyles.subtitle}>Filtra, ordena y exporta los registros de estudiantes</p>
      </header>

      <div className={styles.stack}>
        <FilterBar filters={filters} onChange={handleFilters} />

        {invalidRange && (
          <Banner tone="warning">El mínimo de matemáticas es mayor que el máximo: no habrá resultados.</Banner>
        )}
        {error && (
          <Banner tone="error" title="No se pudieron cargar los estudiantes" action={{ label: 'Reintentar', onClick: refetch }}>
            {error.message}
          </Banner>
        )}
        {exportError && (
          <Banner tone="error" title="No se pudo exportar el CSV">
            {exportError.message}
          </Banner>
        )}

        <div className={styles.toolbar}>
          <p className={styles.counter} aria-live="polite">
            {data
              ? `Mostrando ${shown.toLocaleString('es-MX')} de ${totalCount.toLocaleString('es-MX')} estudiantes`
              : 'Cargando…'}
          </p>
          <button className={styles.export} onClick={handleExport} disabled={exporting || !count}>
            {exporting ? 'Exportando…' : 'Exportar CSV'}
          </button>
        </div>

        {loading && !data ? (
          <LoadingSpinner label="Cargando estudiantes…" />
        ) : (
          <div className={loading ? styles.refreshing : undefined}>
            <DataTable
              columns={COLUMNS}
              rows={data ?? []}
              sort={sort}
              onSort={handleSort}
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
              emptyMessage="Ningún estudiante coincide con los filtros"
            />
          </div>
        )}
      </div>
    </section>
  )
}
