import "./globals.css";

export const metadata = {
  title: "Elo Drinks",
  description: "Open Bar e coquetelaria para seu evento"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="font-spline antialiased flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}