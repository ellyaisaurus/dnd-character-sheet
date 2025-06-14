import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../lib/mongodb'; // RUTA CORREGIDA
import Character from '../../../models/Character'; // RUTA CORREGIDA

// POST para añadir un nuevo ataque
export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const newAttack = await req.json();

        const character = await Character.findOneAndUpdate(
            { userId: session.user.id },
            { $push: { attacks: newAttack } },
            { new: true }
        );
        return NextResponse.json(character.attacks, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}

// DELETE para eliminar un ataque
export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const { attackId } = await req.json();

        const character = await Character.findOneAndUpdate(
            { userId: session.user.id },
            { $pull: { attacks: { _id: attackId } } },
            { new: true }
        );
        return NextResponse.json(character.attacks, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}