import LoginForm from "../components/LoginForm";

// Define la vista principal publica de la aplicacion, exclusiva para inicio de sesion.
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 to-blue-900 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      
      <div className="relative z-10 w-full px-4">
        {/* Renderiza unicamente el formulario de acceso */}
        <LoginForm />
      </div>
    </main>
  );
}