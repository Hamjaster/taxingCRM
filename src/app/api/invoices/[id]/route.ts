import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { requireAuth, requireAdmin } from '@/lib/middleware';
import { UpdateInvoiceData } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const invoice = await Invoice.findOne({ 
      _id: params.id, 
      isActive: true 
    })
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('assignedAdminId', 'firstName lastName email')

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (user.role === 'client' && invoice.clientId._id.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ invoice });

  } catch (error) {
    console.error('Get invoice error:', error);
    
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = requireAuth(request);
    
    // Only admins can update invoices
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: UpdateInvoiceData = body;

    const invoice = await Invoice.findOne({ 
      _id: params.id, 
      isActive: true 
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Update invoice fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateInvoiceData] !== undefined) {
        (invoice as any)[key] = updateData[key as keyof UpdateInvoiceData];
      }
    });

    await invoice.save();

    // Return updated invoice with populated fields
    const updatedInvoice = await Invoice.findById(invoice._id)
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('assignedAdminId', 'firstName lastName email')
    

    return NextResponse.json({ 
      invoice: updatedInvoice,
      message: 'Invoice updated successfully' 
    });

  } catch (error) {
    console.error('Update invoice error:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = requireAuth(request);
    
    // Only admins can delete invoices
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const invoice = await Invoice.findOne({ 
      _id: params.id, 
      isActive: true 
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Soft delete - set isActive to false
    invoice.isActive = false;
    await invoice.save();

    return NextResponse.json({ 
      message: 'Invoice deleted successfully' 
    });

  } catch (error) {
    console.error('Delete invoice error:', error);
    
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
