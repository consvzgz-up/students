import { useCallback, useState } from 'react'

const API_URL = (import.meta.env.VITE_ML_API_URL || '').replace(/\/$/, '')

// Render free tier puede tardar 30–60 s en "despertar"
const TIMEOUT_MS = 70_000

/**
 * Llama al modelo de ML desplegado en Render.
 *
 * const { predict, result, loading, error, reset } = useMLPredict()
 * await predict({ gender, ethnicity, parental_education, lunch, test_prep,
 *                 reading_score, writing_score })
 *
 * result: { prediction: 0|1, label, confidence, probabilities: { pass, fail } }
 * error.isNetworkError === true cuando la API no respondió (dormida, sin red, CORS).
 */
export function useMLPredict() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const predict = useCallback(async (input) => {
    setLoading(true)
    setError(null)
    try {
      if (!API_URL) throw new Error('Falta VITE_ML_API_URL en frontend/.env.local')

      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const detail = typeof body.detail === 'string' ? body.detail : `HTTP ${res.status}`
        throw new Error(`La API respondió con error: ${detail}`)
      }

      const data = await res.json()
      setResult(data)
      return data
    } catch (err) {
      const isNetworkError = err.name === 'TypeError' || err.name === 'TimeoutError'
      const wrapped = new Error(
        isNetworkError
          ? 'No se pudo contactar al modelo. Si está en Render free tier, espera ~60 s y reintenta.'
          : err.message,
      )
      wrapped.isNetworkError = isNetworkError
      setError(wrapped)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { predict, result, loading, error, reset }
}

/** GET /health — útil para "despertar" el servicio o mostrar su estado. */
export async function checkMLHealth() {
  if (!API_URL) throw new Error('Falta VITE_ML_API_URL')
  const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
