export interface IReclamos {
    id: number;
    titulo: string;
    descripcion: string;
    categoria: string;
    estado: IEstados;
    imagen_url: null | string;
    fecha_creacion: string | Date; 
    fecha_actualizacion: string | Date;
    unidad: number;
    // usuario: 4
}

export type IEstados = 'pendiente' | 'en_proceso' | 'resuelto' | 'archivado';