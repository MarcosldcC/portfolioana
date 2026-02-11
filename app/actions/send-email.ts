'use server';

import nodemailer from 'nodemailer';

interface SendEmailData {
    to: string;
    subject: string;
    message: string;
    replyTo: string;
}

export async function sendEmail(data: SendEmailData) {
    try {
        // Configure your SMTP transporter here.
        // For Gmail, you typically need to use an "App Password" if 2FA is enabled.
        // Check ".env" or your deployment secrets for these variables.
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or 'smtp.gmail.com'
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your App Password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: data.to,
            replyTo: data.replyTo,
            subject: data.subject,
            text: data.message, // Plain text body
            // html: '<p>' + data.message + '</p>' // HTML body content
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: (error as Error).message };
    }
}
