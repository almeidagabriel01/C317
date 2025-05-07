"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "../../components/navbar/Navbar";

export default function OrcamentoPage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="w-full bg-[#e5d5b0] rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Solicitar Orçamento</h1>

            <p className="text-xl text-center text-gray-700 mb-8">
              Esta página está em desenvolvimento. Em breve você poderá solicitar orçamentos personalizados para seus eventos.
            </p>

            <div className="flex justify-center">
              <div className="bg-gray-700 rounded-full p-4 w-24 h-24 flex items-center justify-center">
                <span className="text-5xl text-gray-200">$</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}