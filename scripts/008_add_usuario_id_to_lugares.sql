-- Add usuario_id column to lugares to track place ownership
ALTER TABLE lugares
  ADD COLUMN usuario_id int(11) DEFAULT NULL AFTER estrellas,
  ADD KEY usuario_id (usuario_id);

-- Assign existing places to the admin user (id=1)
UPDATE lugares SET usuario_id = 1 WHERE usuario_id IS NULL;
