import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART_COLORS } from '../../constants/students.js'
import ChartBody from './ChartBody.jsx'
import styles from './charts.module.css'

/**
 * Gráfica de líneas genérica (Recharts).
 *
 * <LineChartWidget
 *   title="Scores por género"
 *   data={[{ label: 'Femenino', math_score: 63.6, reading_score: 72.6 }, ...]}
 *   categoryKey="label"
 *   lines={[{ key: 'math_score', name: 'Matemáticas', color: CHART_COLORS.math }, ...]}
 *   loading={loading} error={error} onRetry={refetch}
 * />
 */
export default function LineChartWidget({
  title,
  subtitle,
  data = [],
  categoryKey,
  lines = [],
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
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey={categoryKey} tick={{ fontSize: 12 }} />
            <YAxis domain={domain} tick={{ fontSize: 12 }} width={36} />
            <Tooltip />
            {lines.length > 1 && <Legend />}
            {lines.map((l) => (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.name ?? l.key}
                stroke={l.color ?? CHART_COLORS.math}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartBody>
    </div>
  )
}
