"use client";

import { useState, useEffect } from "react";
import { api } from "../services/api";

// Define las interfaces para estructurar los datos que recibiremos del backend.
interface Usuario {
    id: number;
    nombre: string;
    rol: number;
}

interface Curso {
    id: number;
    nombre: string;
}

// Define el componente para registrar una nueva calificacion usando selectores relacionales.
export default function CalificacionForm() {
    // Define los estados para almacenar las listas que vienen de la base de datos.
    const [estudiantes, setEstudiantes] = useState<Usuario[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [cargandoListas, setCargandoListas] = useState(true);

    // Define los estados para los datos que el usuario seleccionara en el formulario.
    const [estudianteId, setEstudianteId] = useState("");
    const [cursoId, setCursoId] = useState("");
    const [valor, setValor] = useState("");
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    // Ejecuta la consulta a la API al momento de cargar el componente en pantalla.
    useEffect(() => {
        const cargarDatosRelacionales = async () => {
            try {
                // Obtiene todos los usuarios y filtra unicamente a los que tienen rol de Estudiante (0).
                const usuariosData: Usuario[] = await api.get("/usuarios");
                const listaEstudiantes = usuariosData.filter(u => u.rol === 0);
                setEstudiantes(listaEstudiantes);

                // Obtiene todos los cursos disponibles.
                const cursosData: Curso[] = await api.get("/cursos");
                setCursos(cursosData);
            } catch (err) {
                console.error("Error al cargar catalogos:", err);
            } finally {
                // Oculta el indicador de carga sin importar si la peticion fue exitosa o fallo.
                setCargandoListas(false);
            }
        };

        cargarDatosRelacionales();
    }, []);

    // Maneja el evento de envio de datos hacia el backend.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ejecuta la peticion POST convirtiendo los textos de los selectores a numeros enteros y decimales.
            await api.post("/calificaciones", { 
                estudianteId: parseInt(estudianteId), 
                cursoId: parseInt(cursoId), 
                valor: parseFloat(valor) 
            });
            
            setMensaje({ texto: "Calificacion registrada exitosamente.", tipo: "exito" });
            
            // Restablece los campos del formulario tras un guardado exitoso.
            setEstudianteId("");
            setCursoId("");
            setValor("");
        } catch (err) {
            setMensaje({ texto: "Error al registrar la calificacion.", tipo: "error" });
        }
    };

    return (
        <div className="w-full bg-blue-950 p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-blue-800 pb-2">Asignar Calificacion</h3>
            
            {mensaje.texto && (
                <div className={`p-3 mb-4 rounded text-sm ${mensaje.tipo === "exito" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    <p>{mensaje.texto}</p>
                </div>
            )}
            
            {cargandoListas ? (
                <div className="text-blue-200 text-sm text-center py-4">Cargando listas de alumnos y cursos...</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1" htmlFor="estudianteId">Alumno a evaluar</label>
                        <select 
                            id="estudianteId" 
                            className="w-full p-2 bg-blue-900 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" 
                            value={estudianteId} 
                            onChange={(e) => setEstudianteId(e.target.value)} 
                            required
                        >
                            <option value="">Seleccione un alumno...</option>
                            {estudiantes.map(estudiante => (
                                <option key={estudiante.id} value={estudiante.id}>{estudiante.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1" htmlFor="cursoId">Curso / Materia</label>
                        <select 
                            id="cursoId" 
                            className="w-full p-2 bg-blue-900 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" 
                            value={cursoId} 
                            onChange={(e) => setCursoId(e.target.value)} 
                            required
                        >
                            <option value="">Seleccione un curso...</option>
                            {cursos.map(curso => (
                                <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1" htmlFor="valor">Calificacion (0-100)</label>
                        <input 
                            id="valor" 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="100" 
                            className="w-full p-2 bg-white/5 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" 
                            value={valor} 
                            onChange={(e) => setValor(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors text-sm uppercase mt-2">
                        Guardar Calificacion
                    </button>
                </form>
            )}
        </div>
    );
}