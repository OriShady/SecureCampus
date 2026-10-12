"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Define la estructura de sesion para renderizar el nombre dinamicamente.
interface UsuarioSesion {
    nombre: string;
    rol: number;
}

// Define la vista principal del panel con accesos directos a los modulos.
export default function Dashboard() {
    const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

    // Recupera los datos del usuario en sesion.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            // Ignora la advertencia de renderizado para cargar los datos en pantalla.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsuario(JSON.parse(data));
        }
    }, []);

    const accesos = usuario?.rol === 0
        ? [
            { href: "/dashboard/calificaciones", titulo: "Historial Academico", descripcion: "Consulta tus calificaciones registradas." },
            { href: "/dashboard/documentos", titulo: "Gestion de Documentos", descripcion: "Carga y descarga documentos vinculados a tu perfil." },
        ]
        : usuario?.rol === 1
            ? [
                { href: "/dashboard/calificaciones", titulo: "Calificaciones", descripcion: "Registra evaluaciones para tus alumnos inscritos." },
                { href: "/dashboard/mis-listas", titulo: "Mis Listas", descripcion: "Consulta e imprime los alumnos de tus grupos." },
            ]
            : usuario?.rol === 3
                ? [
                    { href: "/dashboard/reportes-academicos", titulo: "Reportes Academicos", descripcion: "Consulta las calificaciones de tu departamento." },
                ]
                : [
                    { href: "/dashboard/carreras", titulo: "Carreras", descripcion: "Administra el catalogo de carreras." },
                    { href: "/dashboard/departamentos", titulo: "Departamentos", descripcion: "Administra el catalogo usado para asignar perfiles departamentales." },
                    { href: "/dashboard/cursos", titulo: "Cursos", descripcion: "Administra materias y profesores." },
                    { href: "/dashboard/inscripciones", titulo: "Inscripciones", descripcion: "Gestiona alumnos inscritos en los cursos." },
                ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Bienvenido, {usuario?.nombre || "Usuario"}</h2>
                <p className="text-gray-600 mt-2">Panel principal de control. Selecciona una opcion rapida para continuar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/dashboard/perfiles" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">P</div>
                    <h3 className="text-lg font-bold text-gray-800">Mi Perfil</h3>
                    <p className="text-sm text-gray-500 mt-1">Consulta tu informacion personal e institucional.</p>
                </Link>
                {accesos.map((acceso, index) => (
                    <Link key={acceso.href} href={acceso.href} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl font-bold text-blue-900 transition-colors group-hover:bg-blue-900 group-hover:text-white">
                            {index + 1}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">{acceso.titulo}</h3>
                        <p className="mt-1 text-sm text-gray-500">{acceso.descripcion}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}