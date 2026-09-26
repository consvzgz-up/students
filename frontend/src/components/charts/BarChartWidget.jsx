import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART_COLORS } from '../../constants/students.js'
import ChartBody from './ChartBody.jsx'
import styles from './charts.module.css'

/**
 * Gráfica de barras genérica (Recharts).
 *
 * <BarChartWidget
 *   title="Promedio de matemáticas por educación de los padres"
 *   data={[{ label: 'Preparatoria', math_score: 62.1 }, ...]}
 *   categoryKey="label"
 *   bars={[{ key: 'math_score', name: 'Matemáticas', color: CHART_COLORS.math }]}
 *   horizontal          // barras horizontales (categorías en el eje Y)
 *   loading={loading} error={error} onRetry={refetch}
 * />
 */
export default function BarChartWidget({
  title,
  subtitle,
  data = [],
  categoryKey,
  bars = [],
  horizontal = false,
  height = 320,
  domain = [0, 100],
  loading = false,
  error = null,
  onRetry,
}) {
  return (
    <div className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <ChartBody height={height} loading={loading} error={error} onRetry={onRetry} empty={data.length === 0}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout={horizontal ? 'vertical' : 'horizontal'}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={!horizontal} vertical={horizontal} />
            {horizontal ? (
              <>
                <XAxis type="number" domain={domain} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey={categoryKey} width={150} tick={{ fontSize: 12 }} />
              </>
            ) : (
              <>
                <XAxis dataKey={categoryKey} tick={{ fontSize: 12 }} />
                <YAxis domain={domain} tick={{ fontSize: 12 }} width={36} />
              </>
            )}
            <Tooltip cursor={{ fill: CHART_COLORS.cursor }} />
            {bars.length > 1 && <Legend />}
            {bars.map((b) => (
              <Bar key={b.key} dataKey={b.key} name={b.name ?? b.key} fill={b.color ?? CHART_COLORS.math} radius={4} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartBody>
    </div>
  )
}
