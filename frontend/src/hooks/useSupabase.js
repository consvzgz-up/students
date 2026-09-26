import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

/**
 * Ejecuta una consulta de Supabase y maneja loading / error / data.
 *
 * @param {(client) => PromiseLike<{data, count, error}>} buildQuery
 *   Recibe el cliente y devuelve una consulta, p. ej.:
 *   (sb) => sb.from('students').select('gender, math_score').eq('gender', 'female')
 * @param {Array} deps  Vuelve a consultar cuando cambian (como en useEffect).
 *
 * @returns {{ data, count, error, loading, refetch }}
 *
 * Ejemplo con conteo y paginación:
 *   useSupabase(
 *     (sb) => sb.from('students').select('*', { count: 'exact' }).range(0, 9),
 *     [page]
 *   )
 */
export function useSupabase(buildQuery, deps = []) {
  const [state, setState] = useState({ data: null, count: null, error: null, loading: true })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState({
        data: null,
        count: null,
        loading: false,
        error: new Error('Faltan VITE_SUPABASE_URL / VITE_SUPABASE_KEY en frontend/.env.local'),
      })
      return
    }

    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))

    Promise.resolve(buildQuery(supabase))
      .then(({ data, count, error }) => {
        if (cancelled) return
        setState({
          data: data ?? null,
          count: count ?? null,
          error: error ? new Error(error.message) : null,
          loading: false,
        })
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, count: null, error: err, loading: false })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey])

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  return { ...state, refetch }
}

/**
 * Ejecuta una consulta una sola vez (p. ej. al hacer clic en "Exportar CSV").
 * Devuelve { data, count } o lanza un Error.
 */
export async function runSupabaseQuery(buildQuery) {
  if (!isSupabaseConfigured) {
    throw new Error('Faltan VITE_SUPABASE_URL / VITE_SUPABASE_KEY en frontend/.env.local')
  }
  const { data, count, error } = await buildQuery(supabase)
  if (error) throw new Error(error.message)
  return { data, count }
}
