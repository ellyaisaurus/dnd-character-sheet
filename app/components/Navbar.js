// app/components/Navbar.js
'use client'; // Lo convertimos en Client Component para manejar el estado del menú

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavLinks from './NavLinks'; // Importamos tu componente de enlaces

// Íconos para el botón de menú (puedes personalizarlos si quieres)
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
  
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Este efecto cierra el menú móvil automáticamente si el usuario navega a otra página
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="main-nav">
            <Link href="/" className="nav-logo">
                Dandelion&Dragons 
            </Link>
            
            {/* Este es el contenedor que se comportará de forma responsiva.
                En escritorio es visible y en móvil se convierte en el menú desplegable */}
            <div className={`nav-links-container ${isMenuOpen ? 'active' : ''}`}>
                <NavLinks />
            </div>

            {/* Este es el botón de hamburguesa que solo será visible en móviles gracias al CSS */}
            <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
        </nav>
    );
}