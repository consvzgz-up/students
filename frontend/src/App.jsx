import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DataExplorer from './pages/DataExplorer.jsx'
import Predictor from './pages/Predictor.jsx'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explorer" element={<DataExplorer />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
