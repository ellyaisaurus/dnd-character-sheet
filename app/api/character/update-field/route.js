import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../lib/mongodb'; // CAMBIADO
import Character from '../../../models/Character'; // CAMBIADO

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { field, value } = await req.json();

    if (!field) {
      return NextResponse.json({ message: 'Field name is required' }, { status: 400 });
    }

    const update = { $set: { [field]: value } };

    const updatedCharacter = await Character.findOneAndUpdate(
      { userId: session.user.id },
      update,
      { new: true }
    );

    if (!updatedCharacter) {
      return NextResponse.json({ message: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Field updated successfully', character: updatedCharacter }, { status: 200 });

  } catch (error) {
    console.error("Error updating field:", error);
    return NextResponse.json({ message: 'An error occurred.', error: error.message }, { status: 500 });
  }
}