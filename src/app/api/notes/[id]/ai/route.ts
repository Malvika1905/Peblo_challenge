import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import { getUserIdFromRequest } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = getUserIdFromRequest(req);
    console.log('AI API: Request for note:', id, 'by user:', userId);
    
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      console.error('AI API: Note not found:', id);
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    if (!note.content || note.content.trim().length < 10) {
      console.error('AI API: Content too short');
      return NextResponse.json({ error: 'Note content too short for AI analysis' }, { status: 400 });
    }

    console.log('AI API: Calling Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    // ... rest of the logic

    const prompt = `
      Analyze the following note content and provide:
      1. A concise summary (max 3 sentences).
      2. A list of action items (max 5).
      3. A catchy, relevant suggested title.

      Format the output as a JSON object with keys: "summary", "actionItems" (array of strings), and "suggestedTitle".

      Note Content:
      ${note.content}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response (sometimes LLMs wrap it in code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const aiData = JSON.parse(jsonMatch[0]);

    // Update note with AI insights
    note.summary = aiData.summary || '';
    note.actionItems = aiData.actionItems || [];
    note.suggestedTitle = aiData.suggestedTitle || '';
    note.aiUsageCount = (note.aiUsageCount || 0) + 1;
    
    await note.save();

    return NextResponse.json({ 
      summary: note.summary,
      actionItems: note.actionItems,
      suggestedTitle: note.suggestedTitle
    });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
