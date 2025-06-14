'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
        return;
      }

      router.replace('/sheet');
    } catch (e) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="form-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@email.com"
        />
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="********"
        />
        <button type="submit">Entrar</button>
        {error && <p style={{ color: 'var(--color-failure-red)', marginTop: '10px' }}>{error}</p>}
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        ¿No tienes una cuenta?{' '}
        <Link href="/register" style={{ fontWeight: 'bold' }}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
