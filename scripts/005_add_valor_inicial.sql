ALTER TABLE presupuestos ADD COLUMN valor_inicial DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER valor;

UPDATE presupuestos SET valor_inicial = valor;