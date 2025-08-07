import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs'; // You'll need a password hashing library
// import prisma from '@/lib/prisma'; // Assuming your Prisma client is at lib/prisma.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // --- Input Validation (Example with basic checks) ---
    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Missing required fields (email, password, name).' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long.' }, { status: 400 });
    }
    // TODO: Add more robust validation (e.g., email format, password complexity using Zod)

    // --- Placeholder Signup Logic (REMOVE THIS AND INTEGRATE WITH YOUR DATABASE) ---
    console.log(`Attempting to sign up user: ${name} (${email})`);

    // TODO: 1. Check if user already exists in your database (e.g., using prisma.user.findUnique)
    // const existingUser = await prisma.user.findUnique({ where: { email } });
    // if (existingUser) {
    //   return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 }); // 409 Conflict
    // }

    // TODO: 2. Hash the password before storing it
    // const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // TODO: 3. Create the new user in your database
    // const newUser = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //     // Add other fields as necessary
    //   },
    // });

    // For placeholder, we'll just log and return success
    console.log(`Placeholder: User ${name} (${email}) would be created here.`);
    // In a real scenario, you might return some user data (excluding password) or just a success message.
    // return NextResponse.json({ message: 'User created successfully!', user: { id: 'placeholder-id', name, email } }, { status: 201 });
    return NextResponse.json({ message: 'Signup successful (placeholder)! Please login.' }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during signup.' }, { status: 500 });
  }
}
