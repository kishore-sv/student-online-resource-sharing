import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

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
        async sendResetPassword(data: any, request: any) {
            console.log("Send reset password email", data.user.email, data.url);
            // Implement your email sending logic here (e.g., using Resend or Nodemailer)
        },
        async sendVerificationEmail(data: any, request: any) {
            console.log("Send verification email", data.user.email, data.url);
            // Implement your email sending logic here
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
            role: {
                type: "string",
                required: false,
                defaultValue: "student",
            },
        },
    },
});
