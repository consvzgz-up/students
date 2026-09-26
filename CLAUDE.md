# EduInsights — reglas del proyecto

Aplicación de análisis de rendimiento académico: Dashboard, Explorador de datos y Predictor ML.
La especificación completa está en `PRD.md` (raíz). Léelo antes de construir cualquier pantalla.

## Estructura

```
frontend/            React 19 + Vite + Recharts + React Router v6 (se despliega en Vercel)
  src/pages/         Una página por ruta: Dashboard (/), DataExplorer (/explorer), Predictor (/predictor)
  src/components/
    layout/          Sidebar
    charts/          BarChartWidget, LineChartWidget (wrappers de Recharts)
    ui/              DataTable, LoadingSpinner (+ Skeleton), ConnectionStatus
  src/hooks/         useSupabase (consultas), useMLPredict (POST /predict)
  src/lib/           supabaseClient (único lugar donde se crea el cliente)
  src/utils/         dataTransformers: groupBy, average, percentage, sortByOrder, downloadCSV
ml-api/              FastAPI + scikit-learn (se despliega en Render, Root Directory = ml-api)
supabase/migrations/ SQL del esquema
index.html, app.js…  Versión estática original (HTML + Chart.js); no la modifiques salvo que se pida
```

## Reglas

- **Datos de Supabase**: siempre a través de `useSupabase` (`src/hooks/useSupabase.js`). Nunca uses `fetch`
  directo ni importes el cliente de Supabase dentro de un componente.
- **Modelo de ML**: siempre a través de `useMLPredict` (`src/hooks/useMLPredict.js`).
- **Agregaciones** (promedios, agrupaciones): en el frontend con las funciones de `src/utils/dataTransformers.js`.
  Si necesitas una nueva, agrégala ahí, no dentro del componente.
- **Estilos**: CSS Modules (`Componente.module.css`) junto al componente. Nada de estilos inline salvo valores
  dinámicos (anchos de barras, etc.). Usa las variables de `src/index.css` (`var(--color-primary)`), no hex sueltos.
- **Colores**: primary `#4F46E5`, success `#10B981`, warning `#F59E0B`, danger `#EF4444`.
- **Estados de UI**: todo componente que carga datos muestra loading (skeleton o `LoadingSpinner`), error
  descriptivo y estado vacío.
- **Reutiliza** los componentes de `components/charts` y `components/ui` antes de crear nuevos.
- **Responsive**: debe funcionar en móvil (≤ 768 px); el sidebar colapsa en un menú.
- **Idioma**: textos de la UI en español; nombres de código (variables, componentes) en inglés.
- **Variables de entorno**: solo `import.meta.env.VITE_*`. Nunca escribas llaves en el código.

## Datos

Tabla `students` (1,000 filas):

| columna | tipo | valores |
|---|---|---|
| id | bigint (PK) | 1…1000 |
| gender | text | male, female |
| ethnicity | text | group A … group E |
| parental_education | text | some high school, high school, some college, associate's degree, bachelor's degree, master's degree |
| lunch | text | standard, free/reduced |
| test_prep | text | completed, none |
| math_score, reading_score, writing_score | int | 0–100 |
| pass_math | int | 1 si math_score ≥ 60, si no 0 |

## API de ML

`POST {VITE_ML_API_URL}/predict`

```json
{ "gender": "female", "ethnicity": "group C", "parental_education": "bachelor's degree",
  "lunch": "standard", "test_prep": "completed", "reading_score": 72, "writing_score": 68 }
```

Respuesta:

```json
{ "prediction": 1, "label": "Aprueba", "confidence": 0.82, "probabilities": { "pass": 0.82, "fail": 0.18 } }
```

`GET /health` → `{ "status": "ok", "model_loaded": true }`. En Render free tier la primera llamada puede tardar 30–60 s.

## Comandos

- Frontend: `cd frontend && npm run dev` → http://localhost:5173
- ML API local: `cd ml-api && .venv/Scripts/python -m uvicorn app.main:app --reload` → http://localhost:8000/docs
- Reentrenar: `cd ml-api && .venv/Scripts/python scripts/train.py` (luego sube `model/model.pkl`)
- Build: `cd frontend && npm run build`
