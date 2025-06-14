import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="admin-container">
      <h1 className="admin-header">Panel de Administrador</h1>
      <nav className="admin-nav">
        <Link href="/admin/players" className="admin-nav-button">
          Gestión de Jugadores
        </Link>
        <Link href="/admin/logs" className="admin-nav-button">
          Logs de Modificaciones
        </Link>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}