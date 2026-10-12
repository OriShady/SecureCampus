// Establece la URL base del backend.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5110/api";

// Proporciona metodos para realizar peticiones HTTP.
export const api = {
    get: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`);
        if (!res.ok) throw new Error("Error en peticion GET");
        return res.json();
    },
    post: async (endpoint: string, data: unknown) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error en peticion POST");
        return res.json();
    }
};