import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import Character from '../../models/Character';

export async function POST(req) {
  console.log("Register endpoint hit."); // Log para saber que la función se ejecuta
  try {
    console.log("Attempting to connect to DB...");
    await dbConnect();
    console.log("DB connection successful.");

    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists.' }, { status: 400 });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed.");

    console.log("Creating new user...");
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("New user created:", newUser._id);

    console.log("Creating default character sheet...");
    await Character.create({
        userId: newUser._id,
        playerName: newUser.name,
    });
    console.log("Character sheet created.");

    return NextResponse.json({ message: 'User created successfully.' }, { status: 201 });
  } catch (error) {
    // ESTE ES EL LOG MÁS IMPORTANTE
    console.error("ERROR EN REGISTRO:", error);
    return NextResponse.json({ message: 'An error occurred during registration.', error: error.message }, { status: 500 });
  }
}
