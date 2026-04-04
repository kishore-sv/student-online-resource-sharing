import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        async sendResetPassword(data: any, request: any) {
            await resend.emails.send({
                from: "StudyHub <onboarding@resend.dev>",
                to: data.user.email,
                subject: "Reset your password",
                text: `Reset your password by clicking here: ${data.url}`,
            });
        },
        async sendVerificationEmail(data: any, request: any) {
            await resend.emails.send({
                from: "StudyHub <onboarding@resend.dev>",
                to: data.user.email,
                subject: "Verify your email",
                text: `Verify your email by clicking here: ${data.url}`,
            });
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
    user: {
        additionalFields: {
            collegeName: {
                type: "string",
                required: false,
                defaultValue: "",
            },
            username: {
                type: "string",
                required: true,
            },
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                const subject =
                    type === "email-verification" ? "Verify your email" :
                        type === "forget-password" ? "Reset your password" :
                            "Verification code";

                await resend.emails.send({
                    from: "StudyHub <onboarding@resend.dev>",
                    to: email,
                    subject,
                    text: `Your verification code is: ${otp}`,
                });
            }
        })
    ]
});
