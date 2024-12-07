export interface Venta {
    id: number;
    fecha_venta?: string;
    monto_total?: number;
    cliente_id: number;
    cliente?: string;
    estado?: string;
    notas: string;
    usuario_id?: number;
    usuario?: string;
    detalles: DetalleVenta[];
}

export interface DetalleVenta {
    id: number;
    cantidad: number;
    precio_unitario: number;
    producto_id: number;
}
