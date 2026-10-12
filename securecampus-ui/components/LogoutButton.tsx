"use client";

import { useRouter } from "next/navigation";

// Define el componente funcional para el cierre de sesion.
export default function LogoutButton() {
    // Inicializa el controlador de rutas.
    const router = useRouter();

    // Elimina los datos almacenados localmente y redirige a la ruta principal.
    const handleLogout = () => {
        localStorage.removeItem("usuario");
        router.push("/");
    };

    return (
        <button 
            onClick={handleLogout}
            className="text-blue-100 font-bold hover:text-white transition-colors text-sm tracking-wide uppercase"
        >
            Cerrar Sesion
        </button>
    );
}