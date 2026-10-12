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
    get: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`);
        if (!res.ok) throw new Error(await getErrorMessage(res, "GET"));
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
    download: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`);
        if (!res.ok) throw new Error(await getErrorMessage(res, "Descarga de archivo"));
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