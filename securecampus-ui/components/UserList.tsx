"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

// Define la estructura de datos que se recibe del backend.
interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol: number;
}

// Define el componente para visualizar los usuarios registrados en formato de tabla.
export default function UserList() {
    // Define los estados locales para almacenar la informacion y controlar la interfaz.
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Ejecuta la carga de datos inmediatamente despues de que el componente se monta en pantalla.
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                // Realiza la peticion GET al controlador de usuarios.
                const response = await api.get("/usuarios");
                setUsuarios(response);
            } catch (err) {
                setError("Error al cargar la lista de usuarios.");
            } finally {
                setCargando(false);
            }
        };

        fetchUsuarios();
    }, []);

    // Traduce el valor numerico del rol a su representacion en texto.
    const getNombreRol = (rol: number) => {
        const roles = ["Estudiante", "Profesor", "Administrador", "Jefe de Carrera"];
        return roles[rol] || "Desconocido";
    };

    // Renderiza el estado de carga mientras se espera la respuesta del servidor.
    if (cargando) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-semibold tracking-wide">Cargando usuarios...</p>
            </div>
        );
    }

    // Renderiza el estado de error en caso de fallo de red.
    if (error) {
        return (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm font-medium">
                <p>{error}</p>
            </div>
        );
    }

    // Renderiza la tabla de datos.
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="p-3 rounded-tl-lg font-semibold text-sm tracking-wide">ID</th>
                        <th className="p-3 font-semibold text-sm tracking-wide">Nombre</th>
                        <th className="p-3 font-semibold text-sm tracking-wide">Correo</th>
                        <th className="p-3 rounded-tr-lg font-semibold text-sm tracking-wide">Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((user, index) => (
                        <tr key={user.id} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                            <td className="p-3 border-b border-gray-200 text-sm text-gray-700 font-medium">{user.id}</td>
                            <td className="p-3 border-b border-gray-200 text-sm text-gray-800 font-bold">{user.nombre}</td>
                            <td className="p-3 border-b border-gray-200 text-sm text-gray-600">{user.correo}</td>
                            <td className="p-3 border-b border-gray-200 text-sm">
                                <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-bold tracking-wide">
                                    {getNombreRol(user.rol)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {usuarios.length === 0 && (
                <div className="text-center p-6 text-gray-500 text-sm font-medium">
                    No hay usuarios registrados en el sistema.
                </div>
            )}
        </div>
    );
}