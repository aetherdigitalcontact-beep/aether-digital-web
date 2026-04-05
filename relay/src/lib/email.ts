import nodemailer from 'nodemailer';
import { renderEmailTemplate, EmailOptions } from './emailTemplates';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (options: EmailOptions & { to: string }) => {
    const { to, ...templateOptions } = options;
    const { subject, html } = renderEmailTemplate(templateOptions);

    try {
        await transporter.sendMail({
            from: options.fromName ? `"${options.fromName}" <${process.env.EMAIL_USER}>` : `"RELAY Deployment⚡" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error('Email Delivery Error:', error);
        return { success: false, error };
    }
};
