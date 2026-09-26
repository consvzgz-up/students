import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styles from './charts.module.css'

/**
 * Gráfica de líneas genérica (Recharts).
 *
 * <LineChartWidget
 *   title="Scores por género"
 *   data={[{ gender: 'female', math_score: 63.6, reading_score: 72.6 }, ...]}
 *   categoryKey="gender"
 *   lines={[{ key: 'math_score', name: 'Matemáticas', color: '#4F46E5' }, ...]}
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
}) {
  return (
    <div className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey={categoryKey} tick={{ fontSize: 12 }} />
          <YAxis domain={domain} tick={{ fontSize: 12 }} />
          <Tooltip />
          {lines.length > 1 && <Legend />}
          {lines.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.name ?? l.key}
              stroke={l.color ?? 'var(--color-primary)'}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
