import { getServerSession } from 'next-auth/next'; // Importación ligeramente diferente
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }) {
  // Obtenemos la sesión del lado del servidor
  const session = await getServerSession(authOptions);

  // La condición de redirección
  if (!session || session.user?.role !== 'admin') {
    console.log("AdminLayout: Redirigiendo. Rol de sesión:", session?.user?.role);
    redirect('/');
  }

  console.log("AdminLayout: Acceso concedido. Rol de sesión:", session.user.role);

  return (
    <div>
      <h1>Panel de Administrador</h1>
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--color-earth-brown)', marginBottom: '20px', paddingBottom: '10px' }}>
        <Link href="/admin/players"><button style={{width: 'auto'}}>Gestión de Jugadores</button></Link>
        <Link href="/admin/logs"><button style={{width: 'auto'}}>Logs de Modificaciones</button></Link>
      </div>
      {children}
    </div>
  );
}
