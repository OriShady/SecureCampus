import { RolUsuario } from "./RolUsuario";

// Representa la estructura de datos del usuario que se comunicara con la API.
export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    password?: string;
    rol: RolUsuario;
}