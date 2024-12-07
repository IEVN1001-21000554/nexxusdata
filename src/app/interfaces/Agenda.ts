export interface Agenda {
    id?: number;
    cliente_id: number;
    usuario_id: number;
    titulo: string;
    descripcion: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado: string;
    tipo?: string;
    created_at?: Date;
    updated_at?: Date;
    cliente?: any;
    usuario?: any;
}
