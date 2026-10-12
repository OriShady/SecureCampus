"use client";

import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define la estructura maestra para las pantallas internas del sistema en formato de filas.
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [autenticado, setAutenticado] = useState(false);

    // Verifica la existencia de una sesion activa antes de renderizar la interfaz.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (!data) {
            router.push("/");
        } else {
            // Ignora la advertencia de renderizado para establecer el estado de autenticacion.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAutenticado(true);
        }
    }, [router]);

    // Retorna un indicador de carga mientras se valida la sesion para evitar accesos visuales no autorizados.
    if (!autenticado) {
        return (
            <div className="flex h-screen bg-slate-50 items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            {/* Fila Superior: Encabezado de ancho completo con diseno flotante */}
            <div className="px-8 pt-8 shrink-0 z-30 relative">
                <header className="bg-blue-900 text-white p-6 rounded-xl shadow-md border-b-4 border-orange-500 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-wide">SecureCampus</h1>
                        <p className="text-blue-200 mt-1 text-sm font-medium tracking-wide uppercase">Portal Academico</p>
                    </div>
                    
                    <LogoutButton />
                    
                </header>
            </div>
            
            {/* Fila Inferior: Barra lateral y area de trabajo */}
            <div className="flex flex-1 relative overflow-hidden mt-6">
                <Sidebar />
                
                {/* El margen izquierdo (pl-24) evita que la barra lateral oculte el contenido */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto px-8 pb-8 pl-24">
                    {children}
                </main>
            </div>
        </div>
    );
}