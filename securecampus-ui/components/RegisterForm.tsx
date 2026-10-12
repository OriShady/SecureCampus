"use client";

import { useState } from "react";
import { api } from "../services/api";

// Define las propiedades para la navegacion del componente.
interface RegisterFormProps {
    onNavigateToLogin: () => void;
}

// Define el componente de interfaz para el registro de nuevos usuarios.
export default function RegisterForm({ onNavigateToLogin }: RegisterFormProps) {
    // Define el estado local para los datos del usuario.
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("0");
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    // Maneja el evento de envio del formulario de registro.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ejecuta la peticion POST hacia el controlador de usuarios.
            const response = await api.post("/usuarios", { 
                nombre, 
                correo, 
                password, 
                rol: parseInt(rol) 
            });
            
            setMensaje({ texto: "Usuario registrado exitosamente.", tipo: "exito" });
            console.log("Registro exitoso:", response);
            
            // Limpia el formulario despues del registro.
            setNombre("");
            setCorreo("");
            setPassword("");
            setRol("0");
        } catch (err) {
            setMensaje({ texto: "Error al registrar el usuario.", tipo: "error" });
        }
    };

    return (
        <div className="mx-auto w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Nuevo Registro</h2>
                <div className="h-1 w-16 bg-orange-500 mx-auto rounded-full mb-4"></div>
            </div>
            
            {mensaje.texto && (
                <div className={`p-4 mb-6 rounded text-sm backdrop-blur-sm border-l-4 ${mensaje.tipo === "exito" ? "bg-green-500/20 border-green-500 text-green-100" : "bg-red-500/20 border-red-500 text-red-100"}`}>
                    <p>{mensaje.texto}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-blue-100 text-sm font-semibold mb-1" htmlFor="nombre">Nombre completo</label>
                    <input id="nombre" type="text" className="w-full p-2 bg-white/5 border border-blue-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                
                <div>
                    <label className="block text-blue-100 text-sm font-semibold mb-1" htmlFor="correo">Correo electronico</label>
                    <input id="correo" type="email" className="w-full p-2 bg-white/5 border border-blue-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                
                <div>
                    <label className="block text-blue-100 text-sm font-semibold mb-1" htmlFor="password">Contrasena</label>
                    <input id="password" type="password" className="w-full p-2 bg-white/5 border border-blue-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                
                <div>
                    <label className="block text-blue-100 text-sm font-semibold mb-1" htmlFor="rol">Rol en el sistema</label>
                    <select id="rol" className="w-full p-2 bg-blue-900 border border-blue-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white" value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="0">Estudiante</option>
                        <option value="1">Profesor</option>
                        <option value="2">Administrador</option>
                        <option value="3">Jefe de Carrera</option>
                    </select>
                </div>
                
                <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-600 transition-all uppercase tracking-wider text-sm mt-6">
                    Crear Cuenta
                </button>
            </form>
            
            <div className="mt-6 text-center">
                <button onClick={onNavigateToLogin} className="text-blue-200 text-sm hover:text-white transition-colors">
                    ¿Ya tienes cuenta? Inicia sesion
                </button>
            </div>
        </div>
    );
}