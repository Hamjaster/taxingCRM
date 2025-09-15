import { NextRequest, NextResponse } from 'next/server';
import { EmailOptions, sendEmail } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json();
    
    const emailOptions: EmailOptions = {
      to,
      subject,
      html,
      text,
    };

    const success = await sendEmail(emailOptions);

    if (success) {
      return NextResponse.json({ message: 'Email sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
