"use client";

import { useState, useEffect } from "react";
import { api } from "../services/api";

interface Carrera {
    id: number;
    nombre: string;
}

/// Define el componente para el formulario de registro de usuarios en el sistema.
export default function RegistroUsuarioForm() {
    const [nombre, setNombre] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rol, setRol] = useState("0");
    const [carreraId, setCarreraId] = useState("");
    
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    /// Obtiene el catalogo de carreras disponibles desde la API.
    useEffect(() => {
        const cargarCatalogo = async () => {
            try {
                const data = await api.get("/carreras");
                setCarreras(data);
            } catch (error) {
                console.error(error);
            }
        };
        cargarCatalogo();
    }, []);

    /// Procesa los datos del formulario y ejecuta la peticion de creacion.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                correo,
                password,
                telefono,
                rol: parseInt(rol),
                carreraId: rol === "0" && carreraId !== "" ? parseInt(carreraId) : null
            };

            await api.post("/usuarios", payload);
            setMensaje({ texto: "Registro procesado correctamente.", tipo: "exito" });
            
            setNombre("");
            setApellidoPaterno("");
            setApellidoMaterno("");
            setCorreo("");
            setPassword("");
            setTelefono("");
            setRol("0");
            setCarreraId("");
        } catch (error) {
            setMensaje({ texto: "Fallo en el procesamiento del registro.", tipo: "error" });
        }
    };

    return (
        <div className="bg-blue-950 p-6 rounded-xl shadow-md border border-gray-200 w-full">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-blue-800 pb-2">Registro de Usuario</h3>
            
            {mensaje.texto && (
                <div className={`p-3 mb-4 rounded text-sm ${mensaje.tipo === "exito" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    <p>{mensaje.texto}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1">Nombre</label>
                        <input type="text" className="w-full p-2 bg-white/5 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1">Apellido Paterno</label>
                        <input type="text" className="w-full p-2 bg-white/5 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1">Apellido Materno</label>
                        <input type="text" className="w-full p-2 bg-white/5 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1">Telefono</label>
                        <input type="text" className="w-full p-2 bg-white/5 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1">Correo Institucional</label>
                        <input type="email" className="w-full p-2 bg-white/5 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1">Clave de Acceso Temporal</label>
                        <input type="password" className="w-full p-2 bg-white/5 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-blue-100 text-xs font-semibold mb-1">Rol en el Sistema</label>
                        <select className="w-full p-2 bg-blue-900 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" value={rol} onChange={(e) => setRol(e.target.value)} required>
                            <option value="0">Estudiante</option>
                            <option value="1">Profesor</option>
                            <option value="2">Administrador</option>
                            <option value="3">Jefe de Carrera</option>
                        </select>
                    </div>
                    
                    {rol === "0" && (
                        <div>
                            <label className="block text-blue-100 text-xs font-semibold mb-1">Carrera Asignada</label>
                            <select className="w-full p-2 bg-blue-900 border border-blue-300/30 rounded text-white text-sm focus:outline-none focus:border-orange-500" value={carreraId} onChange={(e) => setCarreraId(e.target.value)} required={rol === "0"}>
                                <option value="">Seleccione una carrera...</option>
                                {carreras.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors text-sm uppercase mt-4">
                    Registrar Perfil
                </button>
            </form>
        </div>
    );
}