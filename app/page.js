import { getServerSession } from 'next-auth/next';
import { authOptions } from './lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="home-container">
      <section className="hero-section">
        {session ? (
          <>
            <h1>Bienvenido de nuevo, {session.user.name}</h1>
            <p className="subtitle">Tu aventura te espera. Accede a tu hoja de personaje para continuar donde lo dejaste.</p>
            <Link href="/sheet">
              <button className="cta-button">Ver mi Hoja de Personaje</button>
            </Link>
          </>
        ) : (
          <>
            <h1>Dandelion&Dragons</h1>
            <p className="subtitle">
              Forja leyendas, gestiona tus héroes y vive tus campañas al máximo. Tu hoja de personaje digital, siempre a tu alcance.
            </p>
            <div className="button-group">
              <Link href="/login">
                <button className="cta-button">Iniciar Sesión</button>
              </Link>
              <Link href="/register">
                <button className="cta-button cta-button-secondary">Crear Cuenta</button>
              </Link>
            </div>
          </>
        )}
      </section>

      <section className="features-section">
        <h2>Una Herramienta para Cada Héroe</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Gestión Completa</h3>
            <p>Lleva un registro detallado de tus estadísticas, habilidades, competencias e inventario. Todo en un solo lugar.</p>
          </div>
          <div className="feature-card">
            <h3>Siempre Accesible</h3>
            <p>Accede a tu hoja de personaje desde cualquier dispositivo. Tu héroe te acompaña a donde vayas.</p>
          </div>
          <div className="feature-card">
            <h3>Enfócate en el Rol</h3>
            <p>Olvídate del papel y los lápices. Con una interfaz clara e intuitiva, podrás centrarte en lo que de verdad importa: la aventura.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
