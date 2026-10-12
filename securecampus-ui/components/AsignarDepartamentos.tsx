"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Usuario {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    correo: string;
    rol: number;
}

interface Departamento {
    id: number;
    nombre: string;
}

interface PerfilDepartamental {
    usuarioId: number;
    departamentoId: number;
}

export default function AsignarDepartamentos() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [profesores, setProfesores] = useState<PerfilDepartamental[]>([]);
    const [jefes, setJefes] = useState<PerfilDepartamental[]>([]);
    const [usuarioId, setUsuarioId] = useState("");
    const [departamentoId, setDepartamentoId] = useState("");
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [usuariosData, departamentosData, profesoresData, jefesData] = await Promise.all([
                    api.get("/usuarios"),
                    api.get("/departamentos"),
                    api.get("/perfilesprofesores"),
                    api.get("/perfilesjefes"),
                ]);
                setUsuarios(usuariosData);
                setDepartamentos(departamentosData);
                setProfesores(profesoresData);
                setJefes(jefesData);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "No se pudieron cargar los perfiles.");
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    const usuariosPendientes = usuarios.filter((usuario) => {
        if (usuario.rol === 1) {
            return !profesores.some((perfil) => perfil.usuarioId === usuario.id);
        }
        if (usuario.rol === 3) {
            return !jefes.some((perfil) => perfil.usuarioId === usuario.id);
        }
        return false;
    });

    const asignarDepartamento = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const usuario = usuariosPendientes.find((item) => item.id === Number(usuarioId));
        if (!usuario || !departamentoId) return;

        setGuardando(true);
        setError("");
        setMensaje("");
        try {
            const idDepartamento = Number(departamentoId);
            if (usuario.rol === 1) {
                const perfil = await api.post("/perfilesprofesores", {
                    numeroEmpleado: `DOC-${usuario.id.toString().padStart(5, "0")}`,
                    usuarioId: usuario.id,
                    departamentoId: idDepartamento,
                });
                setProfesores((actuales) => [...actuales, perfil]);
            } else {
                const perfil = await api.post("/perfilesjefes", {
                    numeroEmpleado: `JEF-${usuario.id.toString().padStart(5, "0")}`,
                    fechaNombramiento: new Date().toISOString(),
                    usuarioId: usuario.id,
                    departamentoId: idDepartamento,
                });
                setJefes((actuales) => [...actuales, perfil]);
            }

            setUsuarioId("");
            setDepartamentoId("");
            setMensaje(`Perfil departamental asignado a ${usuario.nombre} ${usuario.apellidoPaterno}.`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "No se pudo asignar el departamento.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-bold text-blue-900">Perfiles de profesores y jefes</h3>
            <p className="mb-5 text-sm text-gray-600">
                Asigna un departamento a las cuentas existentes que aun no tienen su perfil institucional. Esto habilita los listados e informes departamentales.
            </p>

            {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {mensaje && <p role="status" className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">{mensaje}</p>}

            {cargando ? (
                <p className="text-sm text-gray-500">Cargando cuentas y departamentos...</p>
            ) : usuariosPendientes.length === 0 ? (
                <p className="rounded border border-dashed border-gray-200 bg-slate-50 p-4 text-sm text-gray-600">
                    Todas las cuentas de profesores y jefes tienen un perfil departamental.
                </p>
            ) : (
                <form onSubmit={asignarDepartamento} className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
                    <div>
                        <label htmlFor="usuarioDepartamental" className="mb-1 block text-sm font-semibold text-gray-700">Cuenta</label>
                        <select
                            id="usuarioDepartamental"
                            value={usuarioId}
                            onChange={(event) => setUsuarioId(event.target.value)}
                            className="w-full rounded border border-gray-300 bg-white p-2 text-sm text-gray-800"
                            required
                        >
                            <option value="">Selecciona profesor o jefe...</option>
                            {usuariosPendientes.map((usuario) => (
                                <option key={usuario.id} value={usuario.id}>
                                    {usuario.rol === 1 ? "Profesor" : "Jefe"} — {usuario.nombre} {usuario.apellidoPaterno} ({usuario.correo})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="departamentoPerfil" className="mb-1 block text-sm font-semibold text-gray-700">Departamento</label>
                        <select
                            id="departamentoPerfil"
                            value={departamentoId}
                            onChange={(event) => setDepartamentoId(event.target.value)}
                            className="w-full rounded border border-gray-300 bg-white p-2 text-sm text-gray-800"
                            required
                        >
                            <option value="">Selecciona un departamento...</option>
                            {departamentos.map((departamento) => (
                                <option key={departamento.id} value={departamento.id}>{departamento.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={guardando || !usuarioId || !departamentoId}
                        className="rounded bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {guardando ? "Asignando..." : "Asignar departamento"}
                    </button>
                </form>
            )}
        </section>
    );
}
