export interface Usuario {
    username: string;         
    email: string;
    is_active: boolean;
    rol: string;
    unidad_detalle: unidad; 
}

interface unidad{
    departamento: string;
    piso: number;
}