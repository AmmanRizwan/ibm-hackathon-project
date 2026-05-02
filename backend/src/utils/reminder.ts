import { sendEmail } from "../services/smtp";

export const sendReminder = async () => {
    try {
        await sendEmail({
            to: "admin@example.com",
            subject: "Payment Reminder",
            template: "reminder/reminder",
            context: {}
        });
    }
    catch (err) {
        console.error("Error sending email", err);
    }
}