// Establece la URL base del backend.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5110/api";

async function getErrorMessage(response: Response, method: string): Promise<string> {
    const body = await response.text();
    let detail = "";

    if (body) {
        try {
            const payload: unknown = JSON.parse(body);
            if (typeof payload === "object" && payload !== null) {
                const data = payload as Record<string, unknown>;
                const message = data.mensaje ?? data.error ?? data.title;
                if (typeof message === "string") detail = message;
            }
        } catch {
            detail = body;
        }
    }

    return detail || `${method}: ${response.status} ${response.statusText}`;
}

// Proporciona metodos para realizar peticiones HTTP.
export const api = {
    
    get: async (endpoint: string, token?: string) => {
        // Prepara los encabezados de la solicitud.
        const headers: HeadersInit = {};

        // Agrega el token cuando se proporciona.
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Realiza la consulta al backend.
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers
        });

        // Controla los errores de la API.
        if (!res.ok) {
            throw new Error(await getErrorMessage(res, "GET"));
        }

        return res.json();
    },

    post: async (endpoint: string, data: unknown) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await getErrorMessage(res, "POST"));
        return res.json();
    },
    upload: async (endpoint: string, data: FormData) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            body: data,
        });
        if (!res.ok) throw new Error(await getErrorMessage(res, "Carga de archivo"));
        return res.json();
    },
    
    // Descarga archivos y permite enviar el token JWT.
    download: async (endpoint: string, token?: string) => {
        const headers: HeadersInit = {};

        // Incluye el token cuando se proporciona.
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}${endpoint}`, {
            headers
        });

        if (!res.ok) {
            throw new Error(
                await getErrorMessage(res, "Descarga de archivo")
            );
        }

        return res.blob();
    },

    delete: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error(await getErrorMessage(res, "DELETE"));
        return res.json();
    }
};