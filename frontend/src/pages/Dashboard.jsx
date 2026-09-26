import { useMemo } from 'react'
import BarChartWidget from '../components/charts/BarChartWidget.jsx'
import Banner from '../components/ui/Banner.jsx'
import KpiCard from '../components/ui/KpiCard.jsx'
import { CHART_COLORS, GENDER, PARENTAL_EDUCATION, labelOf } from '../constants/students.js'
import { useSupabase } from '../hooks/useSupabase.js'
import { average, groupBy, percentage, PARENTAL_EDUCATION_ORDER, sortByOrder } from '../utils/dataTransformers.js'
import pageStyles from './Page.module.css'
import styles from './Dashboard.module.css'

const COLUMNS = 'gender, parental_education, test_prep, math_score, reading_score, writing_score, pass_math'

const SCORE_SERIES = [
  { key: 'math_score', name: 'Matemáticas', color: CHART_COLORS.math },
  { key: 'reading_score', name: 'Lectura', color: CHART_COLORS.reading },
  { key: 'writing_score', name: 'Escritura', color: CHART_COLORS.writing },
]

export default function Dashboard() {
  // Una sola consulta: los agregados se calculan en el frontend (dataTransformers)
  const { data, count, error, loading, refetch } = useSupabase((sb) =>
    sb.from('students').select(COLUMNS, { count: 'exact' }),
  )

  const stats = useMemo(() => (data ? computeStats(data) : null), [data])
  const fmt = (n) => n.toLocaleString('es-MX', { maximumFractionDigits: 1 })
  const noData = !loading && !error && stats === null

  return (
    <section>
      <header className={pageStyles.header}>
        <h1 className={pageStyles.title}>Dashboard</h1>
        <p className={pageStyles.subtitle}>Resumen del rendimiento académico de los estudiantes</p>
      </header>

      {error && (
        <div className={styles.banner}>
          <Banner tone="error" title="No se pudieron cargar los datos de Supabase" action={{ label: 'Reintentar', onClick: refetch }}>
            {error.message}
          </Banner>
        </div>
      )}

      <div className={styles.kpis}>
        <KpiCard
          label="Promedio Matemáticas"
          value={stats ? fmt(stats.avgMath) : '—'}
          detail="de 100 puntos"
          loading={loading}
        />
        <KpiCard
          label="Tasa de Aprobación"
          value={stats ? `${fmt(stats.passRate)}%` : '—'}
          detail="matemáticas ≥ 60"
          accent="success"
          loading={loading}
        />
        <KpiCard
          label="Impacto del Curso de Prep"
          value={stats ? `${stats.prepImpact >= 0 ? '+' : ''}${fmt(stats.prepImpact)} pts` : '—'}
          detail={stats ? `${fmt(stats.prepCompleted)} con curso vs ${fmt(stats.prepNone)} sin curso` : 'en matemáticas'}
          accent="warning"
          loading={loading}
        />
        <KpiCard
          label="Total Estudiantes"
          value={count != null ? count.toLocaleString('es-MX') : '—'}
          detail="registros en Supabase"
          accent="primary"
          loading={loading}
        />
      </div>

      <div className={styles.charts}>
        <BarChartWidget
          title="Matemáticas por educación de los padres"
          subtitle="Promedio de math_score según el nivel educativo del tutor"
          data={stats?.byEducation ?? []}
          categoryKey="label"
          bars={[SCORE_SERIES[0]]}
          horizontal
          loading={loading}
          error={error}
          onRetry={refetch}
        />
        <BarChartWidget
          title="Scores por género"
          subtitle="Promedio de las tres materias"
          data={stats?.byGender ?? []}
          categoryKey="label"
          bars={SCORE_SERIES}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </div>

      {noData && <p className={pageStyles.subtitle}>La tabla students está vacía.</p>}
    </section>
  )
}

function computeStats(rows) {
  if (rows.length === 0) return null

  const prep = groupBy(rows, 'test_prep', ['math_score'], { decimals: 2 })
  const prepCompleted = prep.find((g) => g.test_prep === 'completed')?.math_score ?? 0
  const prepNone = prep.find((g) => g.test_prep === 'none')?.math_score ?? 0

  const byEducation = sortByOrder(
    groupBy(rows, 'parental_education', ['math_score']),
    'parental_education',
    PARENTAL_EDUCATION_ORDER,
  ).map((g) => ({ ...g, label: labelOf(PARENTAL_EDUCATION, g.parental_education) }))

  const byGender = groupBy(rows, 'gender', ['math_score', 'reading_score', 'writing_score'])
    .map((g) => ({ ...g, label: labelOf(GENDER, g.gender) }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return {
    avgMath: average(rows, 'math_score'),
    passRate: percentage(rows, (r) => r.pass_math === 1),
    prepCompleted,
    prepNone,
    prepImpact: Math.round((prepCompleted - prepNone) * 10) / 10,
    byEducation,
    byGender,
  }
}
