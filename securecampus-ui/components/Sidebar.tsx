"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, User, BookOpen, FileText, Settings, ClipboardList, GraduationCap } from "lucide-react";
interface UsuarioSesion {
    rol: number;
}

export default function Sidebar() {
    const [rolUsuario, setRolUsuario] = useState<number | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            const usuario: UsuarioSesion = JSON.parse(data);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRolUsuario(usuario.rol);
        }
    }, []);

    return (
        <aside className="absolute left-0 top-0 h-[calc(100%-2rem)] bg-blue-950 text-white shadow-xl z-20 transition-all duration-300 ease-in-out w-16 hover:w-64 overflow-hidden group rounded-r-xl">
            <nav className="flex flex-col py-6 space-y-2">
                {/* Modulos de acceso global */}
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

                {/* Modulos exclusivos para Estudiantes (0) y Profesores (1) */}
                {(rolUsuario === 0 || rolUsuario === 1) && (
                    <Link href="/dashboard/calificaciones" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                        <div className="min-w-[2rem] flex justify-center"><BookOpen size={20} /></div>
                        <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Calificaciones
                        </span>
                    </Link>
                )}

                {/* Modulos exclusivos para Estudiantes (0) */}
                {rolUsuario === 0 && (
                    <Link href="/dashboard/documentos" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                        <div className="min-w-[2rem] flex justify-center"><FileText size={20} /></div>
                        <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Documentos
                        </span>
                    </Link>
                )}

                {/* Modulos exclusivos para Administradores (2) */}
                {rolUsuario === 2 && (
                    <>
                        <Link href="/dashboard/carreras" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                            <div className="min-w-[2rem] flex justify-center"><GraduationCap size={20} /></div>
                            <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Carreras
                            </span>
                        </Link>
                        <Link href="/dashboard/cursos" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                            <div className="min-w-[2rem] flex justify-center"><BookOpen size={20} /></div>
                            <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Cursos
                            </span>
                        </Link>
                        <Link href="/dashboard/inscripciones" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                            <div className="min-w-[2rem] flex justify-center"><ClipboardList size={20} /></div>
                            <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Inscripciones
                            </span>
                        </Link>
                        <Link href="/dashboard/administracion" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                            <div className="min-w-[2rem] flex justify-center"><Settings size={20} /></div>
                            <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Administracion
                            </span>
                        </Link>
                    </>
                )}
            </nav>
        </aside>
    );
}