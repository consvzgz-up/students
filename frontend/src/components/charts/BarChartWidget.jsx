import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styles from './charts.module.css'

/**
 * Gráfica de barras genérica (Recharts).
 *
 * <BarChartWidget
 *   title="Promedio de matemáticas por educación de los padres"
 *   data={[{ parental_education: 'high school', math_score: 62.1 }, ...]}
 *   categoryKey="parental_education"
 *   bars={[{ key: 'math_score', name: 'Matemáticas', color: '#4F46E5' }]}
 *   horizontal          // barras horizontales (categorías en el eje Y)
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
}) {
  return (
    <div className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={!horizontal} vertical={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" domain={domain} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey={categoryKey} width={130} tick={{ fontSize: 12 }} />
            </>
          ) : (
            <>
              <XAxis dataKey={categoryKey} tick={{ fontSize: 12 }} />
              <YAxis domain={domain} tick={{ fontSize: 12 }} />
            </>
          )}
          <Tooltip cursor={{ fill: 'var(--color-bg)' }} />
          {bars.length > 1 && <Legend />}
          {bars.map((b) => (
            <Bar key={b.key} dataKey={b.key} name={b.name ?? b.key} fill={b.color ?? 'var(--color-primary)'} radius={4} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
