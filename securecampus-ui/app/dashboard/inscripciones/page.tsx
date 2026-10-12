"use client";

import { useEffect, useState } from "react";
import InscripcionesManager from "../../../components/InscripcionesManager";

/// Define la vista principal del modulo de matriculaciones.
export default function InscripcionesPage() {
    const [autorizado, setAutorizado] = useState(false);
    const [verificando, setVerificando] = useState(true);

    /// Valida el nivel de acceso del usuario actual.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            const usuario = JSON.parse(data);
            if (usuario.rol === 2) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setAutorizado(true);
            }
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVerificando(false);
    }, []);

    if (verificando) return <div className="p-8 text-center">Verificando accesos...</div>;
    
    if (!autorizado) {
        return (
            <div className="bg-red-50 p-8 rounded-lg border border-red-200 text-center max-w-2xl mx-auto mt-10">
                <h2 className="text-2xl font-bold text-red-800">Acceso Denegado</h2>
                <p className="text-red-600">Modulo exclusivo para administradores.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Gestion de Inscripciones</h2>
                <p className="text-gray-600 mt-2">Asigna estudiantes a los grupos academicos disponibles.</p>
            </div>
            <InscripcionesManager />
        </div>
    );
}