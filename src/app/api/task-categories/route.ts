import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TaskCategory from '@/models/TaskCategory';
import { requireAuth, requireAdmin } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);

    // Get all active categories (default + custom ones created by admin)
    let query: any = { isActive: true };

    if (user.role === 'admin') {
      // Admin can see default categories + their own custom categories
      query = {
        isActive: true,
        $or: [
          { isDefault: true },
          { createdByAdminId: user.id }
        ]
      };
    } else {
      // Clients can only see default categories + categories created by their admin
      // We'll need to get the client's assigned admin first
      query = { isActive: true, isDefault: true };
    }

    const categories = await TaskCategory.find(query)
      .select('name description isDefault')
      .sort({ isDefault: -1, name: 1 }); // Default categories first, then alphabetical

    return NextResponse.json({ categories });

  } catch (error) {
    console.error('Get task categories error:', error);
    
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
    const user = requireAdmin(request);

    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await TaskCategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      isActive: true
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    // Create new category
    const category = new TaskCategory({
      name: name.trim(),
      description: description?.trim(),
      createdByAdminId: user.id,
      isDefault: false,
    });

    await category.save();

    return NextResponse.json({
      message: 'Category created successfully',
      category: {
        _id: category._id,
        name: category.name,
        description: category.description,
        isDefault: category.isDefault
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create task category error:', error);
    
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
