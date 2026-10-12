"use client";

import { useEffect, useState } from "react";
import GestorCalificaciones from "../../../components/GestorCalificaciones";
import HistorialAcademico from "../../../components/HistorialAcademico";

/// Define el componente principal para el modulo de calificaciones.
export default function CalificacionesPage() {
    const [rolUsuario, setRolUsuario] = useState<number | null>(null);
    const [verificando, setVerificando] = useState(true);

    /// Valida los privilegios y obtiene el rol del usuario en sesion.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            const usuario = JSON.parse(data);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRolUsuario(usuario.rol);
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVerificando(false);
    }, []);

    if (verificando) {
        return (
            <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Modulo de Calificaciones</h2>
                <p className="text-gray-600 mt-2">
                    {rolUsuario === 1 
                        ? "Asignacion de evaluaciones para alumnos matriculados." 
                        : "Consulta de historial academico."}
                </p>
            </div>

            {rolUsuario === 1 && (
                <div className="flex justify-center">
                    <GestorCalificaciones />
                </div>
            )}

            {rolUsuario === 0 && (
                <div className="flex justify-center">
                    <div className="w-full max-w-3xl">
                        <HistorialAcademico />
                    </div>
                </div>
            )}

            {rolUsuario !== 0 && rolUsuario !== 1 && (
                <div className="bg-red-50 p-8 rounded-lg border border-red-200 text-center max-w-2xl mx-auto mt-10">
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Acceso Restringido</h2>
                    <p className="text-red-600">El modulo de calificaciones es exclusivo para el personal docente y la comunidad estudiantil.</p>
                </div>
            )}
        </div>
    );
}