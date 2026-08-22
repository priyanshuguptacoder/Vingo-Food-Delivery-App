import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const sendEmail = async ({ to, subject, htmlContent }) => {
    try {
        if (!process.env.BREVO_API_KEY) {
            throw new Error("BREVO_API_KEY is missing")
        }

        if (!process.env.EMAIL) {
            throw new Error("EMAIL is missing")
        }

        if (!to) {
            throw new Error("Recipient email is missing")
        }

        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "Vingo",
                    email: process.env.EMAIL
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject,
                htmlContent
            },
            {
                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json"
                },
                timeout: 15000
            }
        )

        console.log("Brevo email sent:", response.data)

        return response.data
    } catch (error) {
        console.error(
            "BREVO EMAIL ERROR:",
            error.response?.data || error.message
        )

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to send email"
        )
    }
}

export const sendOtpMail = async (to, otp) => {
    return sendEmail({
        to,
        subject: "Vingo Password Reset OTP",
        htmlContent: `
            <p>
                Your OTP for password reset is
                <b>${otp}</b>.
            </p>
            <p>This OTP expires in 5 minutes.</p>
        `
    })
}

export const sendDeliveryOtpMail = async (user, otp) => {
    if (!user?.email) {
        throw new Error("User email not found")
    }

    return sendEmail({
        to: user.email,
        subject: "Vingo Delivery OTP",
        htmlContent: `
            <h2>Vingo Delivery Verification</h2>
            <p>
                Your OTP for delivery is
                <b>${otp}</b>.
            </p>
            <p>This OTP expires in 5 minutes.</p>
        `
    })
}
