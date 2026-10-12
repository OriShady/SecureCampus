import { Usuario } from "./Usuario";

export interface Documento {
    id: number;
    nombreArchivo: string;
    rutaFisica: string;
    fechaCarga: string;
    estudianteId: number;
    estudiante?: Usuario;
}