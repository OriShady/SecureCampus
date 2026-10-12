"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../services/api";

// Define el componente de interfaz para el acceso al sistema.
export default function LoginForm() {
    // Define el estado local para las credenciales de acceso.
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    // Inicializa el controlador de rutas.
    const router = useRouter();

    // Maneja el evento de envio del formulario.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ejecuta la peticion POST hacia el endpoint de autenticacion.
            const response = await api.post("/auth/login", { correo, password });
            
            // Guarda los datos del usuario en el almacenamiento local.
            localStorage.setItem("usuario", JSON.stringify(response));
            
            // Redirige a la vista del panel principal.
            router.push("/dashboard");
        } catch (err) {
            // Establece el mensaje de error en caso de fallo.
            setError("Credenciales invalidas o error de conexion.");
        }
    };

    return (
        <div className="mx-auto w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white tracking-tight mb-2">SecureCampus</h2>
                <div className="h-1 w-16 bg-orange-500 mx-auto rounded-full mb-4"></div>
                <p className="text-blue-200 text-sm font-medium tracking-wide">PORTAL ACADEMICO</p>
            </div>
            
            {error && (
                <div className="bg-red-500/20 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded text-sm backdrop-blur-sm">
                    <p>{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-blue-100 text-sm font-semibold mb-2" htmlFor="correo">
                        Correo electronico
                    </label>
                    <input 
                        id="correo"
                        type="email" 
                        className="w-full p-3 bg-white/5 border border-blue-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-white placeholder-blue-300/50"
                        placeholder="usuario@institucion.edu"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required 
                    />
                </div>
                
                <div>
                    <label className="block text-blue-100 text-sm font-semibold mb-2" htmlFor="password">
                        Contrasena
                    </label>
                    <input 
                        id="password"
                        type="password" 
                        className="w-full p-3 bg-white/5 border border-blue-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-white placeholder-blue-300/50"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 uppercase tracking-wider text-sm mt-4"
                >
                    Ingresar al Sistema
                </button>
            </form>
        </div>
    );
}