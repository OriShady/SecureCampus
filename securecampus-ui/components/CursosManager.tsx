"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Curso {
    id: number;
    nombre: string;
    profesorId: number;
}

interface Usuario {
    id: number;
    nombre: string;
    rol: number;
}

// Define el componente para la gestion completa de cursos (GET y POST).
export default function CursosManager() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [profesores, setProfesores] = useState<Usuario[]>([]);
    const [nombreCurso, setNombreCurso] = useState("");
    const [profesorIdSeleccionado, setProfesorIdSeleccionado] = useState("");
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
    const [cargando, setCargando] = useState(true);

    // Carga inicial de cursos y profesores.
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Obtiene la lista de cursos
                const cursosData = await api.get("/cursos");
                setCursos(cursosData);

                // Obtiene la lista de usuarios y filtra solo a los profesores (Rol 1)
                const usuariosData: Usuario[] = await api.get("/usuarios");
                const listaProfesores = usuariosData.filter(u => u.rol === 1);
                setProfesores(listaProfesores);
            } catch (err) {
                console.error("Error al cargar datos:", err);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    // Maneja el envio del formulario para crear un curso.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const nuevoCurso = await api.post("/cursos", {
                nombre: nombreCurso,
                profesorId: parseInt(profesorIdSeleccionado)
            });

            setMensaje({ texto: "Curso creado exitosamente.", tipo: "exito" });
            // Actualiza la lista localmente
            setCursos([...cursos, nuevoCurso]);
            // Limpia el formulario
            setNombreCurso("");
            setProfesorIdSeleccionado("");
        } catch (err) {
            setMensaje({ texto: "Error al crear el curso.", tipo: "error" });
        }
    };

    if (cargando) return <div className="text-center p-4">Cargando cursos...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Formulario de Creacion */}
            <div className="lg:col-span-4">
                <div className="bg-blue-950 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-blue-800 pb-2">Nuevo Curso</h3>
                    
                    {mensaje.texto && (
                        <div className={`p-3 mb-4 rounded text-sm ${mensaje.tipo === "exito" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            <p>{mensaje.texto}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-blue-100 text-xs font-semibold mb-1">Nombre del Curso</label>
                            <input 
                                type="text" 
                                className="w-full p-2 bg-white/5 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" 
                                value={nombreCurso} 
                                onChange={(e) => setNombreCurso(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-blue-100 text-xs font-semibold mb-1">Profesor Asignado</label>
                            <select 
                                className="w-full p-2 bg-blue-900 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500"
                                value={profesorIdSeleccionado}
                                onChange={(e) => setProfesorIdSeleccionado(e.target.value)}
                                required
                            >
                                <option value="">Selecciona un profesor...</option>
                                {profesores.map(profesor => (
                                    <option key={profesor.id} value={profesor.id}>{profesor.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors text-sm uppercase mt-2">
                            Crear Curso
                        </button>
                    </form>
                </div>
            </div>

            {/* Lista de Cursos */}
            <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Cursos Registrados</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-blue-900">
                                <th className="p-3 font-semibold text-sm">ID</th>
                                <th className="p-3 font-semibold text-sm">Nombre del Curso</th>
                                <th className="p-3 font-semibold text-sm">ID Profesor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cursos.map((curso, index) => (
                                <tr key={curso.id} className="border-b border-gray-100 hover:bg-slate-50">
                                    <td className="p-3 text-sm text-gray-600">{curso.id}</td>
                                    <td className="p-3 text-sm font-bold text-gray-800">{curso.nombre}</td>
                                    <td className="p-3 text-sm text-gray-600">{curso.profesorId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {cursos.length === 0 && <p className="text-center text-gray-500 text-sm p-4">No hay cursos registrados.</p>}
                </div>
            </div>
        </div>
    );
}