import { useEffect, useState } from 'react'
import { useSupabase } from '../../hooks/useSupabase.js'
import { checkMLHealth } from '../../hooks/useMLPredict.js'
import styles from './ConnectionStatus.module.css'

/** Verifica que Supabase y la API de ML respondan. Útil mientras configuras .env.local. */
export default function ConnectionStatus() {
  const db = useSupabase((sb) => sb.from('students').select('id', { count: 'exact', head: true }))
  const [ml, setMl] = useState({ loading: true })

  useEffect(() => {
    checkMLHealth()
      .then((h) => setMl({ ok: h.model_loaded, detail: h.model_loaded ? 'modelo cargado' : 'modelo no cargado' }))
      .catch((err) => setMl({ ok: false, detail: err.message }))
  }, [])

  const dbState = db.loading
    ? { loading: true }
    : db.error
      ? { ok: false, detail: db.error.message }
      : { ok: true, detail: `${db.count?.toLocaleString('es-MX')} estudiantes` }

  return (
    <ul className={styles.list}>
      <Item name="Supabase" {...dbState} />
      <Item name="API de ML" {...ml} />
    </ul>
  )
}

function Item({ name, loading, ok, detail }) {
  const status = loading ? 'pending' : ok ? 'ok' : 'error'
  return (
    <li className={styles.item}>
      <span className={`${styles.dot} ${styles[status]}`} />
      <strong>{name}</strong>
      <span className={styles.detail}>{loading ? 'verificando… (Render puede tardar ~60 s)' : detail}</span>
    </li>
  )
}
