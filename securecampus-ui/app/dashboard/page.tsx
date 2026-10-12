// Define la vista de bienvenida del panel de control.
export default function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto">
            <main className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Bienvenido al sistema</h2>
                <p className="text-gray-600 mt-2">Navegacion segura establecida. Los modulos se cargaran segun tu perfil.</p>
            </main>
        </div>
    );
}