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
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string | null;
  created_at: string;
  updated_at: string;
}
export interface Presupuesto{
  id:number,
  descripcion:string,
  created_date:Date,
  valor:number,
  user_id:number
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  id_lugar: number;
  escencial: boolean;
  imagen: string | null;
  id_categ: number;
  activo: boolean
}

export interface Compra {
  id: number;
  create_at: string;
  observacion: string;
  id_producto: number;
  user_id: number;
}

export interface CompraConProducto extends Compra {
  producto_nombre: string;
  producto_precio: number;
}
