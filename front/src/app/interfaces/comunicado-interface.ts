export interface Comunicado {
  id?: number;
  titulo: string;
  contenido: string;
  fecha_publicacion?: string;
  es_urgente: boolean;
  usuario?: number;
}