import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import Character from '../../../models/Character';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { statName, value, reason } = await req.json();

    if (!statName || value === undefined || !reason) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Creamos el objeto de la nueva modificación
    const newModification = { value: Number(value), reason };

    // Usamos una operación atómica $push para añadir la modificación
    // Esto es más seguro y eficiente que find-modify-save.
    // El objeto { new: true } hace que nos devuelva el documento actualizado.
    const updatedCharacter = await Character.findOneAndUpdate(
        { userId: session.user.id },
        { $push: { [`${statName}.modifications`]: newModification } },
        { new: true }
    ).lean(); // .lean() para obtener un objeto JS plano

    if (!updatedCharacter) {
        return NextResponse.json({ message: 'Character not found to update' }, { status: 404 });
    }

    // Devolvemos solo la estadística actualizada
    return NextResponse.json(updatedCharacter[statName], { status: 200 });

  } catch (error) {
    // Log mejorado para capturar errores de validación de Mongoose
    console.error("--- ERROR IN UPDATE-STAT API ---");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Full Error Object:", JSON.stringify(error, null, 2));
    console.error("--- END OF ERROR ---");
    
    return NextResponse.json({ message: 'An internal server error occurred.', error: error.message }, { status: 500 });
  }
}
