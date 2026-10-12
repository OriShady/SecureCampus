"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Curso {
    id: number;
    nombre: string;
}

interface Inscripcion {
    id: number;
    estudianteId: number;
    estudiante?: {
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno?: string;
    };
}

interface SesionProfesor {
    id: number;
    rol: number;
}

export default function MisListas() {
    const [profesorId, setProfesorId] = useState<number | null>(null);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [cursoId, setCursoId] = useState("");
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [cargandoCursos, setCargandoCursos] = useState(true);
    const [cargandoLista, setCargandoLista] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarCursos = async () => {
            try {
                const sesion = localStorage.getItem("usuario");
                if (!sesion) {
                    throw new Error("No se encontro una sesion activa.");
                }

                const usuario: SesionProfesor = JSON.parse(sesion);
                if (usuario.rol !== 1) {
                    throw new Error("Este modulo es exclusivo para profesores.");
                }
                setProfesorId(usuario.id);
                setCursos(await api.get(`/cursos/profesor/${usuario.id}`));
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar tus grupos asignados.");
            } finally {
                setCargandoCursos(false);
            }
        };

        cargarCursos();
    }, []);

    useEffect(() => {
        let cancelada = false;

        const cargarLista = async () => {
            if (!cursoId || profesorId === null) {
                setInscripciones([]);
                return;
            }

            setCargandoLista(true);
            setError("");
            try {
                const data = await api.get(`/inscripciones/profesor/${profesorId}/curso/${cursoId}`);
                if (!cancelada) {
                    setInscripciones(data);
                }
            } catch (err) {
                console.error(err);
                if (!cancelada) {
                    setInscripciones([]);
                    setError(err instanceof Error ? err.message : "No se pudo cargar el listado del grupo seleccionado.");
                }
            } finally {
                if (!cancelada) {
                    setCargandoLista(false);
                }
            }
        };

        cargarLista();
        return () => {
            cancelada = true;
        };
    }, [cursoId, profesorId]);

    const cursoSeleccionado = cursos.find((curso) => curso.id === Number(cursoId));
    const alumnosOrdenados = [...inscripciones].sort((a, b) =>
        nombreAlumno(a).localeCompare(nombreAlumno(b), "es")
    );

    return (
        <section className="printable-area mx-auto w-full max-w-4xl space-y-6">
            <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">Mis Listas</h2>
                <p className="mt-2 text-gray-600">Consulta e imprime el listado de alumnos inscritos en tus grupos.</p>
            </header>

            <div className="print-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <label htmlFor="grupo" className="mb-2 block text-sm font-semibold text-gray-700">Grupo o materia</label>
                <select
                    id="grupo"
                    className="w-full rounded border border-gray-300 bg-slate-50 p-3 text-gray-800 focus:border-orange-500 focus:outline-none"
                    value={cursoId}
                    onChange={(event) => setCursoId(event.target.value)}
                    disabled={cargandoCursos}
                >
                    <option value="">{cargandoCursos ? "Cargando grupos..." : "Selecciona un grupo..."}</option>
                    {cursos.map((curso) => <option key={curso.id} value={curso.id}>{curso.nombre}</option>)}
                </select>
            </div>

            {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

            {cursoId && (
                <div id="mis-listas-print" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-blue-900">{cursoSeleccionado?.nombre}</h3>
                            <p className="text-sm text-gray-600">
                                {cargandoLista ? "Cargando lista..." : `${inscripciones.length} alumnos inscritos`}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            disabled={cargandoLista || inscripciones.length === 0}
                            className="print-hidden rounded bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Imprimir lista
                        </button>
                    </div>

                    {cargandoLista ? (
                        <p className="py-8 text-center text-sm text-gray-500">Cargando alumnos...</p>
                    ) : alumnosOrdenados.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-blue-900 text-white">
                                        <th className="w-20 p-3 text-sm">N.º</th>
                                        <th className="p-3 text-sm">Nombre del alumno</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumnosOrdenados.map((inscripcion, index) => (
                                        <tr key={inscripcion.id} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                                            <td className="border-b border-gray-200 p-3 text-sm text-gray-600">{index + 1}</td>
                                            <td className="border-b border-gray-200 p-3 text-sm font-medium text-gray-800">
                                                {nombreAlumno(inscripcion)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="rounded border border-dashed border-gray-200 bg-slate-50 p-8 text-center text-sm text-gray-500">
                            Este grupo aun no tiene alumnos inscritos.
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}

function nombreAlumno(inscripcion: Inscripcion): string {
    if (!inscripcion.estudiante) {
        return `ID ${inscripcion.estudianteId}`;
    }

    return [
        inscripcion.estudiante.nombre,
        inscripcion.estudiante.apellidoPaterno,
        inscripcion.estudiante.apellidoMaterno,
    ].filter(Boolean).join(" ");
}
