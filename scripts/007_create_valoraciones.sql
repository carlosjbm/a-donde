CREATE TABLE IF NOT EXISTS valoraciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_lugar INT NOT NULL,
  user_id INT NOT NULL,
  estrellas INT NOT NULL CHECK (estrellas >= 1 AND estrellas <= 5),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_lugar_user (id_lugar, user_id),
  FOREIGN KEY (id_lugar) REFERENCES lugares(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
