import DocumentosList from "../../../components/DocumentosList";

export default function Documentos() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Gestion de Documentos</h2>
                <p className="text-gray-600 mt-2">Carga archivos vinculados a tu perfil y descarga los que ya registraste.</p>
            </div>
            <DocumentosList />
        </div>
    );
}