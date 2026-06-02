export interface IReclamos {
    id: number;
    titulo: string;
    descripcion: string;
    categoria: string;
    estado: string;
    imagen_url: null | string;
    fecha_creacion: string | Date; 
    fecha_actualizacion: string | Date;
    unidad: number;
    // usuario: 4
}

   