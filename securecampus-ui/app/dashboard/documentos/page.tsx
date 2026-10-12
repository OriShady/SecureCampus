import DocumentosList from "../../../components/DocumentosList";

// Define la vista del modulo de documentos.
export default function Documentos() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Documentos</h2>
                <p className="text-gray-600 mt-2">Consulta y gestiona los archivos y expedientes almacenados en el sistema.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <DocumentosList />
            </div>
        </div>
    );
}