import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: "Elo Drinks",
  description: "Open Bar e coquetelaria para seu evento"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="font-spline antialiased flex flex-col min-h-screen bg-gray-900">
        <AuthProvider>
           {children}
           <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </AuthProvider>
      </body>
    </html>
  );
}