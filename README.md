# EduInsights

Análisis de rendimiento académico: dashboard, explorador de datos y predictor de ML.

| Carpeta | Qué es | Se despliega en |
|---|---|---|
| `frontend/` | React + Vite + Recharts | Vercel (Root Directory: `frontend`) |
| `ml-api/` | FastAPI + Random Forest (`model/model.pkl`) | Render (Root Directory: `ml-api`) |
| `supabase/migrations/` | SQL para la tabla `students` | Supabase SQL Editor |
| `CLAUDE.md`, `.mcp.json` | Contexto del proyecto y MCP de Supabase para Claude Code | — |
| `PRD.md` | Especificación del producto | — |
| `index.html`, `app.js`, `styles.css`, `config.js` | Versión estática original (HTML + Chart.js) | — |

## Arranque local

```bash
# Frontend
cd frontend
cp .env.example .env.local   # y llena tus valores
npm install
npm run dev                  # http://localhost:5173
```

```bash
# ML API
cd ml-api
python -m venv .venv
.venv/Scripts/activate       # Windows (en Mac/Linux: source .venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000/docs
```

Para reentrenar el modelo: `python scripts/train.py` (desde `ml-api/`).

## Configuración de servicios

- **Supabase:** importa `ml-api/data/StudentsPerformance.csv` como tabla `students` y ejecuta
  `supabase/migrations/001_initial_schema.sql`.
- **Render:** Root Directory `ml-api`, Build `pip install -r requirements.txt`,
  Start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. La versión de Python está en `ml-api/.python-version`.
- **Vercel:** Framework Vite, Root Directory `frontend`, y las variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`,
  `VITE_ML_API_URL`, `VITE_APP_TITLE` (con el prefijo `VITE_`).
- **Supabase MCP (Claude Code):** `.mcp.json` apunta al servidor MCP hospedado de Supabase (solo lectura).
  Al abrir el proyecto con Claude Code, aprueba el servidor y autentícate con `/mcp` (OAuth, sin tokens en el repo).
  Para limitarlo a tu proyecto agrega `&project_ref=TU-PROJECT-ID` a la URL.
