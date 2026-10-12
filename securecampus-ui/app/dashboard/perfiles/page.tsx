"use client";

import { useEffect, useState } from "react";

// Define la estructura de los datos de sesion.
interface UsuarioSesion {
    nombre: string;
    correo: string;
    rol: number;
}

// Define la vista del modulo de perfiles de usuario.
export default function Perfiles() {
    // Define el estado local para almacenar la informacion de la cuenta activa.
    const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

    // Recupera los datos de la sesion almacenada localmente al montar el componente.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            // Ignora la advertencia de renderizado en cascada para leer el almacenamiento del navegador de forma segura.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsuario(JSON.parse(data));
        }
    }, []);

    // Traduce el valor numerico del rol a su representacion de cadena de texto.
    const getNombreRol = (rol: number | undefined) => {
        if (rol === undefined) return "Desconocido";
        const roles = ["Estudiante", "Profesor", "Administrador", "Jefe de Carrera"];
        return roles[rol] || "Desconocido";
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Mi Perfil</h2>
                <p className="text-gray-600 mt-2">Consulta y gestiona tu informacion personal e institucional.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-6 mb-8 border-b pb-8">
                    <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center text-white text-4xl font-bold uppercase shadow-inner">
                        {usuario?.nombre?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{usuario?.nombre || "Usuario no identificado"}</h3>
                        <span className="inline-block mt-2 px-4 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold tracking-wide">
                            {getNombreRol(usuario?.rol)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Correo Institucional</p>
                        <p className="text-lg font-medium text-blue-900">{usuario?.correo || "No disponible"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Estado de la Cuenta</p>
                        <p className="text-lg font-medium text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Activa
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}