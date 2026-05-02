import fs from "fs";
import path from "path";

import ejs from "ejs";
import nodemailer from "nodemailer";

import env from "../config/env";
import { logger } from "../utils/logger";

const transport = nodemailer.createTransport({
    host: env.SMTP.HOST as string,
    port: parseInt(env.SMTP.PORT as string, 10),
    secure: env.SMTP.SECURE === "true",
})

interface SendEmailOptions {
    to: string | string[],
    subject: string,
    template: string,
    context: Record<string, string>,
}

async function sendEmail(options: SendEmailOptions) {
    const templatePath = path.join(__dirname, "..", "views", `${options.template}.ejs`);
    const tempate = fs.readFileSync(templatePath, "utf8");
    const html = ejs.render(tempate, options.context);

    const info = await transport.sendMail({
        from: `"${env.SMTP.NAME}" <${env.SMTP.EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html,
    });

    logger.info("Message send: %s", info.messageId);
}

export { sendEmail };