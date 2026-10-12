"use client";

import { useEffect, useState } from "react";
import RegisterForm from "../../../components/RegisterForm";
import UserList from "../../../components/UserList";

// Define la vista del modulo de administracion protegida por rol.
export default function Administracion() {
    // Define los estados de validacion de seguridad.
    const [autorizado, setAutorizado] = useState(false);
    const [verificando, setVerificando] = useState(true);

    // Valida los privilegios del usuario actual.
    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) {
            const usuario = JSON.parse(data);
            // El rol 2 corresponde al perfil de Administrador.
            if (usuario.rol === 2) {
                // Ignora la advertencia de renderizado para establecer el estado de autorizacion de forma segura.
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setAutorizado(true);
            }
        }
        // Finaliza el ciclo de verificacion.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVerificando(false);
    }, []);

    // Renderiza el estado de validacion intermedio.
    if (verificando) {
        return (
            <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Renderiza el rechazo de acceso si no se cumplen los privilegios.
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

    // Renderiza el modulo si la validacion es exitosa.
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Administracion de Usuarios</h2>
                <p className="text-gray-600 mt-2">Gestiona los accesos, roles y permisos de la plataforma.</p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-4">
                    <RegisterForm />
                </div>
                <div className="xl:col-span-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Usuarios Registrados</h3>
                    <UserList />
                </div>
            </div>
        </div>
    );
}