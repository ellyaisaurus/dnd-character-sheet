import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth'; // Ruta corregida para importar desde lib/
import dbConnect from '../../lib/mongodb';
import Character from '../../models/Character';

export async function GET(req) {
  // Obtenemos la sesión del lado del servidor
  const session = await getServerSession(authOptions);

  // Si no hay sesión, el usuario no está autenticado
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    
    // Buscamos el personaje usando el ID del usuario de la sesión
    const character = await Character.findOne({ userId: session.user.id }).lean();
    
    if (!character) {
      // Si no se encuentra, es un error 404
      return NextResponse.json({ message: 'Character not found for the current user' }, { status: 404 });
    }

    // Si se encuentra, lo devolvemos
    return NextResponse.json(character, { status: 200 });
  } catch (error) {
    console.error("Error fetching character data:", error);
    return NextResponse.json({ message: 'An error occurred.', error: error.message }, { status: 500 });
  }
}
