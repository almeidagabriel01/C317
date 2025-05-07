'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/navbar/Navbar';
import PaymentLayout from '@/components/pagamento/PaymentLayout';
import PixInstructions from '@/components/pagamento/PixInstructions';
import CardInstructions from '@/components/pagamento/CardInstructions';

export default function PagamentoPage() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState('pix');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      <main className="flex flex-1 items-center justify-center p-2 sm:p-4 md:p-8">
        <PaymentLayout selected={method} onSelect={setMethod}>
          {method === 'pix' ? <PixInstructions /> : <CardInstructions method={method} />}
        </PaymentLayout>
      </main>
      <footer className="py-4 text-center text-orange-400 text-sm">
        © {new Date().getFullYear()} - Todos os direitos reservados
      </footer>
    </div>
  );
}