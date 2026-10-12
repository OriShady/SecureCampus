"use client";

import { useEffect, useState } from "react";
import CalificacionesList from "../../../components/CalificacionesList";
import CalificacionForm from "../../../components/CalificacionForm";

// Define la estructura para evaluar el rol en sesion.
interface UsuarioSesion {
    rol: number;
}

// Define la vista del modulo integrando la logica de roles para estudiantes y profesores.
export default function Calificaciones() {
    const [rolUsuario, setRolUsuario] = useState<number | null>(null);

    // Carga los privilegios del usuario activo.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            const usuario: UsuarioSesion = JSON.parse(data);
            // Ignora la advertencia de renderizado para cargar el estado del rol.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRolUsuario(usuario.rol);
        }
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Calificaciones</h2>
                <p className="text-gray-600 mt-2">Consulta el registro academico y el desempeño en el curso.</p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Renderiza el formulario de captura unicamente para Profesores (1) o Administradores (2) */}
                {(rolUsuario === 1 || rolUsuario === 2) && (
                    <div className="xl:col-span-4">
                        <CalificacionForm />
                    </div>
                )}
                
                {/* Asigna el ancho completo si es estudiante, o comparte el espacio si hay formulario */}
                <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${(rolUsuario === 1 || rolUsuario === 2) ? 'xl:col-span-8' : 'xl:col-span-12'}`}>
                    <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Registro Historico</h3>
                    <CalificacionesList />
                </div>
            </div>
        </div>
    );
}