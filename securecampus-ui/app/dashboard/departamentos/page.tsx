"use client";

import { useEffect, useState } from "react";
import DepartamentosManager from "../../../components/DepartamentosManager";

export default function DepartamentosPage() {
    const [autorizado, setAutorizado] = useState(false);
    const [verificando, setVerificando] = useState(true);

    useEffect(() => {
        const sesion = localStorage.getItem("usuario");
        if (sesion) {
            try {
                const usuario: { rol: number } = JSON.parse(sesion);
                if (usuario.rol === 2) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setAutorizado(true);
                }
            } catch (error) {
                console.error("La sesion guardada no es valida.", error);
            }
        }
        setVerificando(false);
    }, []);

    if (verificando) {
        return <div className="p-8 text-center text-sm text-gray-500">Verificando acceso...</div>;
    }

    if (!autorizado) {
        return (
            <div role="alert" className="mx-auto mt-10 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-8 text-center">
                <h2 className="mb-2 text-2xl font-bold text-red-800">Acceso denegado</h2>
                <p className="text-red-600">Este modulo es exclusivo para personal administrativo.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">Gestion de Departamentos</h2>
                <p className="mt-2 text-gray-600">
                    Agrega departamentos y luego asigna cada uno a los perfiles de profesores y jefes desde Administracion.
                </p>
            </header>
            <DepartamentosManager />
        </div>
    );
}
