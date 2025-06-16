// app/layout.js

import './globals.css';
import AuthProvider from './components/AuthProvider';
import Navbar from './components/Navbar'; // Importamos el nuevo componente

export const metadata = {
  title: 'D&D Character Sheet',
  description: 'Your digital D&D character sheet manager.',
  // Next.js añade la etiqueta viewport por defecto, pero si necesitaras personalizarla, lo harías aquí:
  // viewport: 'width=device-width, initial-scale=1', 
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar /> {/* Usamos el componente Navbar aquí */}
          <main className="container">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}