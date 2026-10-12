"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Curso {
    id: number;
    nombre: string;
}

interface Calificacion {
    id: number;
    cursoId: number;
    valor: number;
}

interface RegistroAcademico {
    idCalificacion: number;
    nombreCurso: string;
    calificacionFinal: number;
}

/// Define el componente de solo lectura para visualizar el historial de evaluaciones del estudiante.
export default function HistorialAcademico() {
    const [registros, setRegistros] = useState<RegistroAcademico[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    /// Recupera los datos de evaluacion y el catalogo de materias al inicializar el componente.
    useEffect(() => {
        const cargarHistorial = async () => {
            const dataSesion = localStorage.getItem("usuario");
            if (!dataSesion) {
                setError("No se encontro una sesion activa.");
                setCargando(false);
                return;
            }

            try {
                const usuario: { id: number } = JSON.parse(dataSesion);
                // Ejecuta consultas en paralelo para optimizar el tiempo de respuesta.
                const [calificacionesData, cursosData] = await Promise.all([
                    api.get(`/calificaciones/estudiante/${usuario.id}`),
                    api.get("/cursos")
                ]);

                // Cruza los datos para asignar el nombre de la materia a la calificacion correspondiente.
                const historialEstructurado = calificacionesData.map((cal: Calificacion) => {
                    const cursoAsignado = cursosData.find((c: Curso) => c.id === cal.cursoId);
                    return {
                        idCalificacion: cal.id,
                        nombreCurso: cursoAsignado ? cursoAsignado.nombre : "Materia no identificada",
                        calificacionFinal: cal.valor
                    };
                });

                setRegistros(historialEstructurado);
            } catch (error) {
                console.error(error);
                setError("No se pudo cargar tu historial academico. Intenta recargar la pagina.");
            } finally {
                setCargando(false);
            }
        };

        cargarHistorial();
    }, []);

    if (cargando) {
        return <div className="text-center p-8 text-gray-500 text-sm">Cargando registros academicos...</div>;
    }

    if (error) {
        return <div role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Historial Academico</h3>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-blue-900">
                            <th className="p-3 font-semibold text-sm">Materia</th>
                            <th className="p-3 font-semibold text-sm text-right">Calificacion Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((registro) => (
                            <tr key={registro.idCalificacion} className="border-b border-gray-100 hover:bg-slate-50">
                                <td className="p-3 text-sm font-semibold text-gray-800">
                                    {registro.nombreCurso}
                                </td>
                                <td className="p-3 text-sm font-mono text-right text-gray-700">
                                    {registro.calificacionFinal}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {registros.length === 0 && (
                    <p className="text-center text-gray-500 text-sm p-8 bg-slate-50 mt-2 rounded border border-dashed border-gray-200">
                        Aun no cuentas con calificaciones registradas en tu historial.
                    </p>
                )}
            </div>
        </div>
    );
}