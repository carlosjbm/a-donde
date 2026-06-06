-- 002_price_history.sql
-- Crea la tabla de historial de precios y la hidrata con los productos existentes.
-- Idempotente: se puede correr varias veces sin duplicar datos.

CREATE TABLE IF NOT EXISTS producto_precios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_producto INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  id_usuario INT NULL,
  fuente ENUM('manual', 'compra', 'importacion', 'sistema') NOT NULL DEFAULT 'manual',
  notas TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_pp_producto
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
  CONSTRAINT fk_pp_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL,

  INDEX idx_pp_producto_created (id_producto, created_at),
  INDEX idx_pp_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Backfill: por cada producto sin historial, crear una entrada inicial.
-- Usa fech_act_precio si existe, NOW() si está NULL.
-- Es seguro correr varias veces gracias al NOT EXISTS.
INSERT INTO producto_precios (id_producto, precio, fuente, created_at)
SELECT
  p.id,
  p.precio,
  'sistema' AS fuente,
  COALESCE(p.fech_act_precio, NOW()) AS created_at
FROM productos p
WHERE NOT EXISTS (
  SELECT 1 FROM producto_precios pp WHERE pp.id_producto = p.id
);

-- Sincronizar fech_act_precio con la entrada más reciente del historial.
-- Si después querés eliminar la columna, podés hacerlo sin perder data:
--   ALTER TABLE productos DROP COLUMN fech_act_precio;
UPDATE productos p
JOIN (
  SELECT id_producto, MAX(created_at) AS max_created
  FROM producto_precios
  GROUP BY id_producto
) latest ON latest.id_producto = p.id
SET p.fech_act_precio = latest.max_created
WHERE p.fech_act_precio IS NULL
   OR p.fech_act_precio < latest.max_created;
