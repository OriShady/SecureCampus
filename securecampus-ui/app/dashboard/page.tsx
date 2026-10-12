"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Define la estructura de sesion para renderizar el nombre dinamicamente.
interface UsuarioSesion {
    nombre: string;
}

// Define la vista principal del panel con accesos directos a los modulos.
export default function Dashboard() {
    const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

    // Recupera los datos del usuario en sesion.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            // Ignora la advertencia de renderizado para cargar los datos en pantalla.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsuario(JSON.parse(data));
        }
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Bienvenido, {usuario?.nombre || "Usuario"}</h2>
                <p className="text-gray-600 mt-2">Panel principal de control. Selecciona una opcion rapida para continuar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/dashboard/perfiles" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                        P
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Mi Perfil</h3>
                    <p className="text-sm text-gray-500 mt-1">Consulta y actualiza tu informacion personal e institucional.</p>
                </Link>

                <Link href="/dashboard/calificaciones" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                        C
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Calificaciones</h3>
                    <p className="text-sm text-gray-500 mt-1">Revisa el historial academico y evaluaciones registradas.</p>
                </Link>

                <Link href="/dashboard/documentos" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                        D
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Documentos</h3>
                    <p className="text-sm text-gray-500 mt-1">Gestiona los archivos fisicos y expedientes del sistema.</p>
                </Link>
            </div>
        </div>
    );
}