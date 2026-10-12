"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Carrera {
    id: number;
    nombre: string;
}

/// Define el componente para la creacion y listado de carreras en el sistema.
export default function CarrerasManager() {
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    const [nombreCarrera, setNombreCarrera] = useState("");
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    /// Recupera la lista de carreras al inicializar el componente.
    useEffect(() => {
        const cargarCarreras = async () => {
            try {
                const data = await api.get("/carreras");
                setCarreras(data);
            } catch (error) {
                console.error(error);
            }
        };
        cargarCarreras();
    }, []);

    /// Ejecuta la transaccion para registrar una nueva carrera en la base de datos.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nombreCarrera.trim()) {
            setMensaje({ texto: "El nombre de la carrera no puede estar vacio.", tipo: "error" });
            return;
        }

        try {
            const nuevaCarrera = await api.post("/carreras", { nombre: nombreCarrera.trim() });
            setMensaje({ texto: "Carrera registrada exitosamente.", tipo: "exito" });
            
            // Actualiza la lista en pantalla sin necesidad de recargar.
            setCarreras([...carreras, nuevaCarrera]);
            setNombreCarrera("");
        } catch (error) {
            setMensaje({ texto: "Fallo en el procesamiento al registrar la carrera.", tipo: "error" });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
                <div className="bg-blue-950 p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-blue-800 pb-2">Registrar Nueva Carrera</h3>
                    
                    {mensaje.texto && (
                        <div className={`p-3 mb-4 rounded text-sm font-semibold ${mensaje.tipo === "exito" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            <p>{mensaje.texto}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-blue-100 text-xs font-semibold mb-1">Nombre Oficial de la Carrera</label>
                            <input 
                                type="text" 
                                placeholder="Ej. Ingenieria en Sistemas Computacionales" 
                                className="w-full p-2 bg-white/10 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" 
                                value={nombreCarrera}
                                onChange={(e) => setNombreCarrera(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={!nombreCarrera.trim()}
                            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Guardar Carrera
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-4 border-b pb-2">
                    <h3 className="text-lg font-bold text-blue-900">Catalogo de Carreras Registradas</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-blue-900">
                                <th className="p-3 font-semibold text-sm w-20">ID</th>
                                <th className="p-3 font-semibold text-sm">Nombre de la Carrera</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carreras.map((carrera) => (
                                <tr key={carrera.id} className="border-b border-gray-100 hover:bg-slate-50">
                                    <td className="p-3 text-sm text-gray-600 font-mono">{carrera.id}</td>
                                    <td className="p-3 text-sm font-bold text-gray-800">{carrera.nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {carreras.length === 0 && (
                        <p className="text-center text-gray-500 text-sm p-8 bg-slate-50 mt-2 rounded">
                            No hay carreras registradas en el sistema.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}