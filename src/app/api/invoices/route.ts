import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Client from '@/models/Client';
import Admin from '@/models/Admin';
import { requireAuth, requireAdmin } from '@/lib/middleware';
import { CreateInvoiceData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query: any = { isActive: true };
    
    // If user is a client, only show their invoices
    if (user.role === 'client') {
      query.clientId = user.id;
    } else if (clientId) {
      // Admin can filter by specific client
      query.clientId = clientId;
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .populate('clientId', 'firstName lastName email businessName entityName')
        .populate('assignedAdminId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Invoice.countDocuments(query)
    ]);

    return NextResponse.json({ 
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    
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
    
    // Only admins can create invoices
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const invoiceData: CreateInvoiceData = body;

    // Validate required fields
    if (!invoiceData.clientId || !invoiceData.serviceName || !invoiceData.dueDate) {
      return NextResponse.json(
        { error: 'Client ID, service name, and due date are required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await Client.findById(invoiceData.clientId);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    // Find Invoice Number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last invoice for this month
    const lastInvoice = await Invoice.findOne({
      invoiceNumber: new RegExp(`^INV-${year}${month}-`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    const invoiceNumber = `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
    // Create invoice with admin as the assigned admin
    const invoice = new Invoice({
      ...invoiceData,
      assignedAdminId: user.id,
      issueDate: new Date(),
      invoiceNumber: invoiceNumber,
    });

    await invoice.save();

    // Populate the created invoice
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('assignedAdminId', 'firstName lastName email')

    return NextResponse.json({ 
      invoice: populatedInvoice,
      message: 'Invoice created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Create invoice error:', error);
    
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'Invoice number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
