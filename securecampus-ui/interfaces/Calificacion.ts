import { Usuario } from "./Usuario";
import { Curso } from "./Curso";

export interface Calificacion {
    id: number;
    valor: number;
    estudianteId: number;
    estudiante?: Usuario;
    cursoId: number;
    curso?: Curso;
}