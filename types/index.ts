export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  rol_id: number;
  created_at: string;
  updated_at: string;
}

export interface Lugar {
  id: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  created_at: string;
  updated_at: string;
  transferencia: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string | null;
  created_at: string;
  updated_at: string;
}
export interface Presupuesto {
  id: number;
  descripcion: string;
  created_date: Date;
  valor: number;
  user_id: number;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  id_lugar: number;
  escencial: boolean;
  imagen: string | null;
  id_categ: number;
  activo: boolean;
  fech_act_precio: string | null;
}

export type ProductoPrecioFuente = "manual" | "compra" | "importacion" | "sistema";

export interface ProductoPrecio {
  id: number;
  id_producto: number;
  precio: number;
  id_usuario: number | null;
  fuente: ProductoPrecioFuente;
  notas: string | null;
  created_at: string;
}

export interface PrecioHistorialPunto {
  periodo: string;
  fecha_inicio: string;
  promedio: number;
  minimo: number;
  maximo: number;
  cantidad: number;
}

export type PrecioHistorialPeriodo = "semana" | "mes" | "ano";

export interface PrecioHistorial {
  nombre: string;
  periodo: PrecioHistorialPeriodo;
  precio_actual: number;
  lugar_actual: string;
  variacion_porcentaje: number;
  tendencia: "sube" | "baja" | "estable";
  puntos: PrecioHistorialPunto[];
}

export interface Compra {
  id: number;
  create_at: string;
  observacion: string;
  id_producto: number;
  user_id: number;
  agotado: boolean;
  fecha_agotado: string | null;
}

export interface CompraConProducto extends Compra {
  producto_nombre: string;
  producto_precio: number;
}

export interface ProductoSearchResult {
  id: number;
  nombre: string;
  precio: number;
  lugar_id: number;
  lugar_nombre: string;
}

export interface SugerenciaProducto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  escencial: boolean;
  lugar_id: number;
  lugar_nombre: string;
}

export interface SugerenciaPack {
  id: number;
  nombre: string;
  total: number;
  precio_total: number;
  productos: SugerenciaProducto[];
}
