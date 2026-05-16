import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Total Notes
    const totalNotes = await Note.countDocuments({ userId });

    // 2. Recently Edited (last 5)
    const recentlyEdited = await Note.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title updatedAt');

    // 3. Most Used Tags
    const tagAggregation = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 4. AI Usage Stats
    const aiUsage = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalAiOps: { $sum: '$aiUsageCount' } } }
    ]);

    // 5. Weekly Activity Summary (Dummy/Simulated for now, usually needs a separate Activity log)
    // We can simulate it by grouping notes created/updated in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyActivity = await Note.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          updatedAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      totalNotes,
      recentlyEdited,
      topTags: tagAggregation,
      totalAiOps: aiUsage[0]?.totalAiOps || 0,
      weeklyActivity
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import mongoose from 'mongoose';
