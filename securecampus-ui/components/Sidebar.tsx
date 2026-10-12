"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, User, BookOpen, FileText, Settings } from "lucide-react";

// Define la estructura para evaluar el rol del usuario en sesion.
interface UsuarioSesion {
    rol: number;
}

// Define el componente de navegacion lateral con iconos dinamicos y control de acceso.
export default function Sidebar() {
    // Almacena el identificador numerico del rol.
    const [rolUsuario, setRolUsuario] = useState<number | null>(null);

    // Recupera la informacion de sesion al inicializar el componente.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            const usuario: UsuarioSesion = JSON.parse(data);
            // Ignora la advertencia de renderizado para cargar el rol desde la memoria local.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRolUsuario(usuario.rol);
        }
    }, []);

    return (
        <aside className="absolute left-0 top-0 h-[calc(100%-2rem)] bg-blue-950 text-white shadow-xl z-20 transition-all duration-300 ease-in-out w-16 hover:w-64 overflow-hidden group rounded-r-xl">
            <nav className="flex flex-col py-6 space-y-2">
                <Link href="/dashboard" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                    <div className="min-w-[2rem] flex justify-center"><Home size={20} /></div>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Inicio
                    </span>
                </Link>
                <Link href="/dashboard/perfiles" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                    <div className="min-w-[2rem] flex justify-center"><User size={20} /></div>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Perfil
                    </span>
                </Link>
                <Link href="/dashboard/calificaciones" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                    <div className="min-w-[2rem] flex justify-center"><BookOpen size={20} /></div>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Calificaciones
                    </span>
                </Link>
                <Link href="/dashboard/documentos" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                    <div className="min-w-[2rem] flex justify-center"><FileText size={20} /></div>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Documentos
                    </span>
                </Link>

                {rolUsuario === 2 && (
                    <Link href="/dashboard/cursos" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                        <div className="min-w-[2rem] flex justify-center"><BookOpen size={20} /></div>
                        <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Cursos
                        </span>
                    </Link>
                )}
                
                {rolUsuario === 2 && (
                    <Link href="/dashboard/administracion" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                        <div className="min-w-[2rem] flex justify-center"><Settings size={20} /></div>
                        <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Administracion
                        </span>
                    </Link>
                )}
            </nav>
        </aside>
    );
}