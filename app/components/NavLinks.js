'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
// Importamos los iconos que usaremos de react-icons
import { FaScroll, FaUserShield, FaUserPlus } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

export default function NavLinks() {
    const { data: session, status } = useSession();

    // Mientras se carga la sesión, no mostramos nada para evitar parpadeos
    if (status === 'loading') {
        return null;
    }

    return (
        <>
            {session ? (
                // --- ENLACES PARA USUARIO AUTENTICADO ---
                <>
                    <Link href="/sheet" className="nav-link">
                        <FaScroll className="nav-icon" />
                        <span>Mi Hoja</span>
                    </Link>
                    
                    {/* El enlace de Admin solo aparece si el usuario tiene el rol 'admin' */}
                    {session.user?.role === 'admin' && (
                        <Link href="/admin/players" className="nav-link">
                            <FaUserShield className="nav-icon" />
                            <span>Admin</span>
                        </Link>
                    )}

                    {/* Usamos un botón con la función signOut() para una mejor experiencia */}
                    <button 
                        onClick={() => signOut({ callbackUrl: '/' })} 
                        className="nav-link" 
                        style={{background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', margin: 0}}
                    >
                        <FiLogOut className="nav-icon" />
                        <span>Cerrar Sesión</span>
                    </button>
                </>
            ) : (
                // --- ENLACES PARA USUARIO NO AUTENTICADO ---
                <>
                    <Link href="/login" className="nav-link">
                        <FiLogIn className="nav-icon" />
                        <span>Iniciar Sesión</span>
                    </Link>
                    <Link href="/register" className="nav-link">
                        <FaUserPlus className="nav-icon" />
                        <span>Registrarse</span>
                    </Link>
                </>
            )}
        </>
    );
}
