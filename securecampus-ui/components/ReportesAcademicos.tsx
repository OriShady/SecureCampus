"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

interface ReporteCalificacion {
    calificacionId: number;
    cursoId: number;
    curso: string;
    estudianteId: number;
    estudiante: string;
    valor: number;
}

interface SesionJefe {
    id: number;
    rol: number;
}

export default function ReportesAcademicos() {
    const [registros, setRegistros] = useState<ReporteCalificacion[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarReporte = async () => {
            try {
                const sesion = localStorage.getItem("usuario");
                if (!sesion) {
                    throw new Error("No se encontro una sesion activa.");
                }

                const usuario: SesionJefe = JSON.parse(sesion);
                if (usuario.rol !== 3) {
                    throw new Error("Este modulo es exclusivo para jefes de carrera.");
                }
                setRegistros(await api.get(`/calificaciones/departamento/${usuario.id}`));
            } catch (err) {
                console.error(err);
                setError(err instanceof Error
                    ? err.message
                    : "No se pudo cargar el reporte del departamento.");
            } finally {
                setCargando(false);
            }
        };

        cargarReporte();
    }, []);

    const filtrados = useMemo(() => {
        const termino = busqueda.trim().toLocaleLowerCase("es");
        if (!termino) return registros;
        return registros.filter((registro) =>
            `${registro.curso} ${registro.estudiante}`.toLocaleLowerCase("es").includes(termino)
        );
    }, [busqueda, registros]);

    return (
        <section className="printable-area mx-auto w-full max-w-6xl space-y-6">
            <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">Reportes Academicos</h2>
                <p className="mt-2 text-gray-600">Consulta de solo lectura para las materias impartidas en tu departamento.</p>
            </header>

            {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

            {cargando ? (
                <p className="rounded-lg bg-white p-8 text-center text-sm text-gray-500">Cargando reporte...</p>
            ) : !error && (
                <div id="reporte-academico-print" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-blue-900">Calificaciones por grupo</h3>
                            <p className="text-sm text-gray-600">{filtrados.length} registros</p>
                        </div>
                        <div className="print-hidden flex flex-wrap gap-2">
                            <input
                                type="search"
                                aria-label="Buscar por grupo o alumno"
                                placeholder="Buscar grupo o alumno..."
                                className="rounded border border-gray-300 px-3 py-2 text-sm"
                                value={busqueda}
                                onChange={(event) => setBusqueda(event.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="rounded bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
                            >
                                Imprimir reporte
                            </button>
                        </div>
                    </div>

                    {filtrados.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-blue-900 text-white">
                                        <th className="p-3 text-sm">Grupo / materia</th>
                                        <th className="p-3 text-sm">Alumno</th>
                                        <th className="p-3 text-right text-sm">Calificacion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrados.map((registro, index) => (
                                        <tr key={registro.calificacionId} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                                            <td className="border-b border-gray-200 p-3 text-sm font-medium text-gray-800">{registro.curso}</td>
                                            <td className="border-b border-gray-200 p-3 text-sm text-gray-700">{registro.estudiante.trim()}</td>
                                            <td className="border-b border-gray-200 p-3 text-right font-mono text-sm text-gray-700">{registro.valor}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="rounded border border-dashed border-gray-200 bg-slate-50 p-8 text-center text-sm text-gray-500">
                            {registros.length === 0
                                ? "Aun no hay calificaciones registradas para las materias de tu departamento."
                                : "No hay resultados para esa busqueda."}
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}
