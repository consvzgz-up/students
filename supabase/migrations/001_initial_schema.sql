-- Paso 1.4 de la guía: ejecútalo en Supabase → SQL Editor DESPUÉS de importar
-- ml-api/data/StudentsPerformance.csv en la tabla "students".

-- 1. Agregar columna id como llave primaria autoincrementable
ALTER TABLE students ADD COLUMN id BIGSERIAL PRIMARY KEY;

-- 2. Agregar la columna pass_math
ALTER TABLE students ADD COLUMN pass_math INTEGER;

-- 3. Llenar la columna: 1 = aprobó (score >= 60), 0 = reprobó
UPDATE students
SET pass_math = CASE
  WHEN math_score >= 60 THEN 1
  ELSE 0
END;

-- 4. Verificar el resultado (esperado: 0 → 323 / 49.16, 1 → 677 / 74.17)
SELECT
  pass_math,
  COUNT(*) AS total,
  ROUND(AVG(math_score), 2) AS promedio_score
FROM students
GROUP BY pass_math;
