# PRD — EduInsights

> **Borrador inicial.** Revísalo y personalízalo con el prompt del Paso 6.2 de la guía antes de pedirle a Claude que construya las pantallas.
> Entre más detallado, menos correcciones tendrás que hacer.

## 1. Visión del producto

**Problema.** Docentes y coordinadores no tienen una forma rápida de ver qué factores (educación de los padres,
curso de preparación, tipo de almuerzo) se asocian con el desempeño en matemáticas, ni de identificar a tiempo a
estudiantes en riesgo de reprobar.

**Usuario objetivo.** Coordinadores académicos y docentes sin experiencia técnica que consultan la app desde
computadora o celular.

**Propuesta de valor.** Un solo lugar para (1) ver indicadores clave del grupo, (2) explorar y exportar los
registros con filtros y (3) estimar si un estudiante aprobará matemáticas con un modelo de ML.

## 2. Identidad visual

- **Nombre:** EduInsights
- **Paleta:**

| Rol | Hex | Uso |
|---|---|---|
| Primary | `#4F46E5` | Botones, links activos, series principales |
| Primary soft | `#EEF2FF` | Fondo de ítem activo en sidebar |
| Success | `#10B981` | "Aprueba", alta confianza |
| Warning | `#F59E0B` | Confianza moderada, API dormida |
| Danger | `#EF4444` | "En riesgo" |
| Background | `#F8FAFC` | Fondo de la app |
| Surface | `#FFFFFF` | Cards |
| Border | `#E2E8F0` | Bordes |
| Text / muted | `#0F172A` / `#64748B` | Texto |

- **Tipografía:** system-ui (Inter/Segoe UI). Títulos 28 px bold, subtítulos 16 px semibold, cuerpo 14 px.
- **Estilo:** cards blancas con borde de 1 px, radio 12 px, sombra sutil; espaciado generoso (24–32 px).

## 3. Arquitectura técnica

| Capa | Tecnología | Detalle |
|---|---|---|
| Frontend | React 19 + Vite, Recharts, React Router v6, CSS Modules | `frontend/`, desplegado en Vercel |
| Datos | Supabase (PostgreSQL + API REST) | Tabla `students`, acceso con publishable/anon key |
| ML | FastAPI + scikit-learn (Random Forest) | `ml-api/`, desplegado en Render |

Variables de entorno (frontend): `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`, `VITE_ML_API_URL`, `VITE_APP_TITLE`.

## 4. Pantallas

### Layout general
- **Sidebar** fijo a la izquierda (240 px) con logo y 3 links: Dashboard, Explorador, Predictor ML.
- En móvil (≤ 768 px) se convierte en barra superior con botón hamburguesa.

### 4.1 Dashboard (`/`)
1. **Fila de 4 KPI cards:**
   - *Promedio Matemáticas* — `AVG(math_score)`, 1 decimal.
   - *Tasa de Aprobación* — `% pass_math = 1`, 1 decimal.
   - *Impacto del Curso de Prep* — promedio de math con `test_prep = completed` menos con `none`, en puntos (+X.X).
   - *Total Estudiantes* — `COUNT(*)`.
2. **Fila de 2 gráficas:**
   - *BarChartWidget horizontal:* promedio de `math_score` por `parental_education`, ordenado de menor a mayor nivel
     educativo.
   - *Gráfica agrupada:* promedio de math, reading y writing por `gender` (3 series por género).

### 4.2 Explorador de datos (`/explorer`)
1. **FilterBar:** gender, parental_education, test_prep (selects con opción "Todos"), rango math_score (min–max),
   resultado (Todos / Aprueba / Reprueba). Botón "Limpiar filtros".
2. **Contador:** "Mostrando X de 1,000 estudiantes".
3. **DataTable:** columnas id, gender, ethnicity, parental_education, lunch, test_prep, math, reading, writing,
   resultado (badge verde/rojo). 10 filas por página, orden al hacer clic en encabezados.
4. **Botón "Exportar CSV":** descarga todas las filas que cumplen los filtros actuales.

### 4.3 Predictor ML (`/predictor`)
Layout de 2 columnas (1 columna en móvil).
- **Formulario (izquierda):** gender (radio pills), ethnicity (select), parental_education (select), lunch (radio
  pills), test_prep (toggle), reading_score y writing_score (input numérico + slider sincronizados, 0–100).
  Botón "Predecir".
- **Resultado (derecha):**
  - Sin predicción: ilustración + "Completa el formulario para obtener una predicción".
  - Con predicción: badge **APRUEBA** (success) o **EN RIESGO** (danger), barra de confianza con %, y etiqueta
    "Alta confianza" (> 75 %, verde) o "Confianza moderada" (50–75 %, ámbar).
- **Historial:** últimas 5 predicciones de la sesión (entradas clave + resultado).

## 5. Estados de UI

| Componente | Loading | Error | Vacío | Con datos |
|---|---|---|---|---|
| KPI card | Skeleton del tamaño de la card | "—" + tooltip con error | — | Valor + etiqueta |
| Gráficas | Skeleton 320 px | Mensaje dentro de la card + botón Reintentar | "Sin datos" | Gráfica |
| DataTable | LoadingSpinner | Banner rojo con mensaje | "Ningún estudiante coincide con los filtros" | Filas |
| Predictor | Spinner en el botón, botón deshabilitado | Banner amarillo si la API no responde (Render dormido) | Ilustración | Card de resultado |

## 6. Contratos de API

### Supabase (REST, vía `@supabase/supabase-js`)
- Todas las filas para agregados: `from('students').select('gender, parental_education, test_prep, math_score, reading_score, writing_score, pass_math')`
- Explorador: `.select('*', { count: 'exact' })` + `.eq(...)` por filtro + `.gte/.lte('math_score')` + `.range(from, to)`

### ML — `POST /predict`
Request:
```json
{ "gender": "female", "ethnicity": "group C", "parental_education": "bachelor's degree",
  "lunch": "standard", "test_prep": "completed", "reading_score": 72, "writing_score": 68 }
```
Response 200:
```json
{ "prediction": 1, "label": "Aprueba", "confidence": 0.82, "probabilities": { "pass": 0.82, "fail": 0.18 } }
```
Response 422: campo inválido. `GET /health` → `{ "status": "ok", "model_loaded": true }`.

## 7. Checklist de desarrollo

- [ ] Supabase: tabla `students` con 1,000 filas, `id` y `pass_math`
- [ ] Render: `/health` responde `model_loaded: true`
- [ ] `frontend/.env.local` configurado
- [ ] Dashboard con datos mock → datos reales
- [ ] Explorador con datos mock → filtros, paginación y CSV con Supabase
- [ ] Predictor con respuesta simulada → API real
- [ ] Responsive en móvil
- [ ] Sin errores en consola
- [ ] Deploy en Vercel con variables de entorno
