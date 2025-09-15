import { EmailOptions } from './nodemailer';

export interface NotificationEmailData {
  clientEmail: string;
  clientName: string;
  adminName: string;
  type: 'DOCUMENT_UPLOADED' | 'TASK_CREATED' | 'TASK_STATUS_UPDATED' | 'INVOICE_CREATED';
  message: string;
  additionalData?: {
    documentName?: string;
    folderName?: string;
    taskTitle?: string;
    taskStatus?: string;
    invoiceNumber?: string;
    invoiceAmount?: number;
  };
}

export async function sendNotificationEmail(data: NotificationEmailData): Promise<boolean> {
  try {
    const { subject, html, text } = generateEmailContent(data);
    
    const emailOptions: EmailOptions = {
      to: data.clientEmail,
      subject,
      html,
      text,
    };

    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailOptions),
    });

    if (!response.ok) {
      console.error('Failed to send email:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    return false;
  }
}

function generateEmailContent(data: NotificationEmailData): { subject: string; html: string; text: string } {
  const { clientName, adminName, type, message, additionalData } = data;
  
  let subject = '';
  let title = '';
  let description = '';
  let actionText = '';

  switch (type) {
    case 'DOCUMENT_UPLOADED':
      subject = `New Document Uploaded - TaxingCRM`;
      title = 'Document Uploaded';
      description = `A new document has been uploaded to your folder${additionalData?.folderName ? ` "${additionalData.folderName}"` : ''}.`;
      actionText = 'Please log in to your client dashboard to view the document.';
      break;
    
    case 'TASK_CREATED':
      subject = `New Task Assigned - TaxingCRM`;
      title = 'New Task Created';
      description = `A new task has been assigned to you${additionalData?.taskTitle ? `: "${additionalData.taskTitle}"` : ''}.`;
      actionText = 'Please log in to your client dashboard to view task details and update progress.';
      break;
    
    case 'TASK_STATUS_UPDATED':
      subject = `Task Status Updated - TaxingCRM`;
      title = 'Task Status Updated';
      description = `The status of your task has been updated to: ${additionalData?.taskStatus || 'Updated'}.`;
      actionText = 'Please log in to your client dashboard to view the updated task status.';
      break;
    
    case 'INVOICE_CREATED':
      subject = `New Invoice Generated - TaxingCRM`;
      title = 'New Invoice Available';
      description = `A new invoice has been generated for you${additionalData?.invoiceNumber ? ` (Invoice #${additionalData.invoiceNumber})` : ''}.`;
      actionText = 'Please log in to your client dashboard to view and pay the invoice.';
      break;
    
    default:
      subject = `Notification - TaxingCRM`;
      title = 'New Notification';
      description = message;
      actionText = 'Please log in to your client dashboard for more details.';
  }

  const html = generateEmailHTML(clientName, adminName, title, description, actionText, additionalData);
  const text = generateEmailText(clientName, adminName, title, description, actionText, additionalData);

  return { subject, html, text };
}

function generateEmailHTML(
  clientName: string,
  adminName: string,
  title: string,
  description: string,
  actionText: string,
  additionalData?: NotificationEmailData['additionalData']
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - TaxingCRM</title>
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
            .notification-box {
                background-color: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                padding: 25px;
                margin: 25px 0;
            }
            .notification-title {
                font-size: 20px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 15px;
            }
            .notification-description {
                font-size: 16px;
                color: #374151;
                margin-bottom: 20px;
            }
            .action-box {
                background-color: #dbeafe;
                border-left: 4px solid #2563eb;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
            }
            .cta-button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin: 15px 0;
            }
            .cta-button:hover {
                background-color: #1d4ed8;
            }
            .details {
                background-color: #f9fafb;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
            }
            .details h3 {
                margin: 0 0 10px 0;
                color: #374151;
                font-size: 16px;
            }
            .details p {
                margin: 5px 0;
                color: #6b7280;
                font-size: 14px;
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
                <h2>Hello ${clientName},</h2>
                
                <div class="notification-box">
                    <div class="notification-title">${title}</div>
                    <div class="notification-description">${description}</div>
                    
                    ${additionalData ? `
                    <div class="details">
                        <h3>Details:</h3>
                        ${additionalData.documentName ? `<p><strong>Document:</strong> ${additionalData.documentName}</p>` : ''}
                        ${additionalData.folderName ? `<p><strong>Folder:</strong> ${additionalData.folderName}</p>` : ''}
                        ${additionalData.taskTitle ? `<p><strong>Task:</strong> ${additionalData.taskTitle}</p>` : ''}
                        ${additionalData.taskStatus ? `<p><strong>Status:</strong> ${additionalData.taskStatus}</p>` : ''}
                        ${additionalData.invoiceNumber ? `<p><strong>Invoice #:</strong> ${additionalData.invoiceNumber}</p>` : ''}
                        ${additionalData.invoiceAmount ? `<p><strong>Amount:</strong> $${additionalData.invoiceAmount.toFixed(2)}</p>` : ''}
                    </div>
                    ` : ''}
                    
                    <div class="action-box">
                        <p><strong>Action Required:</strong> ${actionText}</p>
                        <a href="${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000/client/dashboard'}" class="cta-button text-white">
                            Go to Client Dashboard
                        </a>
                    </div>
                </div>
                
                <p>This notification was sent by <strong>${adminName}</strong> from your TaxingCRM team.</p>
                
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

function generateEmailText(
  clientName: string,
  adminName: string,
  title: string,
  description: string,
  actionText: string,
  additionalData?: NotificationEmailData['additionalData']
): string {
  let details = '';
  if (additionalData) {
    const detailLines = [];
    if (additionalData.documentName) detailLines.push(`Document: ${additionalData.documentName}`);
    if (additionalData.folderName) detailLines.push(`Folder: ${additionalData.folderName}`);
    if (additionalData.taskTitle) detailLines.push(`Task: ${additionalData.taskTitle}`);
    if (additionalData.taskStatus) detailLines.push(`Status: ${additionalData.taskStatus}`);
    if (additionalData.invoiceNumber) detailLines.push(`Invoice #: ${additionalData.invoiceNumber}`);
    if (additionalData.invoiceAmount) detailLines.push(`Amount: $${additionalData.invoiceAmount.toFixed(2)}`);
    
    if (detailLines.length > 0) {
      details = '\n\nDetails:\n' + detailLines.map(line => `- ${line}`).join('\n');
    }
  }

  return `
Hello ${clientName},

${title}

${description}${details}

Action Required: ${actionText}

Please log in to your client dashboard at: ${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000/client/dashboard'}

This notification was sent by ${adminName} from your TaxingCRM team.

If you have any questions or need assistance, please contact our support team.

Best regards,
TaxingCRM Team

This is an automated message. Please do not reply to this email.
© 2024 TaxingCRM. All rights reserved.
  `;
}
