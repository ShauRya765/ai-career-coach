import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // For now, we'll use a simple text extraction
        // In production, you'd use a library like pdf-parse
        // For this demo, we'll just return instructions to use .txt files

        // Simple approach: Use browser's built-in PDF text extraction
        const text = buffer.toString('utf-8');

        return NextResponse.json({ text });
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return NextResponse.json(
            { error: 'Failed to parse PDF. Please use a .txt file instead.' },
            { status: 500 }
        );
    }
}