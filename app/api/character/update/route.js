import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import Character from '../../../models/Character';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    await dbConnect();
    const updatedData = await req.json();

    // No permitimos que el userId o _id se modifiquen desde el cliente
    delete updatedData._id;
    delete updatedData.userId;

    const character = await Character.findOneAndUpdate(
      { userId: session.user.id },
      { $set: updatedData },
      { new: true, runValidators: true } // new: true devuelve el doc actualizado, runValidators asegura que los datos son válidos
    );

    if (!character) {
      return NextResponse.json({ message: 'Personaje no encontrado' }, { status: 404 });
    }

    return NextResponse.json(character, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el personaje:", error);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}