"use client";

import { useEffect, useState } from "react";
import RegistroUsuarioForm from "../../../components/RegistroUsuarioForm";
import UserList from "../../../components/UserList";
import AsignarDepartamentos from "../../../components/AsignarDepartamentos";

/// Define el componente principal de la vista de administracion.
export default function Administracion() {
    const [autorizado, setAutorizado] = useState(false);
    const [verificando, setVerificando] = useState(true);

    /// Ejecuta la validacion de privilegios al montar el componente.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            const usuario = JSON.parse(data);
            if (usuario.rol === 2) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setAutorizado(true);
            }
        }
        setVerificando(false);
    }, []);

    if (verificando) {
        return (
            <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!autorizado) {
        return (
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-red-50 p-8 rounded-lg shadow-sm border border-red-200 text-center">
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Acceso Denegado</h2>
                    <p className="text-red-600">No cuentas con los privilegios necesarios para visualizar este modulo.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Administracion de Usuarios</h2>
                <p className="text-gray-600 mt-2">Gestiona los accesos, roles y permisos de la plataforma.</p>
            </div>
            
            <div className="space-y-6">
                <AsignarDepartamentos />
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <div className="xl:col-span-5">
                        <RegistroUsuarioForm />
                    </div>
                    <div className="xl:col-span-7 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Usuarios Registrados</h3>
                        <UserList />
                    </div>
                </div>
            </div>
        </div>
    );
}