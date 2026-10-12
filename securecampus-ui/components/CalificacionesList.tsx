"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

// Define la estructura de datos mapeando exactamente el modelo de C#.
interface Calificacion {
    id: number;
    estudianteId: number;
    cursoId: number;
    valor: number;
}

// Define el componente para visualizar las calificaciones registradas.
export default function CalificacionesList() {
    // Define los estados locales.
    const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Ejecuta la carga de datos al montar el componente.
    useEffect(() => {
        const fetchCalificaciones = async () => {
            try {
                // Realiza la peticion GET al controlador.
                const response = await api.get("/calificaciones");
                setCalificaciones(response);
            } catch (err) {
                // Establece el mensaje de error de red.
                setError("Error al cargar el registro de las calificaciones.");
            } finally {
                // Finaliza el indicador de carga.
                setCargando(false);
            }
        };

        fetchCalificaciones();
    }, []);

    // Renderiza el indicador de carga.
    if (cargando) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-semibold tracking-wide">Cargando registro...</p>
            </div>
        );
    }

    // Renderiza el mensaje de error.
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
                        <th className="p-3 font-semibold text-sm tracking-wide">ID Estudiante</th>
                        <th className="p-3 font-semibold text-sm tracking-wide">ID Curso</th>
                        <th className="p-3 rounded-tr-lg font-semibold text-sm tracking-wide">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {calificaciones.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                            <td className="p-3 border-b border-gray-200 text-sm text-gray-700 font-medium">{item.id}</td>
                            <td className="p-3 border-b border-gray-200 text-sm text-gray-800 font-bold">{item.estudianteId}</td>
                            <td className="p-3 border-b border-gray-200 text-sm text-gray-600">{item.cursoId}</td>
                            <td className="p-3 border-b border-gray-200 text-sm font-bold text-blue-900">{item.valor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {calificaciones.length === 0 && (
                <div className="text-center p-6 text-gray-500 text-sm font-medium">
                    No hay registro en el sistema.
                </div>
            )}
        </div>
    );
}