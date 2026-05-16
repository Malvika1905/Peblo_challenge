import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const archived = searchParams.get('archived') === 'true';

    let query: any = { userId, isArchived: archived };

    if (search) {
      query.$text = { $search: search };
    }

    if (tag) {
      query.tags = tag;
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    return NextResponse.json({ notes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    console.log('API: Creating note for user:', userId);
    
    if (!userId) {
      console.error('API: Unauthorized - No user ID found in request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('API: Received body:', body);
    
    const { title, content, tags } = body;
    const note = await Note.create({
      userId,
      title: title || 'Untitled Note',
      content: content || '',
      tags: tags || [],
    });

    console.log('API: Note created successfully:', note._id);
    return NextResponse.json({ note });
  } catch (error: any) {
    console.error('API: Error creating note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
