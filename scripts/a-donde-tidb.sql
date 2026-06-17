-- =============================================
-- Script limpio para TiDB Cloud
-- Base de datos: a-donde
-- Compatible con MySQL 8.0 / TiDB Serverless
-- =============================================

CREATE DATABASE IF NOT EXISTS `a-donde` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `a-donde`;

SET NAMES utf8mb4;

-- =============================================
-- TABLAS
-- =============================================

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `icono` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `icono`, `created_at`, `updated_at`) VALUES
(1, 'Carnico', 'carnico', 'iconopara efectivo', '2026-05-31 22:45:43', '2026-05-31 22:45:43'),
(2, 'Dispensa', 'dispensa', 'icono pra transfrencia', '2026-05-31 22:45:43', '2026-05-31 22:45:43'),
(3, 'Aseo', 'Aseo', 'Aseo', '2026-06-04 21:31:43', '2026-06-04 21:31:43'),
(4, 'Disfrute personal', 'Disfrute personal', 'Disfrute personal', '2026-06-04 21:31:43', '2026-06-04 21:31:43');

CREATE TABLE `lugares` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `direccion` varchar(500) NOT NULL,
  `latitud` decimal(11,8) NOT NULL,
  `longitud` decimal(11,8) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `transferencia` tinyint(1) NOT NULL,
  `estrellas` int(5) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lugares` (`id`, `nombre`, `descripcion`, `direccion`, `latitud`, `longitud`, `created_at`, `updated_at`, `transferencia`, `estrellas`) VALUES
(1, 'D\'Soto', 'D\'Soto', 'Matanzas, Via Blanca, Cuba', 23.03603248, -81.54808849, '2026-05-31 22:01:08', '2026-06-16 09:08:23', 1, 5),
(2, 'El Garajito', 'El Garajito', 'Peñas Altas, Matanzas, 41100, Cuba', 23.03763000, -81.53636930, '2026-06-02 00:14:33', '2026-06-15 13:03:24', 0, 2),
(3, 'El Callejon', 'El Callejon', 'En el callejoncito', 0.00000000, 0.00000000, '2026-06-04 21:01:22', '2026-06-14 12:16:54', 1, 3),
(4, 'Quiosco la Loma', 'La loma', 'Subiendo la loma del costado de la base de transmetro, dos cuadras subiendo', 23.03510000, -81.53760000, '2026-06-04 21:01:22', '2026-06-16 08:45:22', 1, 3),
(5, 'Quiosco Los Garajes ', 'Los garajes', 'Justo al final de la calle que lleva hacia los garajes del 13 plantas buscando la salida al semaforo', 0.00000000, 0.00000000, '2026-06-04 21:07:40', '2026-06-04 21:07:40', 0, 1),
(6, 'Small Garage', 'Sólo aceptan mitad y mitad por transferencia', 'Justo al lado de la heladeria Los Pitufos', 0.00000000, 0.00000000, '2026-06-04 21:16:51', '2026-06-14 15:21:11', 1, 1),
(8, 'Quiosco 1', '', '191 entre 198 y 200 Reparto Iglesias', 23.03558600, -81.54093100, NULL, NULL, 0, 1);

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol_id`, `created_at`, `updated_at`) VALUES
(5, 'Administrador ', 'admin@sys.com', '$2b$10$4X4uJ4TvDF2hkFM8BNvFmO0IwKv2itWiZMI7lUQE9ommuispbtLN6', 1, NULL, '2026-06-10 15:36:17'),
(9, 'Anisley', 'any@test.com', '$2b$10$KPuF3lJQjPvsObVWDFW6FOrURUa/C5mtLDJsF05vaLue8YGPO9YyC', 2, NULL, '2026-06-15 13:07:54');

CREATE TABLE `syst_roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `syst_roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'admin', 'Administrador'),
(2, 'user', 'Usuario');

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio` int(11) NOT NULL,
  `id_lugar` int(11) NOT NULL,
  `escencial` tinyint(1) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `id_categ` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `fech_act_precio` datetime NOT NULL,
  `notas` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `productos` (`id`, `nombre`, `precio`, `id_lugar`, `escencial`, `imagen`, `id_categ`, `activo`, `fech_act_precio`, `notas`) VALUES
(3, 'Vinagre', 450, 3, 0, 'vinagre claro ', 2, 1, '2026-06-03 12:58:05', NULL),
(4, 'Frijol Negro 1Kg', 720, 1, 0, NULL, 2, 1, '2026-06-14 12:25:27', NULL),
(5, 'Bolsa de Pan suave 10u', 480, 4, 0, NULL, 2, 1, '2026-06-17 09:20:45', NULL),
(6, 'Bolsa de Pan Suave 10u', 360, 2, 1, NULL, 2, 0, '2026-06-03 15:18:11', NULL),
(7, 'Bolsa de Pan Suave 10u', 450, 3, 1, NULL, 2, 1, '2026-06-07 08:41:19', NULL),
(8, 'Picadillo MDM 1Lbr', 380, 2, 1, NULL, 1, 1, '2026-06-05 15:18:25', NULL),
(9, 'Jaba de Pollo(4 lbrs)', 2950, 2, 0, NULL, 1, 1, '2026-06-07 10:08:28', NULL),
(10, 'Tubo Chorizo', 500, 4, 0, NULL, 1, 1, '2026-06-03 15:19:08', NULL),
(11, 'Tubo de Mortadella', 500, 4, 0, NULL, 1, 0, '2026-05-29 15:19:30', NULL),
(12, 'Aceite 900ml', 2000, 6, 1, NULL, 2, 1, '2026-06-06 17:10:32', NULL),
(13, 'Pasta de Tomate (lata)', 500, 3, 1, NULL, 2, 1, '2026-05-20 15:20:07', NULL),
(14, 'Arroz, Bolsa, 1Kg', 750, 3, 1, NULL, 2, 1, '2026-06-05 15:20:23', NULL),
(15, 'Arroz, Bolsa, 1Kg', 700, 4, 1, NULL, 2, 1, '2026-06-06 15:20:36', NULL),
(16, 'Azucar, Bolsa, 1Kg', 1020, 3, 0, NULL, 2, 1, '2026-06-14 15:17:18', NULL),
(17, 'Bolsa de Pan suave 10u', 360, 2, 1, 'pan', 2, 1, '2026-06-07 08:44:56', NULL),
(19, 'Bolsa Arroz 1KG', 730, 1, 1, NULL, 2, 1, '2026-06-14 12:20:43', NULL),
(20, 'Spagetti 500G', 325, 1, 0, NULL, 2, 1, '2026-06-14 12:23:17', NULL),
(21, 'Aceite 900ml', 1850, 1, 1, NULL, 2, 1, '2026-06-14 12:24:30', NULL),
(22, 'Aceite 900ml', 1800, 4, 1, NULL, 2, 1, '2026-06-14 12:24:56', NULL),
(23, 'Pasta dental Candado', 300, 2, 1, NULL, 3, 1, '2026-06-14 12:26:09', NULL),
(24, 'Jabon de Baño', 220, 2, 1, NULL, 3, 1, '2026-06-14 12:26:52', NULL),
(25, 'Papel Sanitario Pack-x4', 550, 3, 1, NULL, 3, 1, '2026-06-14 12:28:59', NULL),
(26, 'Huevo XU', 105, 4, 0, NULL, 2, 1, '2026-06-14 12:29:59', NULL),
(27, 'Salchicha', 600, 4, 0, NULL, 1, 1, '2026-06-14 12:30:42', NULL),
(28, 'Picadillo MDM 1Lbr', 400, 4, 1, NULL, 1, 1, '2026-06-14 12:31:47', NULL),
(29, 'Arroz x Lbr', 290, 5, 1, NULL, 2, 1, '2026-06-14 15:06:16', NULL),
(30, 'Pasta de tomate (lata)', 500, 4, 0, NULL, 2, 1, '2026-06-14 15:14:49', NULL),
(32, 'Paquete de hamburguesas x4', 500, 4, 0, NULL, 1, 1, '2026-06-14 15:24:57', NULL),
(33, 'Jabon de Baño', 250, 3, 1, NULL, 3, 1, '2026-06-16 08:26:47', NULL);

CREATE TABLE `compras` (
  `id` int(11) NOT NULL,
  `create_at` datetime NOT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `id_producto` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `agotado` tinyint(1) NOT NULL,
  `fecha_agotado` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `compras` (`id`, `create_at`, `observacion`, `id_producto`, `user_id`, `agotado`, `fecha_agotado`) VALUES
(38, '2026-06-14 14:39:43', '', 23, 5, 0, NULL),
(39, '2026-06-14 14:41:17', '', 4, 5, 0, NULL),
(40, '2026-06-14 14:41:22', '', 4, 5, 0, NULL),
(41, '2026-06-14 14:43:39', '', 21, 5, 0, NULL),
(42, '2026-06-14 14:44:16', '', 24, 5, 0, NULL),
(43, '2026-06-14 14:44:40', '', 25, 5, 0, NULL),
(44, '2026-06-14 14:52:24', '', 20, 5, 1, '2026-06-14 15:11:07'),
(45, '2026-06-14 14:52:29', '', 20, 5, 0, NULL),
(46, '2026-06-14 14:52:33', '', 20, 5, 0, NULL),
(47, '2026-06-14 14:52:37', '', 20, 5, 0, NULL),
(48, '2026-06-14 14:53:50', '', 28, 5, 1, '2026-06-14 14:55:26'),
(49, '2026-06-14 14:53:57', '', 28, 5, 1, '2026-06-14 14:55:26'),
(50, '2026-06-14 14:54:03', '', 28, 5, 0, NULL),
(51, '2026-06-14 14:55:00', '', 28, 5, 0, NULL),
(52, '2026-06-14 14:58:11', '', 19, 5, 0, NULL),
(53, '2026-06-14 14:58:16', '', 19, 5, 0, NULL),
(54, '2026-06-14 14:58:21', '', 19, 5, 0, NULL),
(55, '2026-06-14 14:58:24', '', 19, 5, 0, NULL),
(56, '2026-06-14 14:58:28', '', 19, 5, 0, NULL),
(57, '2026-06-14 14:58:31', '', 19, 5, 0, NULL),
(58, '2026-06-14 14:58:35', '', 19, 5, 0, NULL),
(59, '2026-06-14 14:58:39', '', 19, 5, 0, NULL),
(60, '2026-06-14 14:58:43', '', 19, 5, 0, NULL),
(61, '2026-06-14 14:58:47', '', 19, 5, 0, NULL),
(62, '2026-06-14 21:28:24', '', 27, 5, 0, NULL),
(63, '2026-06-14 21:28:30', '', 27, 5, 0, NULL),
(64, '2026-06-15 08:50:49', '', 24, 5, 1, '2026-06-15 08:51:41'),
(65, '2026-06-16 08:27:17', '', 33, 5, 0, NULL),
(66, '2026-06-16 08:27:21', '', 33, 5, 0, NULL),
(67, '2026-06-16 15:39:30', '', 16, 5, 0, NULL);

CREATE TABLE `presupuestos` (
  `id` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `valor` decimal(11,0) NOT NULL,
  `valor_inicial` decimal(12,2) NOT NULL DEFAULT 0.00,
  `user_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `presupuestos` (`id`, `created_date`, `descripcion`, `valor`, `valor_inicial`, `user_id`, `activo`) VALUES
(16, '2026-06-14 14:39:09', 'Medio', 7500, 25000.00, 5, 1),
(17, '2026-06-16 10:40:09', 'Refuerzo', 1000, 1000.00, 5, 1);

CREATE TABLE `packs` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `packs` (`id`, `nombre`, `usuario_id`, `created_at`) VALUES
(11, 'Standard', 5, '2026-06-14 12:19:19');

CREATE TABLE `paks_productos` (
  `id` int(11) NOT NULL,
  `id_pack` int(11) NOT NULL,
  `id_prod` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `unidades_compradas` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `paks_productos` (`id`, `id_pack`, `id_prod`, `usuario_id`, `cantidad`, `unidades_compradas`) VALUES
(25, 11, 23, 5, 2, 1),
(26, 11, 26, 5, 20, 0),
(28, 11, 30, 5, 2, 0);

CREATE TABLE `producto_precios` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `precio` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fuente` enum('manual','compra','importacion','sistema') NOT NULL DEFAULT 'manual',
  `notas` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `producto_precios` (`id`, `id_producto`, `precio`, `id_usuario`, `fuente`, `notas`, `created_at`) VALUES
(1, 3, 450, NULL, 'sistema', NULL, '2026-06-03 12:58:05'),
(2, 4, 850, NULL, 'sistema', NULL, '2026-06-03 12:58:18'),
(3, 5, 480, NULL, 'sistema', NULL, '2026-06-01 15:17:58'),
(4, 6, 360, NULL, 'sistema', NULL, '2026-06-03 15:18:11'),
(5, 7, 400, NULL, 'sistema', NULL, '2026-06-06 12:56:48'),
(6, 8, 380, NULL, 'sistema', NULL, '2026-06-05 15:18:25'),
(7, 9, 850, NULL, 'sistema', NULL, '2026-06-04 15:18:46'),
(8, 10, 500, NULL, 'sistema', NULL, '2026-06-03 15:19:08'),
(9, 11, 500, NULL, 'sistema', NULL, '2026-05-29 15:19:30'),
(10, 12, 1450, NULL, 'sistema', NULL, '2026-06-01 15:19:45'),
(11, 13, 500, NULL, 'sistema', NULL, '2026-05-20 15:20:07'),
(12, 14, 750, NULL, 'sistema', NULL, '2026-06-05 15:20:23'),
(13, 15, 700, NULL, 'sistema', NULL, '2026-06-06 15:20:36'),
(14, 16, 850, NULL, 'sistema', NULL, '2026-05-29 15:20:50'),
(15, 17, 550, NULL, 'sistema', NULL, '2026-06-06 12:56:27'),
(16, 12, 2000, 5, 'manual', 'Prueba', '2026-06-06 17:10:32'),
(17, 17, 480, 5, 'manual', 'Prueba', '2026-06-06 17:11:21'),
(18, 7, 450, 5, 'manual', NULL, '2026-06-07 08:41:19'),
(19, 17, 360, 5, 'manual', NULL, '2026-06-07 08:44:56'),
(20, 9, 2900, 5, 'manual', NULL, '2026-06-07 09:31:23'),
(21, 9, 2950, 5, 'manual', NULL, '2026-06-07 10:08:27'),
(22, 4, 750, 5, 'manual', 'Bajada de prueba', '2026-06-10 11:56:04'),
(23, 4, 850, 5, 'manual', 'pruba de modif desde el producto', '2026-06-12 07:22:04');

CREATE TABLE `sesiones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `valoraciones` (
  `id` int(11) NOT NULL,
  `id_lugar` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `estrellas` int(11) NOT NULL CHECK (`estrellas` >= 1 and `estrellas` <= 5),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `valoraciones` (`id`, `id_lugar`, `user_id`, `estrellas`, `created_at`) VALUES
(1, 1, 5, 5, '2026-06-16 16:09:43'),
(2, 3, 5, 3, '2026-06-16 16:01:27'),
(3, 4, 5, 3, '2026-06-16 16:01:42'),
(4, 5, 5, 1, '2026-06-17 09:02:36'),
(5, 1, 9, 4, '2026-06-16 16:17:08'),
(14, 2, 9, 2, '2026-06-16 16:11:49');

-- =============================================
-- ÍNDICES
-- =============================================

ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `lugares`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `direccion` (`direccion`);

ALTER TABLE `packs`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `paks_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pack` (`id_pack`),
  ADD KEY `id_prod` (`id_prod`),
  ADD KEY `usuario_id` (`usuario_id`);

ALTER TABLE `presupuestos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_categ` (`id_categ`),
  ADD KEY `id_lugar` (`id_lugar`);

ALTER TABLE `producto_precios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pp_usuario` (`id_usuario`),
  ADD KEY `idx_pp_producto_created` (`id_producto`,`created_at`),
  ADD KEY `idx_pp_created` (`created_at`);

ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `syst_roles`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `rol_id` (`rol_id`);

ALTER TABLE `valoraciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_lugar_user` (`id_lugar`,`user_id`),
  ADD KEY `user_id` (`user_id`);

-- =============================================
-- AUTO_INCREMENT
-- =============================================

ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

ALTER TABLE `lugares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `packs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `paks_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

ALTER TABLE `presupuestos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

ALTER TABLE `producto_precios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

ALTER TABLE `sesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=219;

ALTER TABLE `syst_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `valoraciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

-- =============================================
-- FOREIGN KEYS
-- =============================================

ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `paks_productos`
  ADD CONSTRAINT `paks_productos_ibfk_1` FOREIGN KEY (`id_pack`) REFERENCES `packs` (`id`),
  ADD CONSTRAINT `paks_productos_ibfk_2` FOREIGN KEY (`id_prod`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `paks_productos_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `presupuestos`
  ADD CONSTRAINT `presupuestos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categ`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_lugar`) REFERENCES `lugares` (`id`);

ALTER TABLE `producto_precios`
  ADD CONSTRAINT `fk_pp_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pp_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `syst_roles` (`id`);

ALTER TABLE `valoraciones`
  ADD CONSTRAINT `valoraciones_ibfk_1` FOREIGN KEY (`id_lugar`) REFERENCES `lugares` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `valoraciones_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
