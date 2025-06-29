import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { Resend } from 'resend';

export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  type: 'general' | 'feedback';
  timestamp: string;
  formattedTime: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Initialize email services
let transporter: nodemailer.Transporter | null = null;
let resend: Resend | null = null;

// Configure SMTP transporter
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Configure Resend
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function sendContactEmail(contactData: EmailData): Promise<boolean> {
  const emailService = process.env.EMAIL_SERVICE || 'development';
  
  // For development, just log the email data
  if (emailService === 'development') {
    console.log('📧 [DEVELOPMENT] Email would be sent:');
    console.log('To:', process.env.EMAIL_TO || 'contact@sunmovement.vn');
    console.log('Subject:', generateEmailOptions(contactData).subject);
    console.log('Data:', contactData);
    console.log('HTML Preview:', generateEmailOptions(contactData).html);
    return true;
  }
  
  const emailOptions = generateEmailOptions(contactData);
  
  try {
    switch (emailService) {
      case 'sendgrid':
        return await sendEmailWithSendGrid(emailOptions);
      case 'resend':
        return await sendEmailWithResend(emailOptions);
      case 'smtp':
        return await sendEmailWithSMTP(emailOptions);
      default:
        throw new Error(`Unknown email service: ${emailService}`);
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

async function sendEmailWithSMTP(options: EmailOptions): Promise<boolean> {
  if (!transporter) {
    throw new Error('SMTP not configured. Please check your environment variables.');
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('SMTP email sent:', info.messageId);
  return true;
}

async function sendEmailWithSendGrid(options: EmailOptions): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid not configured. Please check your SENDGRID_API_KEY.');
  }

  const msg = {
    to: options.to,
    from: process.env.SENDGRID_FROM || 'contact@sunmovement.vn',
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await sgMail.send(msg);
  console.log('SendGrid email sent successfully');
  return true;
}

async function sendEmailWithResend(options: EmailOptions): Promise<boolean> {
  if (!resend) {
    throw new Error('Resend not configured. Please check your RESEND_API_KEY.');
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM || 'contact@sunmovement.vn',
    to: [options.to],
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    throw error;
  }

  console.log('Resend email sent:', data?.id);
  return true;
}

function generateEmailOptions(data: EmailData): EmailOptions {
  const { name, email, phone, subject, message, type, formattedTime } = data;
  const emailTo = process.env.EMAIL_TO || 'contact@sunmovement.vn';
  
  const emailSubject = type === 'feedback' 
    ? `[PHẢN HỒI] ${subject || 'Yêu cầu đặc biệt'} - ${name}`
    : `[LIÊN HỆ] ${subject || 'Tin nhắn mới'} - ${name}`;

  const textContent = `
Họ tên: ${name}
Email: ${email}
${phone ? `Số điện thoại: ${phone}` : ''}
${subject ? `Chủ đề: ${subject}` : ''}

Nội dung:
${message}

---
Thời gian: ${formattedTime}
Loại: ${type === 'feedback' ? 'Phản hồi/Yêu cầu đặc biệt' : 'Liên hệ chung'}
  `;

  const htmlContent = generateEmailHTML(data, type);

  return {
    to: emailTo,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
  };
}

function generateEmailHTML(data: EmailData, type: string): string {
  const { name, email, phone, subject, message, formattedTime } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Sun Movement</h1>
        <p style="color: white; margin: 10px 0 0 0;">
          ${type === 'feedback' ? 'Phản hồi từ khách hàng' : 'Tin nhắn liên hệ mới'}
        </p>
      </div>
      
      <div style="padding: 30px; background: white;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Thông tin liên hệ</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Họ tên:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${email}</td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Số điện thoại:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${phone}</td>
          </tr>
          ` : ''}
          ${subject ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Chủ đề:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${subject}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Thời gian:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${formattedTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Loại:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${type === 'feedback' ? 'Phản hồi/Yêu cầu đặc biệt' : 'Liên hệ chung'}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">Nội dung tin nhắn:</h3>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
            <p style="margin: 0; line-height: 1.6; color: #374151; white-space: pre-line;">${message}</p>
          </div>
        </div>
      </div>
      
      <div style="background: #1f2937; padding: 20px; text-align: center;">
        <p style="color: #9ca3af; margin: 0; font-size: 14px;">
          Email này được gửi từ website Sun Movement<br>
          Địa chỉ: Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội
        </p>
      </div>
    </div>
  `;
}
