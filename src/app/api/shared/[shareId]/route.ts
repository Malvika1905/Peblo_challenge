import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    await dbConnect();
    const { shareId } = await params;
    console.log('Shared API: Searching for shareId:', shareId);
    
    const note = await Note.findOne({ shareId, isPublic: true })
      .populate('userId', 'name');
    
    if (!note) {
      console.error('Shared API: Note not found or is private for shareId:', shareId);
      return NextResponse.json({ error: 'Note not found or private' }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
