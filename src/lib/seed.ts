import connectDB from './mongodb';
import ServiceType from '@/models/ServiceType';
import User from '@/models/User';
import Admin from '@/models/Admin';
import Client from '@/models/Client';
import { hashPassword } from './auth';

const defaultServiceTypes = [
  {
    name: '1040 Filing',
    description: 'Individual income tax return preparation and filing',
  },
  {
    name: 'BOI Report',
    description: 'Beneficial Ownership Information reporting',
  },
  {
    name: 'LLC Setup',
    description: 'Limited Liability Company formation and setup',
  },
  {
    name: 'Corporation Setup',
    description: 'Corporation formation and setup',
  },
  {
    name: 'Quarterly Tax Filing',
    description: 'Quarterly business tax return preparation and filing',
  },
  {
    name: 'Bookkeeping',
    description: 'Monthly bookkeeping and financial record maintenance',
  },
  {
    name: 'Payroll Services',
    description: 'Payroll processing and tax compliance',
  },
  {
    name: 'Tax Planning',
    description: 'Strategic tax planning and consultation',
  },
  {
    name: 'Audit Support',
    description: 'IRS audit representation and support',
  },
  {
    name: 'Business Consultation',
    description: 'General business and financial consultation',
  },
];

export async function seedServiceTypes() {
  try {
    await connectDB();

    // Check if service types already exist
    const existingCount = await ServiceType.countDocuments();
    if (existingCount > 0) {
      console.log('Service types already exist, skipping seed');
      return;
    }

    // Create service types
    await ServiceType.insertMany(defaultServiceTypes);
    console.log('Service types seeded successfully');

  } catch (error) {
    console.error('Error seeding service types:', error);
    throw error;
  }
}

export async function createDefaultAdmin() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping creation');
      return;
    }

    // Create default admin
    const hashedPassword = await hashPassword('admin123');
    
    const admin = new User({
      email: 'admin@taxingcrm.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'admin',
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    await admin.save();
    console.log('Default admin created successfully');
    console.log('Email: admin@taxingcrm.com');
    console.log('Password: admin123');
    console.log('Phone: +1234567890 (for Firebase OTP testing)');

  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
}

export async function createTestClient() {
  try {
    await connectDB();

    // Check if test client already exists
    const existingClient = await Client.findOne({ email: 'testclient@example.com' });
    if (existingClient) {
      console.log('Test client already exists, skipping creation');
      return;
    }

    // Find the default admin to assign the client to
    const admin = await Admin.findOne({ email: 'admin@taxingcrm.com' });
    if (!admin) {
      console.log('Default admin not found, please run seed first');
      return;
    }

    // Create test client
    const hashedPassword = await hashPassword('client123');
    
    const client = new Client({
      email: 'testclient@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Client',
      phone: '+1234567890',
      assignedAdminId: admin._id,
      clientType: 'Individual',
      isActive: true,
      isEmailVerified: false,
    });

    await client.save();
    console.log('Test client created successfully');
    console.log('Email: testclient@example.com');
    console.log('Password: client123');

  } catch (error) {
    console.error('Error creating test client:', error);
    throw error;
  }
}

export async function seedDatabase() {
  try {
    await seedServiceTypes();
    await createDefaultAdmin();
    await createTestClient();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
