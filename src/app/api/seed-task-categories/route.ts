import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TaskCategory from '@/models/TaskCategory';
import Admin from '@/models/Admin';

const defaultCategories = [
  { name: 'Tax Prep', description: 'Individual and business tax preparation services' },
  { name: 'Amendment', description: 'Tax return amendments and corrections' },
  { name: 'Tax Resolution', description: 'IRS tax problem resolution services' },
  { name: 'Transaction Renewal', description: 'Business transaction renewals' },
  { name: 'ITIN Renewal', description: 'Individual Taxpayer Identification Number renewals' },
  { name: 'Tax Planning', description: 'Strategic tax planning services' },
  { name: 'General Consultation', description: 'General tax and business consultation' },
  { name: 'Individual Tax Prep', description: 'Individual tax return preparation' },
  { name: 'S-Corp Tax Prep (1120-S)', description: 'S-Corporation tax return preparation' },
  { name: 'C-Corp Tax Prep (1120)', description: 'C-Corporation tax return preparation' },
  { name: 'Partnership Tax Prep (1065)', description: 'Partnership tax return preparation' },
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get the first admin to assign as creator of default categories
    const firstAdmin = await Admin.findOne({}).select('_id');
    
    if (!firstAdmin) {
      return NextResponse.json(
        { error: 'No admin found. Please create an admin first.' },
        { status: 400 }
      );
    }

    // Check if default categories already exist
    const existingCategories = await TaskCategory.find({ isDefault: true });
    
    if (existingCategories.length > 0) {
      return NextResponse.json(
        { message: 'Default categories already exist', count: existingCategories.length },
        { status: 200 }
      );
    }

    // Create default categories
    const categoriesToCreate = defaultCategories.map(cat => ({
      ...cat,
      createdByAdminId: firstAdmin._id,
      isDefault: true,
    }));

    const createdCategories = await TaskCategory.insertMany(categoriesToCreate);

    return NextResponse.json({
      message: 'Default task categories created successfully',
      count: createdCategories.length,
      categories: createdCategories.map(cat => ({
        _id: cat._id,
        name: cat.name,
        description: cat.description,
        isDefault: cat.isDefault
      }))
    }, { status: 201 });

  } catch (error) {
    console.error('Seed task categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
