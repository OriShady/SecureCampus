"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

interface Documento {
    id: number;
    nombreArchivo: string;
    fechaCarga: string;
    estudianteId: number;
}

interface SesionEstudiante {
    id: number;
    rol: number;
}

const MAXIMO_BYTES = 10 * 1024 * 1024;

export default function DocumentosList() {
    const [estudianteId, setEstudianteId] = useState<number | null>(null);
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [archivo, setArchivo] = useState<File | null>(null);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [descargandoId, setDescargandoId] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const cargarDocumentos = async () => {
            try {
                const sesion = localStorage.getItem("usuario");
                if (!sesion) throw new Error("No se encontro una sesion activa.");

                const usuario: SesionEstudiante = JSON.parse(sesion);
                if (usuario.rol !== 0) {
                    setMensaje({ texto: "Este modulo es exclusivo para estudiantes.", tipo: "error" });
                    return;
                }

                setEstudianteId(usuario.id);
                setDocumentos(await api.get(`/documentos/estudiante/${usuario.id}`));
            } catch (error) {
                console.error(error);
                setMensaje({
                    texto: error instanceof Error ? error.message : "No se pudieron cargar tus documentos.",
                    tipo: "error"
                });
            } finally {
                setCargando(false);
            }
        };

        cargarDocumentos();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (estudianteId === null || archivo === null) return;

        if (archivo.size > MAXIMO_BYTES) {
            setMensaje({ texto: "El archivo no puede superar los 10 MB.", tipo: "error" });
            return;
        }

        const extensionesPermitidas = [".pdf", ".png", ".jpg", ".jpeg"];
        const extension = archivo.name.slice(archivo.name.lastIndexOf(".")).toLowerCase();
        if (!extensionesPermitidas.includes(extension)) {
            setMensaje({ texto: "Solo puedes cargar archivos PDF, PNG o JPG.", tipo: "error" });
            return;
        }

        setSubiendo(true);
        setMensaje({ texto: "", tipo: "" });

        try {
            const datos = new FormData();
            datos.append("archivo", archivo);
            const documento: Documento = await api.upload(`/documentos/estudiante/${estudianteId}`, datos);
            setDocumentos((actuales) => [documento, ...actuales]);
            setArchivo(null);
            if (inputRef.current) inputRef.current.value = "";
            setMensaje({ texto: "Documento cargado correctamente.", tipo: "exito" });
        } catch (error) {
            console.error(error);
            setMensaje({
                texto: error instanceof Error ? error.message : "No se pudo cargar el documento.",
                tipo: "error"
            });
        } finally {
            setSubiendo(false);
        }
    };

    const descargar = async (documento: Documento) => {
        if (estudianteId === null) return;

        setDescargandoId(documento.id);
        setMensaje({ texto: "", tipo: "" });
        try {
            const contenido = await api.download(
                `/documentos/estudiante/${estudianteId}/${documento.id}/descargar`
            );
            const url = URL.createObjectURL(contenido);
            const enlace = document.createElement("a");
            enlace.href = url;
            enlace.download = documento.nombreArchivo;
            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            setMensaje({
                texto: error instanceof Error ? error.message : "No se pudo descargar el documento.",
                tipo: "error"
            });
        } finally {
            setDescargandoId(null);
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-blue-900">Cargar documento</h3>
                <p className="mb-4 text-sm text-gray-600">Formatos permitidos: PDF, PNG y JPG. Tamano maximo: 10 MB.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label htmlFor="archivo" className="mb-1 block text-sm font-semibold text-gray-700">Archivo</label>
                        <input
                            ref={inputRef}
                            id="archivo"
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(event) => setArchivo(event.target.files?.[0] ?? null)}
                            disabled={subiendo || estudianteId === null}
                            className="block w-full rounded border border-gray-300 p-2 text-sm text-gray-700 file:mr-3 file:rounded file:border-0 file:bg-blue-900 file:px-3 file:py-2 file:font-semibold file:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!archivo || subiendo || estudianteId === null}
                        className="rounded bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {subiendo ? "Cargando..." : "Cargar archivo"}
                    </button>
                </form>
            </section>

            {mensaje.texto && (
                <p role={mensaje.tipo === "error" ? "alert" : "status"}
                    className={`rounded p-3 text-sm ${mensaje.tipo === "exito" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {mensaje.texto}
                </p>
            )}

            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-blue-900">Mis documentos</h3>
                {cargando ? (
                    <p className="py-8 text-center text-sm text-gray-500">Cargando documentos...</p>
                ) : documentos.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                        {documentos.map((documento) => (
                            <li key={documento.id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{documento.nombreArchivo}</p>
                                    <p className="text-xs text-gray-500">
                                        Cargado el {new Date(documento.fechaCarga).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => descargar(documento)}
                                    disabled={descargandoId !== null}
                                    className="rounded border border-blue-900 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50 disabled:opacity-50"
                                >
                                    {descargandoId === documento.id ? "Descargando..." : "Descargar"}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="rounded border border-dashed border-gray-200 bg-slate-50 p-8 text-center text-sm text-gray-500">
                        Aun no has cargado documentos.
                    </p>
                )}
            </section>
        </div>
    );
}
