import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Server is running',
        env: {
            hasDatabase: !!process.env.DATABASE_URL,
            hasNextAuth: !!process.env.NEXTAUTH_SECRET,
            hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        }
    });
}
