ALTER TABLE lugares
  ADD COLUMN transferencia TINYINT(1) NOT NULL DEFAULT 0
  AFTER longitud;
