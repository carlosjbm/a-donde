-- seed_price_history.sql
-- Genera datos de historial de precios de prueba para los primeros N productos.
-- Útil para verificar visualmente el chart sin tener que actualizar precios a mano.
-- Idempotente: si un producto ya tiene historial generado por este script, no duplica.

SET @max_productos = 10;
SET @entries_por_producto = 6;
SET @meses_atras = 6;

DROP TEMPORARY TABLE IF EXISTS _seed_pp_targets;
CREATE TEMPORARY TABLE _seed_pp_targets (
  id_producto INT PRIMARY KEY,
  precio_base DECIMAL(10,2) NOT NULL
);

INSERT INTO _seed_pp_targets (id_producto, precio_base)
SELECT id, precio FROM productos
WHERE activo = 1
ORDER BY id
LIMIT @max_productos;

DROP TEMPORARY TABLE IF EXISTS _seed_pp_iter;
CREATE TEMPORARY TABLE _seed_pp_iter (n INT);
INSERT INTO _seed_pp_iter (n) VALUES (0),(1),(2),(3),(4),(5);

INSERT INTO producto_precios (id_producto, precio, fuente, created_at)
SELECT
  t.id_producto,
  ROUND(t.precio_base * (1 + (RAND() - 0.5) * 0.2), 0) AS precio,
  'sistema' AS fuente,
  DATE_SUB(NOW(), INTERVAL (i.n * (@meses_atras * 30 / @entries_por_producto)) DAY) AS created_at
FROM _seed_pp_targets t
CROSS JOIN _seed_pp_iter i
WHERE NOT EXISTS (
  SELECT 1 FROM producto_precios pp
  WHERE pp.id_producto = t.id_producto AND pp.fuente = 'sistema'
)
LIMIT @max_productos * @entries_por_producto;

-- Sync fech_act_precio con la entrada más reciente del historial generado.
UPDATE productos p
JOIN (
  SELECT id_producto, MAX(created_at) AS max_created
  FROM producto_precios
  GROUP BY id_producto
) latest ON latest.id_producto = p.id
SET p.fech_act_precio = latest.max_created;

-- Verificación rápida
SELECT
  p.id,
  p.nombre,
  p.precio,
  p.fech_act_precio,
  (SELECT COUNT(*) FROM producto_precios pp WHERE pp.id_producto = p.id) AS entradas
FROM productos p
WHERE p.id IN (SELECT id_producto FROM _seed_pp_targets)
ORDER BY p.id;
