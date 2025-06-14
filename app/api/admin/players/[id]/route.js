import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import Character from '../../../../models/Character';
import User from '../../../../models/User';

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // LÍNEA CORREGIDA: Usamos 'id' en lugar de 'userId' para que coincida con el nombre de la carpeta [id]
        const { id } = params;
        console.log("Admin GET Player API: Fetching data for userId:", id);

        await dbConnect();
        console.log("Admin GET Player API: DB Connected.");

        // La consulta a la base de datos sigue usando el campo 'userId'
        const character = await Character.findOne({ userId: id });

        if (!character) {
            return NextResponse.json({ message: `No character sheet found for user with ID: ${id}` }, { status: 404 });
        }

        return NextResponse.json(character, { status: 200 });
    } catch (error) {
        console.error("Admin GET Player API: Server error:", error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        // LÍNEA CORREGIDA: Usamos 'id' en lugar de 'userId'
        const { id } = params;
        const dataToUpdate = await req.json();

        delete dataToUpdate._id;
        delete dataToUpdate.userId;

        const updatedCharacter = await Character.findOneAndUpdate(
            { userId: id }, // La consulta a la BD sigue usando el campo 'userId'
            { $set: dataToUpdate },
            { new: true }
        );

        if (!updatedCharacter) {
            return NextResponse.json({ message: 'Character not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Character updated successfully', character: updatedCharacter }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}
