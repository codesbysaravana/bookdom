import sgMail from '@sendgrid/mail';
import { Client as WorkflowClient } from "@upstash/workflow";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken,
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (subject: string, to: string, html?: string) => {
    const msg ={
        to,
        from: process.env.SENDGRID_SENDER!,
        subject,
        text: subject,
        html: html || `<strong>{subject}</strong>`,
    };

    try {
        await sgMail.send(msg); //send to sendgrid
        console.log(`Email sent to ${to}: ${subject}`);
    } catch (error: any) {
        console.log("Error sending email:", error.response?.body || error.message);
        throw error;
    }
}