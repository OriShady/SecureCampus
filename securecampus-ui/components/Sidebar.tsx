import Link from "next/link";

// Define el componente de navegacion lateral ubicado debajo del encabezado principal.
export default function Sidebar() {
    return (
        <aside className="absolute left-0 top-0 h-[calc(100%-2rem)] bg-blue-950 text-white shadow-xl z-20 transition-all duration-300 ease-in-out w-16 hover:w-64 overflow-hidden group rounded-r-xl">
            <nav className="flex flex-col py-6 space-y-2">
                <Link href="/dashboard" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                    <div className="min-w-[2rem] font-bold text-lg text-center">I</div>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Inicio
                    </span>
                </Link>
                <Link href="/dashboard/perfiles" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                    <div className="min-w-[2rem] font-bold text-lg text-center">P</div>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Perfiles
                    </span>
                </Link>
                <Link href="/dashboard/calificaciones" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                    <div className="min-w-[2rem] font-bold text-lg text-center">C</div>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Calificaciones
                    </span>
                </Link>
                <Link href="/dashboard/documentos" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                    <div className="min-w-[2rem] font-bold text-lg text-center">D</div>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Documentos
                    </span>
                </Link>
                <Link href="/dashboard/administracion" className="flex items-center px-4 py-3 hover:bg-white/10 hover:text-orange-500 transition-all">
                    <div className="min-w-[2rem] font-bold text-lg text-center">A</div>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Administracion
                    </span>
                </Link>
            </nav>
        </aside>
    );
}