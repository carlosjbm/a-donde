-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 17-06-2026 a las 15:33:30
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `a-donde`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `icono` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `icono`, `created_at`, `updated_at`) VALUES
(1, 'Carnico', 'carnico', 'iconopara efectivo', '2026-05-31 22:45:43', '2026-05-31 22:45:43'),
(2, 'Dispensa', 'dispensa', 'icono pra transfrencia', '2026-05-31 22:45:43', '2026-05-31 22:45:43'),
(3, 'Aseo', 'Aseo', 'Aseo', '2026-06-04 21:31:43', '2026-06-04 21:31:43'),
(4, 'Disfrute personal', 'Disfrute personal', 'Disfrute personal', '2026-06-04 21:31:43', '2026-06-04 21:31:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_at` datetime NOT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `id_producto` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `agotado` tinyint(1) NOT NULL,
  `fecha_agotado` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=38;

--
-- Volcado de datos para la tabla `compras`
--

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lugares`
--

CREATE TABLE `lugares` (
  `id` int(11) NOT NULL AUTO_INCREMENT ,
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

--
-- Volcado de datos para la tabla `lugares`
--

INSERT INTO `lugares` (`id`, `nombre`, `descripcion`, `direccion`, `latitud`, `longitud`, `created_at`, `updated_at`, `transferencia`, `estrellas`) VALUES
(1, 'D\'Soto', 'D\'Soto', 'Matanzas, Via Blanca, Cuba', 23.03603248, -81.54808849, '2026-05-31 22:01:08', '2026-06-16 09:08:23', 1, 5),
(2, 'El Garajito', 'El Garajito', 'Peñas Altas, Matanzas, 41100, Cuba', 23.03763000, -81.53636930, '2026-06-02 00:14:33', '2026-06-15 13:03:24', 0, 2),
(3, 'El Callejon', 'El Callejon', 'En el callejoncito', 0.00000000, 0.00000000, '2026-06-04 21:01:22', '2026-06-14 12:16:54', 1, 3),
(4, 'Quiosco la Loma', 'La loma', 'Subiendo la loma del costado de la base de transmetro, dos cuadras subiendo', 23.03510000, -81.53760000, '2026-06-04 21:01:22', '2026-06-16 08:45:22', 1, 3),
(5, 'Quiosco Los Garajes ', 'Los garajes', 'Justo al final de la calle que lleva hacia los garajes del 13 plantas buscando la salida al semaforo', 0.00000000, 0.00000000, '2026-06-04 21:07:40', '2026-06-04 21:07:40', 0, 1),
(6, 'Small Garage', 'Sólo aceptan mitad y mitad por transferencia', 'Justo al lado de la heladeria Los Pitufos', 0.00000000, 0.00000000, '2026-06-04 21:16:51', '2026-06-14 15:21:11', 1, 1),
(8, 'Quiosco 1', '', '191 entre 198 y 200 Reparto Iglesias', 23.03558600, -81.54093100, NULL, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `packs`
--

CREATE TABLE `packs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `packs`
--

INSERT INTO `packs` (`id`, `nombre`, `usuario_id`, `created_at`) VALUES
(11, 'Standard', 5, '2026-06-14 12:19:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paks_productos`
--

CREATE TABLE `paks_productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pack` int(11) NOT NULL,
  `id_prod` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `unidades_compradas` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paks_productos`
--

INSERT INTO `paks_productos` (`id`, `id_pack`, `id_prod`, `usuario_id`, `cantidad`, `unidades_compradas`) VALUES
(25, 11, 23, 5, 2, 1),
(26, 11, 26, 5, 20, 0),
(28, 11, 30, 5, 2, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presupuestos`
--

CREATE TABLE `presupuestos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_date` datetime NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `valor` decimal(11,0) NOT NULL,
  `valor_inicial` decimal(12,2) NOT NULL DEFAULT 0.00,
  `user_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `presupuestos`
--

INSERT INTO `presupuestos` (`id`, `created_date`, `descripcion`, `valor`, `valor_inicial`, `user_id`, `activo`) VALUES
(16, '2026-06-14 14:39:09', 'Medio', 7500, 25000.00, 5, 1),
(17, '2026-06-16 10:40:09', 'Refuerzo', 1000, 1000.00, 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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

--
-- Volcado de datos para la tabla `productos`
--

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_precios`
--

CREATE TABLE `producto_precios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) NOT NULL,
  `precio` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fuente` enum('manual','compra','importacion','sistema') NOT NULL DEFAULT 'manual',
  `notas` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `producto_precios`
--

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sesiones`
--

INSERT INTO `sesiones` (`id`, `usuario_id`, `refresh_token`, `expires_at`) VALUES
(5, 5, '762db17b40b25ecc271e2ca8510242cfa0c385c16d3db9f0d9916374dd3da335f32dcfeb45a4ad6b21caf6dae491edf475364cd81b3c2c40fc165f712a54e4a7', '2026-06-07 12:37:01'),
(9, 5, '703319f2e70b65691b9e951027c6070389fd910a1822b58981d6cb3b1c10dd6f4281a34cf5aa74265681889efdf52f172c501a8f9bce1bc2ede21805e85b3423', '2026-06-07 15:32:01'),
(12, 5, '1e088a6a565131fd471045521f1b19957745924e6107f49ba6d4d0330ea47518e26ae897035052be53bae638193a1f9ec8018713ed4229c63c8a05402ff65a02', '2026-06-07 16:26:47'),
(13, 5, '3a2183e7a1b4348d52e01e9890595c4d0bf56b6de72736337822e7fa76becd4501f4643c9038f29085e727059f5adef1acdb247d99e444e1cbcd8da01fc8ff34', '2026-06-07 16:34:12'),
(26, 5, '63d76ad412cefe6f1d1ba38343659aa750848be97b82c1e795a9fe57a52387fb1b8cea6b75d514225ef4adf72761e2cf4cc5874c9bfc8034d0288c9f206ca64c', '2026-06-08 17:34:08'),
(40, 5, '54463c8fc18d70210b0ab087cc5b4623d25c20d618996b9e0bacc49a9ebc1bf8a0afe4a2a6b3b1d72de0b953c96bcc02c9479c90c1b1f0310a4da85de11f517e', '2026-06-09 09:40:46'),
(43, 5, '465f3f2abd624037be7da07022decc10668b3a05e338db4f8eebd3acae51df3601512a22d2ca352cde2754d4744536b2f2cb31dbd2409aff7948a1a55d6aa3f7', '2026-06-09 10:19:14'),
(50, 9, '9e1e1b39b1224f5445ef908b7c46c189d39c141c2910faf930ba40b067dba69fe6dff723bd341dd234aa915a8675f0d3d5010166527011f98e4d9fc660edf51f', '2026-06-10 18:10:00'),
(51, 5, 'a65c53f11d2409d90eb8e3efb9b3084c06bb5579d5f19539b30abe313ac413d2251d201a00e3bf109cf32e108093be05457aa2253b60c5d06e2c3aab3abe5c3e', '2026-06-10 18:12:23'),
(52, 5, '470525ba6a60bbe49bdd8c6a8cf48b9a3bacb5f4d08a59ceec4f1a73eeebb294d30d07580ef115cac066ad445d989a6607946680d067d66baaba315fa932949f', '2026-06-10 18:12:43'),
(81, 5, '3d0f2514e7f4f883d9ecaa28a43d451b9fe67c23168ccd84031664c6c7fcc27d9a9ecac618a8ec81bfbf0b5c59dd0e011f18a078a4218262978a2e52a417f638', '2026-06-13 16:57:30'),
(84, 5, 'ece0302971ea51f49bded2141c34d0e0b5493251078978e72a8ff8dfe369dce1e1b5c3414c382adab9f1c0abb7f4f237bf4eb1df2156b00adc42b0da1bde6e2e', '2026-06-14 09:25:57'),
(87, 5, 'ecfea9901a94fb1a71082c4e5a9f615d01b880dce7088dc9da13116848fefd2c1bef693eac3015ae467489122bacf06a778b7dcf0b515ed30999732e8b2216cd', '2026-06-16 14:30:22'),
(89, 5, '174f5e1c293937f3826e8c99e9bb8af5dad1ccb29b9bb8378a3a81a4be23fefc3e595426777f5c48f2aa5cf51670d5ee746d2138db501186696843124e5d1cd8', '2026-06-16 15:17:48'),
(92, 5, '3edf624962715bf69eec3951d52ffedfee2364afdb60ee9a8874d2265c8fd73f7b864e5b3724dcb7471da42becc6653c7b52163ff10211f3a3e6b7c77f214acc', '2026-06-17 11:00:21'),
(93, 5, '48c1dbda1f5c03a4c2734c8853e03054c8c30507384f1b0be8c7cfc294690d04e9c77644df84ee7168e9dd01232efa394beb01dff6313d37721790f080731fe0', '2026-06-17 11:17:49'),
(96, 5, 'b6be8cb97956fec339510dbdd05989e902e97decef87c0f215a57c982ee56755046d02d9c984d9c8f87a47bbb0dc979a4c5da40843263df98e49b5a86149c429', '2026-06-17 12:02:41'),
(99, 5, 'f73ee9b0f649c06665c215f48180ac09b42c696a769773061412838d6b464c7f39b19bea6c1c96c7f9d376f63f2293af75016e4042da5bae09379f01a45824b5', '2026-06-17 12:27:25'),
(100, 5, 'adf30347efbcf2ff66df4290e7c528fcda21175356c69ba5a468a6cb3d3bbc751d0f559f11a7b54918ac53fc2cf153df9eae613deb1e8e96e06a1c588f0d51f7', '2026-06-17 12:27:50'),
(103, 5, '6236a8f3d5165396760d09a32673fa57a6c122f12bfd9e1c81a5eda8bbcebcdbcacbcde6d078d176c170a4b43f42e523fc7d834d19e751c27f34bac314fa71fe', '2026-06-17 13:14:59'),
(105, 5, 'da9feaf6b3242263e342cfbe444f6d33280dae3e9f44aa2a24c454ce8198da5b2e75dd5865784d2c6c045e683eb6168e1e2cf053cbc23f5d1ab3cc3ed50f84ee', '2026-06-17 13:59:18'),
(109, 5, '94970dcdcce09a9012d825e67c21fb8b89bedbea149f9a0323dbceec01046c1c53873d268786a39baf37d1f9049169005db9d446ed484604867c7e37a92bd082', '2026-06-17 14:17:31'),
(112, 5, '6e85717223a0d8552a8188cd4cf0d21459fa3664277c4a975c9853b82c2640d285bed80015b8f8af4e835cdafe5357fa95f47147eb8a8e4b49cbd40b58dfbccc', '2026-06-17 14:42:33'),
(115, 5, '69b617b603dc8dd9b20b3add863fc4293ac8b6b6d64b69be99da39d4f8ae074b2cdff989dfdab8ef7ba98e236e3f57f4ae33d1e2196fb7a6b2c07530dcad70c9', '2026-06-17 15:15:58'),
(117, 5, '68f9f2125733363e969774acec98e6fb369000a42b99a29f83b25e8889dc571d515cadda4550e6faac998239ea105ec0b056d8b16a3b0b40e0958dd6c1b75d1f', '2026-06-17 15:35:36'),
(119, 5, 'ee41746c89422aae4f9e6017ab66db506154c3e112986e79f8874aa8a7371d75bf7808a0fe29dfc1df573eeefab20cfbacef0c110e4b0b897b368f5051382042', '2026-06-17 15:53:39'),
(123, 5, '47b271d55a38fee31ca9b463a9350fef74e3c6922e4db58a2d222c4842ee4cd18546b90264bdb6ea5ee3138d25d0857a797460462c37ac3edc7321e5902cdf50', '2026-06-17 16:24:48'),
(124, 5, '5e032fa27eb8074331de0daca4e73f27efe2ba5dd14519ded9a9061f241141fb9cfca14501aba5db431720b227dab21a3afe52d8cbad65b587addcbeaf4e9389', '2026-06-17 16:40:58'),
(128, 5, '7f6473430bf859ecf93a66f5afad23503a71c583122973a06d48d7b3f7731d28b3cfc764dad94dedc41d319f8388431efb50dc45e9ab96053f4dde3d3d77fa0b', '2026-06-19 06:48:17'),
(130, 5, '885af553c24a3423485b0fb6e16b8f9ba1e1737e6409acf4165509f0c319dfefedbab99343e828d870f20c2c01183dc44bc9c7fd2e2422ef18eaac7be781587c', '2026-06-19 07:05:19'),
(133, 5, '3048d9dc3a359ea346fb6cd94c4fe4edf20ecb616d91b52fb3bd1044bc2b1bd93e1517201310fa4128eac0fd298fd1edf5dd3b5bf59e1703568de9b3f281a53f', '2026-06-19 07:40:06'),
(135, 5, '42dd52abd137e37af7eb1113e682ea507bacceadb34ccb27a324dcc52ac713a92a25d4cad1fd44a9ef315e98308da4ff29221f8e51f4da8e30e300586a64c520', '2026-06-19 07:55:59'),
(143, 5, 'd54b09ac9d48f98afdf020e8db604c4ea35b3548bead0671b1be67a38e10c413b6720ddc613dd116186263b890fafa4142e2e692b542062e1a903bb68c07638a', '2026-06-21 12:28:11'),
(155, 5, '34df33e233384dedca57d90a0dd34a4079113233d68d5629372848ed4a52764a917cdccad9dee08f11a1260d58196ed63eda0208e984fe80f51cae02167d4eb8', '2026-06-21 21:40:17'),
(156, 5, '7b7799981063359346f8d5877c12a67d4d3a9cf3b87f18abb6286ec67be5c54d3e33d41f1a90725cfeac0b0038970842d3bb4cfcac07bd426e85a90c86ce5f33', '2026-06-21 21:40:22'),
(162, 5, '96404421f843de4170bb2aed40106323f5ab03636593d8d4d6af82cf921205c426d9a2ca96c96201ad9b326db17c8fdc7270aa882f35b7188b2949690e917565', '2026-06-22 08:48:36'),
(164, 5, '3d065729c66c9141a1b45e6073f9ca067a35178486af86801223890e5252f87457a543da6dbeb4c355dbc398c308d624ab7ecf9a4fddaf3477f2cb33c3535a25', '2026-06-22 09:20:34'),
(165, 5, '0ef6e67452df177a0283c1ff0ca1fc64c710cc4e0b09915c14b1e0bf86e4f38b626f26c254cca0b8646e52b810f837545ec46af9a483ac09b22719a7a25db2f1', '2026-06-22 09:35:26'),
(166, 5, 'fd2da3864bde65a2d675e3ef12f889aa2b294323ca1ecc4f0129cc7ba9e9334200e6bd0dc92e75d5e11042005e8d5cda41beb6cb35dab3d0ff75d32dcf708d96', '2026-06-22 09:41:51'),
(167, 5, 'a5091b83e25cecd991cc140eb47edd3a1eb1200ed748151cc4f43eafbb2e371a1336ccf203c4f00a485d5ee9a523018b1bd17ac67e13e6aa12d858f61b9af6c3', '2026-06-22 09:41:59'),
(169, 5, 'aa62f748db0561181a955d33095404d7f3311f6afcfd5d7971e2ee5268cea62f02f8ba3574f192e29401cf6189d3d3aa7eb7f51d6a9fbd43c357baddcca68928', '2026-06-22 10:30:12'),
(170, 5, '2e4341227d8614263edb0ba6e1c6cc027a5d9cd927d1928685c7c1ccc3110434e636426230d1446387d081e992c46050bb23a6bdad70458c53611b03ab169add', '2026-06-22 10:30:17'),
(171, 5, '6ff7ea510b429adc39ace9050acd0ae019d67e80e2a4c342c1c2102d30c3f616607d10c8ac02359e404394591e9cae2f3f52cefa84cfa8aec84226f6e0f637dc', '2026-06-22 10:32:55'),
(172, 5, '978426fcd4061065dfaff3721c0fc87f587d72908f85ab81518b5a000f1be2c69abe6e8599ae03dd5b1612a596691107656841035dc0ace02bda67c7b8bc974b', '2026-06-22 10:36:38'),
(173, 5, '18c82df5818d3e9a95a7502a25084f097d9eda00a865673ae8d42042fb4c7f98be8084a86fc7213ff7e59d9d0abcfa28082fd4ce412082342e519344a20d5d7c', '2026-06-22 10:45:00'),
(174, 5, '5695c3d9a39e04b6ad00e72e1066947a839dcef9e399d0c25c2fdafd1b10ae9d5decea6ec81ffc97b4fa74b9523ae46e58c86f021f98f00fa400830f5d417732', '2026-06-22 10:59:15'),
(175, 5, 'afcbf04a9696f8b2b5c8dcfa5328d044e8db90061ded97e25fc8c738c42019f35caa67b5e04eb9687a820d6feef803db65a3cc873e08207a5742738bc2fd331a', '2026-06-22 11:11:34'),
(176, 5, '2bf3730604ae1871f92bebc40f0bd37a17ac488cc9d69b33621dda5ef21c60a40f0938b374f4a43b6460a7321da21931d328682ef18b438caf34ba985d2a162a', '2026-06-22 11:30:48'),
(178, 5, 'b6aeb39fd225c30a92f21fafa3065e0fce61a993f29742e61e50b0ffbe8635ef4181cbbbf4cf47ef1860056412aba3fee56e9e7f4b0895ab13973327c5368fd3', '2026-06-22 11:58:01'),
(179, 5, 'bb8981ffb042db65c3e50e029b50a5cf30d48107e973e264fb6b3c444c4a809ad91b6a0f23585c3936907cca1b7643130676ef078b87248a96a05f867b8638c8', '2026-06-22 11:58:10'),
(180, 5, 'f15723d1cca4080afecfac80963a481a8541252aa39db3ef268e20318acb2b8eecd9ae11e414dbecb085cc718cae2361db79eae367cb6a6a8e1ea8bd7d8f5682', '2026-06-22 12:02:01'),
(183, 5, '5424f14fbb6699d7e6438b49bde6baf084d599b02d5e6fec0ae05d81db8ed1a3f36fbd72449d9daf1647fb889c4e70afd3ebd2adcaa66b64b101e934e0a463c0', '2026-06-22 12:24:39'),
(185, 5, '9bc3ef88a99835deaaa47bcdedb6482fafab9c939a7b32327e5a8d1de36cd507adbc5bb0787ab3a72d806cb51d81344fd937450092bb6f4ffa5c426383e446f7', '2026-06-22 13:00:24'),
(186, 5, 'bf19c10cb61111823db383dcb8be6f57af4957a51e982ae9f835c4e85d9807238168535ba571ba921314d52264c44e11187a3035af3c9ae58ec6ac607cd252be', '2026-06-22 13:00:32'),
(193, 5, 'a4a247d7c935adb41687b735712212b406fcbcedf36dbdb38b647b0b97861f3f3cb3e84c2d0571cbeecd18fa207d607b75a1faa5183147bbde656df08723019a', '2026-06-23 08:41:28'),
(194, 5, '3372d14155b45b8a535d06fc3d0f788b41053a584321bc42efd05b704f416426059f81a24427cb664f8af6121a85c67731bc53eff5606707d48dc9d64147cac6', '2026-06-23 08:41:31'),
(196, 5, '45e0bf3fe54035df238277d064fc5b5c72c6d4312933ad0758e6b68fe5697ac2ef78beff47c3f5259f7e25163a29246e8342ff88a6185b99c93d271ec67352c3', '2026-06-23 08:58:25'),
(197, 5, '7283471cf82eaf152adb9d292e418fdbe075734669c368f893e66aed1df2d351e0d22831796e3d2bfa37f3b7af6630dc68097af43727b9dd1720145247fac78f', '2026-06-23 08:59:41'),
(198, 5, '4231fd4356b37dfcc1202a365a1cc3bbb3af89ba3e338931c06912a0494d0688e22695c37d73cf4862fe9e0245d47c611371b46a671a631c339ac59ceabdc652', '2026-06-23 09:20:29'),
(200, 5, '04429efd00f83c30ccfb950d1681877e40ace4951aad44426f366808d2607750d150fa0cfc6d5bd4a4918629ac8a2a97e0c78fce1ced5ede8da21c49dcd5cb8f', '2026-06-23 10:16:53'),
(201, 5, 'a2cab015f801c1b20250bed59c42d442876227404c6020b27729056d0a31a018ee6c7cac70d3a22ac6dfb0dea300e4920e6c8a6fded9d57aa32b0a310333bc0c', '2026-06-23 10:20:18'),
(203, 5, '761fff009773dadcb2e2174d8846d7c8bcbfd44929b4937a23aa7a71c1dc97dd43a33600f141fa89fe06e5afa277041a99ac8b8bba97fa60f3dd2397ff9267e4', '2026-06-23 12:34:06'),
(205, 5, '97f26e3d27661773fe518422e2af800d398f9660e8b85b3c582233e310af687b58a2caaac18a3454555057ed9797d20d8325c70bc5b97968fd1a16f5366673b5', '2026-06-23 14:28:42'),
(206, 5, 'aa64de0a75d679de758b21e446fa3eeb8f654c102f0c74be91c0a4fba54fefa9f8aa039c9fb3ff94f1b9f9e00c4f649df76b094a402c811ac7a86f8f97639f58', '2026-06-23 15:19:23'),
(207, 5, '7df2b1fb219e2e0d19ae2b5b5d1f9ac4fcdc3ca9cafb0283bfeb0c79a69c328465b79209db2a0ccd0c49f8ab9af6f1c88a044a13cc1861d93ebc7dc65e503165', '2026-06-23 15:32:09'),
(218, 5, 'a45c5b2f5c932c270237454465e345544eabb477e9fe5f2421ec6642ae93350c733dc2234ba86e2a505072d1caab65ebdcc6fe08612c3a57fa1eb09b1edfd07e', '2026-06-24 09:17:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `syst_roles`
--

CREATE TABLE `syst_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `syst_roles`
--

INSERT INTO `syst_roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'admin', 'Administrador'),
(2, 'user', 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol_id`, `created_at`, `updated_at`) VALUES
(5, 'Administrador ', 'admin@sys.com', '$2b$10$4X4uJ4TvDF2hkFM8BNvFmO0IwKv2itWiZMI7lUQE9ommuispbtLN6', 1, NULL, '2026-06-10 15:36:17'),
(9, 'Anisley', 'any@test.com', '$2b$10$KPuF3lJQjPvsObVWDFW6FOrURUa/C5mtLDJsF05vaLue8YGPO9YyC', 2, NULL, '2026-06-15 13:07:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoraciones`
--

CREATE TABLE `valoraciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_lugar` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `estrellas` int(11) NOT NULL CHECK (`estrellas` >= 1 and `estrellas` <= 5),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `valoraciones`
--

INSERT INTO `valoraciones` (`id`, `id_lugar`, `user_id`, `estrellas`, `created_at`) VALUES
(1, 1, 5, 5, '2026-06-16 16:09:43'),
(2, 3, 5, 3, '2026-06-16 16:01:27'),
(3, 4, 5, 3, '2026-06-16 16:01:42'),
(4, 5, 5, 1, '2026-06-17 09:02:36'),
(5, 1, 9, 4, '2026-06-16 16:17:08'),
(14, 2, 9, 2, '2026-06-16 16:11:49');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `lugares`
--
ALTER TABLE `lugares`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `direccion` (`direccion`);

--
-- Indices de la tabla `packs`
--
ALTER TABLE `packs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `paks_productos`
--
ALTER TABLE `paks_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pack` (`id_pack`),
  ADD KEY `id_prod` (`id_prod`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `presupuestos`
--
ALTER TABLE `presupuestos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_categ` (`id_categ`),
  ADD KEY `id_lugar` (`id_lugar`);

--
-- Indices de la tabla `producto_precios`
--
ALTER TABLE `producto_precios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pp_usuario` (`id_usuario`),
  ADD KEY `idx_pp_producto_created` (`id_producto`,`created_at`),
  ADD KEY `idx_pp_created` (`created_at`);

--
-- Indices de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `syst_roles`
--
ALTER TABLE `syst_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `rol_id` (`rol_id`);

--
-- Indices de la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_lugar_user` (`id_lugar`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT de la tabla `lugares`
--
ALTER TABLE `lugares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `packs`
--
ALTER TABLE `packs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `paks_productos`
--
ALTER TABLE `paks_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `presupuestos`
--
ALTER TABLE `presupuestos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `producto_precios`
--
ALTER TABLE `producto_precios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=219;

--
-- AUTO_INCREMENT de la tabla `syst_roles`
--
ALTER TABLE `syst_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `paks_productos`
--
ALTER TABLE `paks_productos`
  ADD CONSTRAINT `paks_productos_ibfk_1` FOREIGN KEY (`id_pack`) REFERENCES `packs` (`id`),
  ADD CONSTRAINT `paks_productos_ibfk_2` FOREIGN KEY (`id_prod`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `paks_productos_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `presupuestos`
--
ALTER TABLE `presupuestos`
  ADD CONSTRAINT `presupuestos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categ`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_lugar`) REFERENCES `lugares` (`id`);

--
-- Filtros para la tabla `producto_precios`
--
ALTER TABLE `producto_precios`
  ADD CONSTRAINT `fk_pp_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pp_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `syst_roles` (`id`);

--
-- Filtros para la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  ADD CONSTRAINT `valoraciones_ibfk_1` FOREIGN KEY (`id_lugar`) REFERENCES `lugares` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `valoraciones_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
