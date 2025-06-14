import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User from '../models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Faltan credenciales.');
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).lean();

        if (!user) {
          throw new Error('Usuario no encontrado.');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          throw new Error('Contraseña incorrecta.');
        }
        
        // Devolvemos el usuario completo para que el callback 'jwt' lo reciba
        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // El objeto 'user' viene de la función 'authorize' y solo se pasa en el primer login
      if (user) {
        token.id = user._id.toString();
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // El objeto 'token' viene del callback 'jwt'
      // Aquí pasamos los datos del token a la sesión del cliente
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    }
  }
};

// Exportamos el handler para usarlo en la ruta de la API
export const handler = NextAuth(authOptions);
