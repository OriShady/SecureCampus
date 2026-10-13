"use client";

import { useState, useEffect } from "react";
import { api } from "../services/api";


interface Curso {
    id: number;
    nombre: string;
    cantidadParciales: number;
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


interface Calificacion {
    id: number;
    estudianteId: number;
    cursoId: number;
    numeroParcial: number;
    valor: number;
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
    const [numeroParcial, setNumeroParcial] = useState("");
    
    const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
    const [cargandoCalificaciones, setCargandoCalificaciones] = useState(false);

    
    const [calificacionEditando, setCalificacionEditando] = useState<number | null>(null);
    const [valorEditado, setValorEditado] = useState("");
    const [guardandoEdicion, setGuardandoEdicion] = useState(false);

    const cursoSeleccionado = cursos.find(
        (curso) => curso.id === Number(cursoId)
    );

    const promedioFinal =
        cursoSeleccionado &&
        cursoSeleccionado.cantidadParciales > 0 &&
        calificaciones.length === cursoSeleccionado.cantidadParciales
            ? Math.round(
                calificaciones.reduce(
                    (suma, calificacion) => suma + calificacion.valor,
                    0
                ) / cursoSeleccionado.cantidadParciales
            )
            : null;


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

    
    // Consulta las calificaciones del alumno en la materia seleccionada.
    useEffect(() => {
        let cancelada = false;

        const cargarCalificaciones = async () => {
            // Limpia las calificaciones cuando no hay alumno o materia.
            if (!cursoId || !estudianteId) {
                setCalificaciones([]);
                setCargandoCalificaciones(false);
                return;
            }

            setCargandoCalificaciones(true);
            setCalificaciones([]);

            try {
                // Obtiene las calificaciones del estudiante.
                const data: Calificacion[] = await api.get(
                    `/calificaciones/estudiante/${estudianteId}`
                );

                // Filtra las calificaciones de la materia seleccionada.
                if (!cancelada) {
                    setCalificaciones(
                        data.filter(c => c.cursoId === Number(cursoId))
                    );
                }
            } catch (error) {
                console.error(error);

                if (!cancelada) {
                    setCalificaciones([]);
                    setMensaje({
                        texto: "No se pudieron consultar las calificaciones.",
                        tipo: "error"
                    });
                }
            } finally {
                if (!cancelada) {
                    setCargandoCalificaciones(false);
                }
            }
        };

        cargarCalificaciones();

        return () => {
            cancelada = true;
        };
    }, [cursoId, estudianteId]);


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
        
    // Prepara una calificacion para modificarla.
    const iniciarEdicion = (calificacion: Calificacion) => {
        // Guarda el ID de la calificacion seleccionada.
        setCalificacionEditando(calificacion.id);

        // Coloca su valor actual en el campo de edicion.
        setValorEditado(String(calificacion.valor));

        // Limpia los mensajes anteriores.
        setMensaje({ texto: "", tipo: "" });
    };

    
    // Guarda la modificacion de una calificacion parcial.
    const guardarEdicion = async () => {
        if (calificacionEditando === null) return;

        // Valida que la nueva calificacion sea un entero de 1 a 100.
        const nuevoValor = Number(valorEditado);

        if (
            !Number.isInteger(nuevoValor) ||
            nuevoValor < 1 ||
            nuevoValor > 100
        ) {
            setMensaje({
                texto: "La calificacion debe ser un numero entero entre 1 y 100.",
                tipo: "error"
            });
            return;
        }

        setGuardandoEdicion(true);
        setMensaje({ texto: "", tipo: "" });

        try {
            // La API recibe directamente un numero entero.
            const respuesta = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5110/api"}/calificaciones/${calificacionEditando}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(nuevoValor)
                }
            );

            if (!respuesta.ok) {
                throw new Error("No se pudo actualizar la calificacion.");
            }

            // Actualiza la tarjeta sin recargar la pagina.
            setCalificaciones((anteriores) =>
                anteriores.map((calificacion) =>
                    calificacion.id === calificacionEditando
                        ? { ...calificacion, valor: nuevoValor }
                        : calificacion
                )
            );

            setCalificacionEditando(null);
            setValorEditado("");

            setMensaje({
                texto: "Calificacion actualizada correctamente.",
                tipo: "exito"
            });
        } catch (error) {
            console.error(error);

            setMensaje({
                texto: "No se pudo actualizar la calificacion.",
                tipo: "error"
            });
        } finally {
            setGuardandoEdicion(false);
        }
    };


    // Transmite los datos capturados hacia el punto de enlace de calificaciones.
        const handleSubmit = async (e: React.FormEvent) => {        
            e.preventDefault();

            // Convierte la calificacion a numero.
            const calificacion = Number(valor);

            // Comprueba que exista un parcial seleccionado.
            if (!numeroParcial) {
                setMensaje({
                    texto: "Selecciona el parcial que deseas calificar.",
                    tipo: "error"
                });
                return;
            }

            // Valida que sea un numero entero entre 1 y 100.
            if (!Number.isInteger(calificacion) ||
                calificacion < 1 ||
                calificacion > 100) {
                setMensaje({
                    texto: "La calificacion debe ser un numero entero entre 1 y 100.",
                    tipo: "error"
                });
                return;
            }

            setGuardando(true);
            setMensaje({ texto: "", tipo: "" });


            try {           
                
    const nuevaCalificacion: Calificacion = await api.post(
        "/calificaciones",
        {
            estudianteId: parseInt(estudianteId),
            cursoId: parseInt(cursoId),
            numeroParcial: parseInt(numeroParcial),
            valor: parseInt(valor)
        }
    );

    // Actualiza las calificaciones visibles sin recargar la pagina.
    setCalificaciones((anteriores) => [
        ...anteriores.filter(
            (c) => c.id !== nuevaCalificacion.id
        ),
        nuevaCalificacion
    ]);


            
            
        setMensaje({
            texto: "Calificacion registrada exitosamente.",
            tipo: "exito"
        });

        // Conserva al estudiante seleccionado.
        // Limpia solamente el parcial y la calificacion.
        setNumeroParcial("");
        setValor("");

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
                            setNumeroParcial("");

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

                
                {/* Permite seleccionar un parcial del curso. */}
                {cursoId && (
                    <div>
                        <label
                            htmlFor="numeroParcial"
                            className="block text-gray-700 text-sm font-semibold mb-1"
                        >
                            Parcial a calificar
                        </label>

                        <select
                            id="numeroParcial"
                            className="w-full p-2 bg-slate-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-orange-500"
                            value={numeroParcial}
                            onChange={(e) => setNumeroParcial(e.target.value)}
                            disabled={guardando}
                            required
                        >
                            <option value="">Seleccione un parcial...</option>

                            {Array.from(
                                {
                                    length: cursos.find(
                                        (curso) => curso.id === Number(cursoId)
                                    )?.cantidadParciales ?? 0
                                },
                                (_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        Parcial {index + 1}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}


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
                        step="1" 
                        min="1" 
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
                    
                        disabled={
                            !cursoId ||
                            !numeroParcial ||
                            !estudianteId ||
                            !valor ||
                            guardando
                        }

                    className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors uppercase disabled:opacity-50"
                >
                    {guardando ? "Guardando..." : "Guardar calificacion"}
                </button>
            </form>
                        
            {/* Calificaciones registradas del estudiante seleccionado. */}
            {cursoId && estudianteId && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-base font-bold text-blue-900 mb-3">
                        Calificaciones registradas
                    </h4>

                    {cargandoCalificaciones ? (
                        <p className="text-sm text-gray-500">
                            Cargando calificaciones...
                        </p>
                    ) : calificaciones.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            Este estudiante aun no tiene parciales registrados en esta materia.
                        </p>
                    
) : (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[...calificaciones]
                .sort((a, b) => a.numeroParcial - b.numeroParcial)
                .map((calificacion) => (
                    <div
                        key={calificacion.id}
                        className="bg-slate-50 border border-gray-200 rounded-lg p-4 text-center"
                    >
                        <p className="text-xs text-gray-500 mb-1">
                            Parcial {calificacion.numeroParcial}
                        </p>

                        <p className="text-2xl font-bold text-blue-900">
                            {calificacion.valor}
                        </p>
                        
                        <button
                            type="button"
                            onClick={() => iniciarEdicion(calificacion)}
                            disabled={guardandoEdicion}
                            className="mt-2 text-sm font-semibold text-orange-600 hover:text-orange-700 disabled:opacity-50"
                        >
                             Editar
                        </button>
                        
                    {/* Muestra el campo cuando se selecciona una calificacion. */}
                    {calificacionEditando === calificacion.id && (
                        <div className="mt-3 space-y-2">
                            <label
                                htmlFor={`editar-${calificacion.id}`}
                                className="block text-xs font-semibold text-gray-600"
                            >
                                Nueva calificacion
                            </label>

                            <input
                                id={`editar-${calificacion.id}`}
                                type="number"
                                min="1"
                                max="100"
                                step="1"
                                value={valorEditado}
                                onChange={(e) => setValorEditado(e.target.value)}
                                disabled={guardandoEdicion}
                                className="w-full p-2 text-center bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-orange-500"
                            />

                            
                            <button
                                type="button"
                                onClick={guardarEdicion}
                                disabled={guardandoEdicion || !valorEditado}
                                className="w-full bg-orange-500 text-white font-semibold py-2 px-3 rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
                            </button>


                            <button
                                type="button"
                                onClick={() => {
                                    setCalificacionEditando(null);
                                    setValorEditado("");
                                }}
                                disabled={guardandoEdicion}
                                className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}


                    </div>
                ))}
        </div>

                        {/* Promedio final del curso. */}
                        <div className="mt-4 bg-slate-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                            <span className="font-semibold text-gray-700">
                                Calificacion final del curso
                            </span>

                            {promedioFinal !== null ? (
                                <span className="text-2xl font-bold text-blue-900">
                                    {promedioFinal}
                                </span>
                            ) : (
                                <span className="text-sm font-semibold text-orange-600">
                                    Pendiente
                                </span>
                            )}
                        </div>
                    </>
                )}

                </div>
            )}

        </div>
    );
}