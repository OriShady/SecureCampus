"use client";

import { useEffect, useState } from "react";

import { api } from "../../../services/api";

// Define la estructura de los datos de sesion.
interface UsuarioSesion {
    nombre: string;
    correo: string;
    rol: number;
}

// Define la estructura de los registros de actividad.
interface LogActividad {
    id: number;
    fecha: string;
    categoria: string;
    accion: string;
    descripcion: string;
    usuarioId: number | null;
    usuarioAfectadoId: number | null;
}

// Define la vista del modulo de perfiles de usuario.
export default function Perfiles() {
    // Define el estado local para almacenar la informacion de la cuenta activa.
    const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
    
    
    // Almacena los registros reales del sistema.
    const [logs, setLogs] = useState<LogActividad[]>([]);

    // Indica si se estan consultando los registros.
    const [cargandoLogs, setCargandoLogs] = useState(false);

    // Guarda cualquier error al consultar los logs.
    const [errorLogs, setErrorLogs] = useState("");

    // Comprueba si el usuario tiene el rol de administrador.
    // Esta validacion solo controla lo que se muestra en pantalla.
    const esAdministrador = usuario?.rol === 2;


    // Recupera los datos de la sesion almacenada localmente al montar el componente.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            // Ignora la advertencia de renderizado en cascada para leer el almacenamiento del navegador de forma segura.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsuario(JSON.parse(data));
        }
    }, []);
    
// Consulta los logs reales cuando se abre el perfil.
useEffect(() => {
        // Recupera la informacion del usuario.
        const data = localStorage.getItem("usuario");

        if (!data) return;

        let usuarioActual: UsuarioSesion;

        try {
            usuarioActual = JSON.parse(data);
        } catch {
            return;
        }

        // Solo intenta consultar los logs en la vista del administrador.
        if (usuarioActual.rol !== 2) return;

        // Recupera el token generado durante el inicio de sesion.
        const token = sessionStorage.getItem("token");

        if (!token) return;

        // Consulta los registros reales del backend.
        const obtenerLogs = async () => {
            try {
                setCargandoLogs(true);
                setErrorLogs("");

                const respuesta = await api.get(
                    "/LogsActividad",
                    token
                );

                setLogs(respuesta);
            } catch (error) {
                setErrorLogs(
                    error instanceof Error
                        ? error.message
                        : "No se pudieron cargar los registros."
                );
            } finally {
                setCargandoLogs(false);
            }
        };

        obtenerLogs();
    }, []);


    // Traduce el valor numerico del rol a su representacion de cadena de texto.
    const getNombreRol = (rol: number | undefined) => {
        if (rol === undefined) return "Desconocido";
        const roles = ["Estudiante", "Profesor", "Administrador", "Jefe de Carrera"];
        return roles[rol] || "Desconocido";
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Mi Perfil</h2>
                <p className="text-gray-600 mt-2">Consulta y gestiona tu informacion personal e institucional.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-6 mb-8 border-b pb-8">
                    <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center text-white text-4xl font-bold uppercase shadow-inner">
                        {usuario?.nombre?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{usuario?.nombre || "Usuario no identificado"}</h3>
                        <span className="inline-block mt-2 px-4 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold tracking-wide">
                            {getNombreRol(usuario?.rol)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Correo Institucional</p>
                        <p className="text-lg font-medium text-blue-900">{usuario?.correo || "No disponible"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Estado de la Cuenta</p>
                        <p className="text-lg font-medium text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Activa
                        </p>
                    </div>
                </div>
            </div>
            
       
    {/* Historial visible solamente para administradores */}
    {esAdministrador && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

            {/* Encabezado */}
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📋</span>

                <div>
                    <h3 className="text-xl font-bold text-gray-800">
                        Historial de actividades
                    </h3>
                    <p className="text-sm text-gray-500">
                        Consulta las actividades importantes del sistema.
                    </p>
                </div>
            </div>

            {/* Mensaje mientras se cargan los registros */}
            {cargandoLogs && (
                <p className="text-gray-500 text-sm">
                    Cargando registros...
                </p>
            )}

            {/* Mensaje cuando ocurre un error */}
            {errorLogs && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 text-sm">
                        {errorLogs}
                    </p>
                </div>
            )}

            {/* Tabla con los registros reales */}
            {!cargandoLogs && !errorLogs && logs.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">

                        <thead className="bg-slate-100 text-gray-700">
                            <tr>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Categoría</th>
                                <th className="p-3">Acción</th>
                                <th className="p-3">Descripción</th>
                                <th className="p-3">Usuario</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="border-b border-gray-100 hover:bg-slate-50"
                                >
                                    <td className="p-3 whitespace-nowrap text-gray-600">
                                        {new Date(log.fecha).toLocaleString("es-MX", {
                                            dateStyle: "short",
                                            timeStyle: "short"
                                        })}
                                    </td>

                                    <td className="p-3 text-gray-700">
                                        {log.categoria}
                                    </td>

                                    <td className="p-3">
                                        <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded-md font-medium">
                                            {log.accion}
                                        </span>
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {log.descripcion}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {log.usuarioId ?? "No identificado"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mensaje si no existen registros */}
            {!cargandoLogs && !errorLogs && logs.length === 0 && (
                <div className="bg-slate-50 border border-gray-200 rounded-lg p-5">
                    <p className="text-gray-500 text-sm">
                        No hay registros de actividad disponibles.
                    </p>
                </div>
            )}
        </div>
    )}
        </div>
    );
}