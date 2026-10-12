// Define la vista del panel principal para usuarios autenticados.
export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="bg-blue-900 text-white p-6 rounded-lg shadow-md border-b-4 border-orange-500 mb-8">
                    <h1 className="text-3xl font-serif font-bold">SecureCampus</h1>
                    <p className="text-blue-200 mt-1">Panel de Control General</p>
                </header>
                
                <main className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Bienvenido al sistema</h2>
                    <p className="text-gray-600 mt-2">Navegacion segura establecida. Los modulos se cargaran segun tu perfil.</p>
                </main>
            </div>
        </div>
    );
}