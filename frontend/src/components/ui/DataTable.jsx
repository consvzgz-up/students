import styles from './DataTable.module.css'

/**
 * Tabla con encabezados ordenables y paginación opcional.
 *
 * <DataTable
 *   columns={[{ key: 'gender', label: 'Género' }, { key: 'math_score', label: 'Math', align: 'right' },
 *             { key: 'pass_math', label: 'Resultado', render: (v) => (v ? 'Aprueba' : 'Reprueba') }]}
 *   rows={data}
 *   sort={{ key: 'math_score', dir: 'desc' }}
 *   onSort={(key) => ...}                       // omítelo para desactivar el ordenamiento
 *   page={0} pageCount={100} onPageChange={setPage}  // omite onPageChange para ocultar la paginación
 * />
 */
export default function DataTable({
  columns,
  rows = [],
  rowKey = 'id',
  sort,
  onSort,
  page = 0,
  pageCount = 1,
  onPageChange,
  emptyMessage = 'Sin resultados',
}) {
  return (
    <div>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => {
                const active = sort?.key === col.key
                return (
                  <th
                    key={col.key}
                    style={{ textAlign: col.align ?? 'left' }}
                    className={onSort ? styles.sortable : undefined}
                    onClick={onSort ? () => onSort(col.key) : undefined}
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    {col.label}
                    {active && <span className={styles.arrow}>{sort.dir === 'asc' ? '▲' : '▼'}</span>}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>{emptyMessage}</td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={row[rowKey] ?? i}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align ?? 'left' }}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn} disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
            Anterior
          </button>
          <span>
            Página {page + 1} de {Math.max(pageCount, 1)}
          </span>
          <button className={styles.pageBtn} disabled={page >= pageCount - 1} onClick={() => onPageChange(page + 1)}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
