"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Departamento {
    id: number;
    nombre: string;
}

export default function DepartamentosManager() {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [nombre, setNombre] = useState("");
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const cargarDepartamentos = async () => {
            try {
                setDepartamentos(await api.get("/departamentos"));
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "No se pudo cargar el catalogo de departamentos.");
            } finally {
                setCargando(false);
            }
        };

        cargarDepartamentos();
    }, []);

    const agregarDepartamento = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nombreLimpio = nombre.trim();
        if (!nombreLimpio) {
            setError("Escribe el nombre del departamento.");
            return;
        }

        if (departamentos.some((departamento) => departamento.nombre.localeCompare(nombreLimpio, "es", { sensitivity: "base" }) === 0)) {
            setError("Ese departamento ya esta registrado.");
            return;
        }

        setGuardando(true);
        setError("");
        setMensaje("");
        try {
            const nuevoDepartamento: Departamento = await api.post("/departamentos", { nombre: nombreLimpio });
            setDepartamentos((actuales) =>
                [...actuales, nuevoDepartamento].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
            );
            window.dispatchEvent(new Event("departamentos-actualizados"));
            setNombre("");
            setMensaje(`Departamento "${nuevoDepartamento.nombre}" agregado. Ya puedes asignarlo a profesores y jefes.`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "No se pudo agregar el departamento.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <section className="lg:col-span-5">
                <div className="rounded-xl border border-gray-200 bg-blue-950 p-6 shadow-md">
                    <h3 className="mb-2 border-b border-blue-800 pb-2 text-lg font-bold text-white">Agregar departamento</h3>
                    <p className="mb-5 text-sm text-blue-100">
                        Los departamentos son unidades academicas para organizar profesores y jefes; son distintos de las carreras.
                    </p>

                    {error && <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</p>}
                    {mensaje && <p role="status" className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">{mensaje}</p>}

                    <form onSubmit={agregarDepartamento} className="space-y-4">
                        <div>
                            <label htmlFor="nombreDepartamento" className="mb-1 block text-xs font-semibold text-blue-100">
                                Nombre del departamento
                            </label>
                            <input
                                id="nombreDepartamento"
                                type="text"
                                maxLength={100}
                                placeholder="Ej. Quimica"
                                className="w-full rounded border border-blue-300/30 bg-white/10 p-2 text-sm text-white placeholder:text-blue-200/60 focus:border-orange-500 focus:outline-none"
                                value={nombre}
                                onChange={(event) => setNombre(event.target.value)}
                                disabled={guardando}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={guardando || !nombre.trim()}
                            className="w-full rounded bg-orange-500 px-4 py-2 text-sm font-bold uppercase text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {guardando ? "Guardando..." : "Guardar departamento"}
                        </button>
                    </form>
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-7">
                <h3 className="mb-4 border-b pb-2 text-lg font-bold text-blue-900">Departamentos registrados</h3>
                {cargando ? (
                    <p className="py-8 text-center text-sm text-gray-500">Cargando departamentos...</p>
                ) : departamentos.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                        {departamentos.map((departamento) => (
                            <li key={departamento.id} className="flex items-center justify-between gap-3 py-3">
                                <span className="font-semibold text-gray-800">{departamento.nombre}</span>
                                <span className="font-mono text-xs text-gray-500">ID {departamento.id}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="rounded border border-dashed border-gray-200 bg-slate-50 p-8 text-center text-sm text-gray-500">
                        Aun no hay departamentos registrados.
                    </p>
                )}
            </section>
        </div>
    );
}
