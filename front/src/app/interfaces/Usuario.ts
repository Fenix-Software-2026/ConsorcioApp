export interface Usuario {
    username: string;         
    email: string;
    rol: string;
    unidad_detalle: unidad; 
}

interface unidad{
    departamento: string;
    piso: number;
}