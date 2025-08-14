import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASS);
  return nodemailer.createTransport({
    service: "gmail",
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"TaxingCRM" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Generate OTP email HTML template
export function generateOTPEmailHTML(otp: string, firstName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code - TaxingCRM</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                margin-top: 20px;
                margin-bottom: 20px;
            }
            .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 2px solid #f0f0f0;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #2563eb;
                margin: 0;
                font-size: 28px;
            }
            .content {
                padding: 20px 0;
            }
            .otp-box {
                background-color: #f8fafc;
                border: 2px dashed #2563eb;
                border-radius: 10px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #2563eb;
                letter-spacing: 5px;
                font-family: 'Courier New', monospace;
            }
            .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                padding: 20px 0;
                border-top: 2px solid #f0f0f0;
                margin-top: 30px;
                color: #6b7280;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>TaxingCRM</h1>
            </div>
            
            <div class="content">
                <h2>Hello ${firstName},</h2>
                <p>You have requested to log in to your TaxingCRM client account. Please use the following One-Time Password (OTP) to complete your login:</p>
                
                <div class="otp-box">
                    <div class="otp-code">${otp}</div>
                    <p style="margin: 10px 0 0 0; color: #6b7280;">This code expires in 10 minutes</p>
                </div>
                
                <p>Enter this code on the login page to access your account.</p>
                
                <div class="warning">
                    <strong>Security Notice:</strong>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                        <li>Never share this code with anyone</li>
                        <li>TaxingCRM staff will never ask for your OTP</li>
                        <li>If you didn't request this code, please ignore this email</li>
                    </ul>
                </div>
                
                <p>If you have any questions or need assistance, please contact our support team.</p>
                
                <p>Best regards,<br>
                <strong>TaxingCRM Team</strong></p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2024 TaxingCRM. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Generate plain text version of OTP email
export function generateOTPEmailText(otp: string, firstName: string): string {
  return `
Hello ${firstName},

You have requested to log in to your TaxingCRM client account. Please use the following One-Time Password (OTP) to complete your login:

Your OTP Code: ${otp}

This code expires in 10 minutes.

Enter this code on the login page to access your account.

SECURITY NOTICE:
- Never share this code with anyone
- TaxingCRM staff will never ask for your OTP
- If you didn't request this code, please ignore this email

If you have any questions or need assistance, please contact our support team.

Best regards,
TaxingCRM Team

This is an automated message. Please do not reply to this email.
© 2024 TaxingCRM. All rights reserved.
  `;
}
