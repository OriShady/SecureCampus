"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";


interface Curso {
    id: number;
    nombre: string;
    cantidadParciales: number;
}

interface Calificacion {
    id: number;
    cursoId: number;
    numeroParcial: number;
    valor: number;
}

interface RegistroAcademico {
    cursoId: number;
    nombreCurso: string;
    parciales: Calificacion[];
    calificacionFinal: number | null;
}

/// Define el componente de solo lectura para visualizar el historial de evaluaciones del estudiante.
export default function HistorialAcademico() {
    const [registros, setRegistros] = useState<RegistroAcademico[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");    
    const [promedioGeneral, setPromedioGeneral] = useState<number | null>(null);


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
                
                const [calificacionesData, cursosData, promedioData] = await Promise.all([
                    api.get(`/calificaciones/estudiante/${usuario.id}`),
                    api.get("/cursos"),
                    api.get(`/calificaciones/promedio-general/estudiante/${usuario.id}`)
                ]);

                // Guarda el promedio general calculado por la API.
                setPromedioGeneral(promedioData.promedioGeneral);

                
                // Agrupa los parciales de cada materia.
                const historialEstructurado: RegistroAcademico[] =
                    (cursosData as Curso[])
                        .map((curso) => {
                            // Busca las calificaciones de este curso.
                            const parciales = (calificacionesData as Calificacion[])
                                .filter((cal) => cal.cursoId === curso.id)
                                .sort((a, b) => a.numeroParcial - b.numeroParcial);

                            // Omite cursos sin calificaciones registradas.
                            if (parciales.length === 0) {
                                return null;
                            }

                            // Solo calcula el promedio cuando
                            // todos los parciales estan registrados.
                            const calificacionFinal =
                                curso.cantidadParciales > 0 &&
                                parciales.length === curso.cantidadParciales
                                    ? Math.round(
                                        parciales.reduce(
                                            (suma, parcial) => suma + parcial.valor,
                                            0
                                        ) / curso.cantidadParciales
                                    )
                                    : null;

                            return {
                                cursoId: curso.id,
                                nombreCurso: curso.nombre,
                                parciales,
                                calificacionFinal
                            };
                        })
                        .filter(
                            (registro): registro is RegistroAcademico =>
                                registro !== null
                        );

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
                        <th className="p-3 font-semibold text-sm">
                            Materia
                        </th>
                        <th className="p-3 font-semibold text-sm">
                            Calificaciones parciales
                        </th>
                        <th className="p-3 font-semibold text-sm text-right">
                            Calificacion final
                        </th>
                    </tr>
                </thead>

                    
                <tbody>
                    {registros.map((registro) => (
                        <tr
                            key={registro.cursoId}
                            className="border-b border-gray-100 hover:bg-slate-50"
                        >
                            <td className="p-3 text-sm font-semibold text-gray-800">
                                {registro.nombreCurso}
                            </td>

                            <td className="p-3">
                                <div className="flex flex-wrap gap-2">
                                    {registro.parciales.map((parcial) => (
                                        <span
                                            key={parcial.id}
                                            className="bg-slate-100 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700"
                                        >
                                            Parcial {parcial.numeroParcial}: {parcial.valor}
                                        </span>
                                    ))}
                                </div>
                            </td>

                            <td className="p-3 text-sm font-mono text-right text-gray-700">
                                {registro.calificacionFinal !== null
                                    ? registro.calificacionFinal
                                    : "Pendiente"}
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
            
                {/* Promedio general del estudiante. */}
                <div className="mt-6 bg-slate-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-blue-900">
                            Promedio general
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Calculado con las calificaciones finales de los cursos completados.
                        </p>
                    </div>

                    {promedioGeneral !== null ? (
                        <span className="text-2xl font-bold text-blue-900">
                            {promedioGeneral.toFixed(2)}
                        </span>
                    ) : (
                        <span className="text-sm font-semibold text-orange-600">
                            Pendiente
                        </span>
                    )}
                </div>

        </div>
    );
}