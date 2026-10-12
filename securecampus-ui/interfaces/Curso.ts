import { Usuario } from "./Usuario";

export interface Curso {
    id: number;
    nombre: string;
    profesorId: number;
    profesor?: Usuario;
}