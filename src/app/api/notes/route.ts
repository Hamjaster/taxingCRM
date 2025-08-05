import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import Project from '@/models/Project';
import { requireAuth } from '@/lib/middleware';
import { CreateNoteData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this project
    let projectQuery: any = { _id: projectId, isActive: true };
    if (user.role === 'client') {
      projectQuery.clientId = user.id;
    }

    const project = await Project.findOne(projectQuery);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Build notes query based on user role
    let notesQuery: any = { projectId };
    
    if (user.role === 'client') {
      // Clients can only see notes that are visible to them
      notesQuery.isVisibleToClient = true;
    }
    // Admins can see all notes

    const notes = await Note.find(notesQuery)
      .populate('authorId', 'firstName lastName role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ notes });

  } catch (error) {
    console.error('Get notes error:', error);
    
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const body: CreateNoteData = await request.json();
    const { projectId, content, isVisibleToClient, attachments } = body;

    // Validate required fields
    if (!projectId || !content) {
      return NextResponse.json(
        { error: 'Project ID and content are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this project
    let projectQuery: any = { _id: projectId, isActive: true };
    if (user.role === 'client') {
      projectQuery.clientId = user.id;
    }

    const project = await Project.findOne(projectQuery);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Create note
    const note = new Note({
      projectId,
      authorId: user.id,
      content: content.trim(),
      isVisibleToClient: user.role === 'admin' ? (isVisibleToClient || false) : true,
      isInternal: user.role === 'admin' ? !isVisibleToClient : false,
      attachments: attachments || [],
    });

    await note.save();

    // Populate the created note
    await note.populate('authorId', 'firstName lastName role');

    return NextResponse.json({ 
      message: 'Note created successfully',
      note 
    }, { status: 201 });

  } catch (error) {
    console.error('Create note error:', error);
    
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
