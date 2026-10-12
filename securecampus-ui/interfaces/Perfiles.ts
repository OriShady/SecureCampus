// Define las estructuras de datos para los perfiles de usuario.
export interface PerfilAdministrador {
    id: number;
    numeroEmpleado: string;
    nivelAcceso: string;
    usuarioId: number;
}

export interface PerfilEstudiante {
    id: number;
    numeroControl: string;
    semestreActual: number;
    usuarioId: number;
    carreraId: number;
}

export interface PerfilJefe {
    id: number;
    numeroEmpleado: string;
    fechaNombramiento: string;
    usuarioId: number;
    departamentoId: number;
}

export interface PerfilProfesor {
    id: number;
    numeroEmpleado: string;
    usuarioId: number;
    departamentoId: number;
}