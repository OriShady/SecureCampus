"use client";

import { useState, useEffect } from "react";
import { api } from "../services/api";

interface Curso {
    id: number;
    nombre: string;
}

interface Inscripcion {
    id: number;
    estudianteId: number;
    cursoId: number;
    estudiante: {
        id: number;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno?: string;
    };
}

/// Define la vista para asignar calificaciones, restringida a las materias del docente.
export default function GestorCalificaciones() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [cargandoCursos, setCargandoCursos] = useState(true);
    const [cargandoAlumnos, setCargandoAlumnos] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [errorCarga, setErrorCarga] = useState("");

    const [cursoId, setCursoId] = useState("");
    const [estudianteId, setEstudianteId] = useState("");
    const [busquedaAlumno, setBusquedaAlumno] = useState("");
    const [valor, setValor] = useState("");
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    // Consulta la API para recuperar las materias asignadas al usuario activo.
    useEffect(() => {
        const cargarCursos = async () => {
            try {
                const dataSesion = localStorage.getItem("usuario");
                if (!dataSesion) {
                    throw new Error("No se encontro una sesion de usuario.");
                }

                const usuario: { id: number } = JSON.parse(dataSesion);
                const data = await api.get(`/cursos/profesor/${usuario.id}`);
                setCursos(data);
            } catch (error) {
                console.error(error);
                setErrorCarga("No se pudieron cargar las materias asignadas. Recarga la pagina para intentarlo de nuevo.");
            } finally {
                setCargandoCursos(false);
            }
        };
        cargarCursos();
    }, []);

    // Consulta la API para recuperar la lista de alumnos matriculados en la materia seleccionada.
    useEffect(() => {
        let cancelada = false;

        const cargarAlumnos = async () => {
            if (!cursoId) {
                setInscripciones([]);
                return;
            }

            setCargandoAlumnos(true);
            setErrorCarga("");
            try {
                const data = await api.get(`/inscripciones/curso/${cursoId}`);
                if (!cancelada) {
                    setInscripciones(data);
                }
            } catch (error) {
                console.error(error);
                if (!cancelada) {
                    setInscripciones([]);
                    setErrorCarga("No se pudieron cargar los alumnos de esta materia. Intenta seleccionar la materia nuevamente.");
                }
            } finally {
                if (!cancelada) {
                    setCargandoAlumnos(false);
                }
            }
        };

        cargarAlumnos();

        return () => {
            cancelada = true;
        };
    }, [cursoId]);

    const alumnosFiltrados = inscripciones
        .map((inscripcion) => ({
            ...inscripcion,
            nombreCompleto: inscripcion.estudiante
                ? [
                    inscripcion.estudiante.nombre,
                    inscripcion.estudiante.apellidoPaterno,
                    inscripcion.estudiante.apellidoMaterno,
                ].filter(Boolean).join(" ")
                : `ID: ${inscripcion.estudianteId}`,
        }))
        .filter((inscripcion) =>
            inscripcion.nombreCompleto.toLocaleLowerCase("es").includes(busquedaAlumno.trim().toLocaleLowerCase("es"))
        )
        .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto, "es"));

    // Transmite los datos capturados hacia el punto de enlace de calificaciones.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        setMensaje({ texto: "", tipo: "" });

        try {
            await api.post("/calificaciones", {
                estudianteId: parseInt(estudianteId),
                cursoId: parseInt(cursoId),
                valor: parseFloat(valor)
            });
            
            setMensaje({ texto: "Calificacion registrada exitosamente.", tipo: "exito" });
            setEstudianteId("");
            setValor("");
            setBusquedaAlumno("");
        } catch (error) {
            console.error(error);
            setMensaje({ texto: "Fallo al registrar la calificacion.", tipo: "error" });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full max-w-2xl">
            <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Asignar Calificacion</h3>
            
            {mensaje.texto && (
                <div className={`p-3 mb-4 rounded text-sm ${mensaje.tipo === "exito" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    <p>{mensaje.texto}</p>
                </div>
            )}

            {errorCarga && (
                <div role="alert" className="p-3 mb-4 rounded text-sm bg-red-100 text-red-700">
                    {errorCarga}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="cursoId" className="block text-gray-700 text-sm font-semibold mb-1">Materia asignada</label>
                    <select 
                        id="cursoId"
                        className="w-full p-2 bg-slate-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-orange-500"
                        value={cursoId}
                        onChange={(e) => {
                            setCursoId(e.target.value);
                            setEstudianteId("");
                            setBusquedaAlumno("");
                            setValor("");
                            setMensaje({ texto: "", tipo: "" });
                        }}
                        disabled={cargandoCursos || guardando}
                        required
                    >
                        <option value="">
                            {cargandoCursos ? "Cargando materias..." : "Seleccione su materia..."}
                        </option>
                        {cursos.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                {cursoId && (
                    <div>
                        <label htmlFor="busquedaAlumno" className="block text-gray-700 text-sm font-semibold mb-1">Buscar alumno inscrito</label>
                        <input
                            id="busquedaAlumno"
                            type="search"
                            autoComplete="off"
                            placeholder="Escribe el nombre o apellido..."
                            className="w-full p-2 mb-2 bg-slate-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-orange-500"
                            value={busquedaAlumno}
                            onChange={(e) => {
                                setBusquedaAlumno(e.target.value);
                                setEstudianteId("");
                            }}
                            disabled={cargandoAlumnos || guardando}
                        />
                        <label htmlFor="estudianteId" className="block text-gray-700 text-sm font-semibold mb-1">Alumno</label>
                        <select 
                            id="estudianteId"
                            className="w-full p-2 bg-slate-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-orange-500"
                            value={estudianteId}
                            onChange={(e) => {
                                setEstudianteId(e.target.value);
                                setBusquedaAlumno("");
                            }}
                            disabled={cargandoAlumnos || alumnosFiltrados.length === 0 || guardando}
                            required
                        >
                            <option value="">
                                {cargandoAlumnos
                                    ? "Cargando alumnos..."
                                    : alumnosFiltrados.length > 0
                                        ? "Seleccione un alumno..."
                                        : inscripciones.length > 0
                                            ? "No hay coincidencias..."
                                            : "No hay alumnos inscritos"}
                            </option>
                            {alumnosFiltrados.map(inscripcion => (
                                <option key={inscripcion.estudianteId} value={inscripcion.estudianteId}>
                                    {inscripcion.nombreCompleto}
                                </option>
                            ))}
                        </select>
                        {!cargandoAlumnos && inscripciones.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500" aria-live="polite">
                                {alumnosFiltrados.length} de {inscripciones.length} alumnos
                            </p>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor="valor" className="block text-gray-700 text-sm font-semibold mb-1">Calificacion final (0-100)</label>
                    <input 
                        id="valor"
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="100" 
                        className="w-full p-2 bg-slate-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-orange-500" 
                        value={valor} 
                        onChange={(e) => setValor(e.target.value)} 
                        disabled={guardando}
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={!cursoId || !estudianteId || !valor || guardando}
                    className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors uppercase disabled:opacity-50"
                >
                    {guardando ? "Guardando..." : "Guardar calificacion"}
                </button>
            </form>
        </div>
    );
}