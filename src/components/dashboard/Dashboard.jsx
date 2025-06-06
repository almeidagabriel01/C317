"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/Navbar";
import DashboardStats from "./stats/DashboardStats";
import DashboardCharts from "./charts/DashboardCharts";

export default function Dashboard() {
  const { user, role, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && isAuthenticated && role !== 'Administrador') {
      router.push('/');
    }
  }, [isAuthenticated, loading, router, role]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-xl font-sans">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-amber-400 font-serif">Dashboard</h1>
        
        <DashboardStats />
        <DashboardCharts />
      </main>
    </div>
  );
}