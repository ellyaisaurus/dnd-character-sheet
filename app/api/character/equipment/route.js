import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../lib/mongodb'; // RUTA CORREGIDA
import Character from '../../../models/Character'; // RUTA CORREGIDA

// POST para añadir un nuevo item
export async function POST(req) {
const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

try {
    await dbConnect();
    const newItem = await req.json();

    const character = await Character.findOneAndUpdate(
        { userId: session.user.id },
        { $push: { equipment: newItem } },
        { new: true }
    );
    return NextResponse.json(character.equipment, { status: 200 });
} catch (error) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
}
}

// DELETE para eliminar un item
export async function DELETE(req) {
const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

try {
    await dbConnect();
    const { itemId } = await req.json();

    const character = await Character.findOneAndUpdate(
        { userId: session.user.id },
        { $pull: { equipment: { _id: itemId } } },
        { new: true }
    );
    return NextResponse.json(character.equipment, { status: 200 });
} catch (error) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
}
} 