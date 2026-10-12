"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Usuario {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    correo: string;
    rol: number;
}

interface Curso {
    id: number;
    nombre: string;
}

interface Inscripcion {
    id: number;
    estudianteId: number;
    cursoId: number;
    estudiante?: Usuario;
}

/// Define el componente para la gestion de matriculacion.
export default function InscripcionesManager() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [estudiantes, setEstudiantes] = useState<Usuario[]>([]);
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    
    const [cursoSeleccionado, setCursoSeleccionado] = useState("");
    const [busquedaId, setBusquedaId] = useState("");
    const [alumnoEncontrado, setAlumnoEncontrado] = useState<Usuario | null>(null);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    /// Recupera la informacion inicial del servidor.
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cursosData = await api.get("/cursos");
                setCursos(cursosData);

                const usuariosData: Usuario[] = await api.get("/usuarios");
                const listaEstudiantes = usuariosData.filter((u: Usuario) => u.rol === 0);
                setEstudiantes(listaEstudiantes);
            } catch (error) {
                console.error(error);
            }
        };
        cargarDatos();
    }, []);

    /// Recupera la informacion de matriculacion al detectar un cambio en el identificador del curso.
    useEffect(() => {
        const cargarInscripciones = async () => {
            if (!cursoSeleccionado) {
                setInscripciones([]);
                return;
            }
            try {
                const data = await api.get(`/inscripciones/curso/${cursoSeleccionado}`);
                setInscripciones(data);
            } catch (error) {
                console.error(error);
            }
        };
        cargarInscripciones();
    }, [cursoSeleccionado]);

    /// Ejecuta la busqueda de un estudiante mediante su identificador numerico.
    const buscarAlumnoPorId = (e: React.MouseEvent) => {
        e.preventDefault();
        setMensaje({ texto: "", tipo: "" });
        
        if (!busquedaId.trim()) return;

        const idObjetivo = parseInt(busquedaId.trim(), 10);
        const resultado = estudiantes.find(est => est.id === idObjetivo);
        
        if (resultado) {
            const yaInscrito = inscripciones.some(insc => insc.estudianteId === resultado.id);
            if (yaInscrito) {
                setAlumnoEncontrado(null);
                setMensaje({ texto: "El alumno ya se encuentra en la lista de esta materia.", tipo: "error" });
                return;
            }
            setAlumnoEncontrado(resultado);
        } else {
            setAlumnoEncontrado(null);
            setMensaje({ texto: "No se encontro ningun estudiante con el ID proporcionado.", tipo: "error" });
        }
    };

    /// Ejecuta la peticion de matriculacion hacia el servidor.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!alumnoEncontrado) return;

        try {
            const payload = {
                estudianteId: alumnoEncontrado.id,
                cursoId: parseInt(cursoSeleccionado)
            };

            const nuevaInscripcion = await api.post("/inscripciones", payload);
            setMensaje({ texto: "Matriculacion procesada correctamente.", tipo: "exito" });
            
            setInscripciones([...inscripciones, { ...nuevaInscripcion, estudiante: alumnoEncontrado }]);
            setAlumnoEncontrado(null);
            setBusquedaId("");
        } catch (error) {
            setMensaje({ texto: "Fallo en el procesamiento. Es posible que el registro ya exista.", tipo: "error" });
        }
    };

    /// Ejecuta la peticion de eliminacion hacia el servidor para dar de baja un alumno.
    const handleDarDeBaja = async (idInscripcion: number) => {
        const confirmar = window.confirm("¿Confirma que desea dar de baja a este alumno del curso?");
        if (!confirmar) return;

        try {
            await api.delete(`/inscripciones/${idInscripcion}`);
            // Actualiza la lista en pantalla filtrando el registro eliminado
            setInscripciones(inscripciones.filter(insc => insc.id !== idInscripcion));
            setMensaje({ texto: "Alumno dado de baja exitosamente.", tipo: "exito" });
        } catch (error) {
            setMensaje({ texto: "Ocurrio un error al intentar dar de baja al alumno.", tipo: "error" });
        }
    };

    const cursoActual = cursos.find(c => c.id.toString() === cursoSeleccionado);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
                <div className="bg-blue-950 p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-blue-800 pb-2">Matricular Estudiante</h3>
                    
                    {mensaje.texto && (
                        <div className={`p-3 mb-4 rounded text-sm font-semibold ${mensaje.tipo === "exito" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            <p>{mensaje.texto}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-blue-100 text-xs font-semibold mb-1">Seleccionar Curso</label>
                            <select 
                                className="w-full p-2 bg-blue-900 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500"
                                value={cursoSeleccionado}
                                onChange={(e) => {
                                    setCursoSeleccionado(e.target.value);
                                    setAlumnoEncontrado(null);
                                    setBusquedaId("");
                                    setMensaje({ texto: "", tipo: "" });
                                }}
                                required
                            >
                                <option value="">Elija un curso...</option>
                                {cursos.map(curso => (
                                    <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {cursoSeleccionado && (
                            <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-800">
                                <label className="block text-blue-100 text-xs font-semibold mb-2">ID del Alumno</label>
                                <div className="flex gap-2 mb-2">
                                    <input 
                                        type="number" 
                                        min="1"
                                        placeholder="Ej. 5" 
                                        className="w-full p-2 bg-white/10 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" 
                                        value={busquedaId}
                                        onChange={(e) => setBusquedaId(e.target.value)}
                                    />
                                    <button 
                                        onClick={buscarAlumnoPorId}
                                        type="button"
                                        className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                                    >
                                        Buscar
                                    </button>
                                </div>

                                {alumnoEncontrado && (
                                    <div className="mt-4 p-3 bg-green-900/40 border border-green-700 rounded text-green-100 text-sm">
                                        <p className="font-semibold border-b border-green-800/50 pb-1 mb-1">Alumno Listo para Registro:</p>
                                        <p>{alumnoEncontrado.nombre} {alumnoEncontrado.apellidoPaterno}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={!cursoSeleccionado || !alumnoEncontrado}
                            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors text-sm uppercase mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirmar Matriculacion
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-4 border-b pb-2">
                    <h3 className="text-lg font-bold text-blue-900">
                        {cursoActual ? `Lista de Clase: ${cursoActual.nombre}` : "Panel de Grupo"}
                    </h3>
                    {cursoActual && (
                        <p className="text-sm text-gray-500 mt-1">Total de alumnos inscritos: {inscripciones.length}</p>
                    )}
                </div>
                
                {!cursoSeleccionado ? (
                    <div className="flex justify-center items-center h-32 bg-slate-50 rounded border border-dashed border-gray-300">
                        <p className="text-gray-500 text-sm">Seleccione un curso a la izquierda para visualizar los registros.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-blue-900">
                                    <th className="p-3 font-semibold text-sm w-20">ID</th>
                                    <th className="p-3 font-semibold text-sm">Nombre del Estudiante</th>
                                    <th className="p-3 font-semibold text-sm text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inscripciones.map((inscripcion) => (
                                    <tr key={inscripcion.id} className="border-b border-gray-100 hover:bg-slate-50">
                                        <td className="p-3 text-sm text-gray-600 font-mono">{inscripcion.estudianteId}</td>
                                        <td className="p-3 text-sm font-bold text-gray-800">
                                            {inscripcion.estudiante ? `${inscripcion.estudiante.nombre} ${inscripcion.estudiante.apellidoPaterno}` : "Registro incompleto"}
                                        </td>
                                        <td className="p-3 text-sm text-center">
                                            <button 
                                                onClick={() => handleDarDeBaja(inscripcion.id)}
                                                className="text-red-500 hover:text-red-700 font-semibold text-xs uppercase tracking-wider transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {inscripciones.length === 0 && (
                            <p className="text-center text-gray-500 text-sm p-8 bg-slate-50 mt-2 rounded">
                                El grupo se encuentra vacio.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}