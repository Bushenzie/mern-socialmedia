const nodemailer = require("nodemailer");

const domain = "http://localhost:3000"

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail({from,to,subject,text,html}) {
    await transporter.sendMail({
        from: `'"${from.split("@")[0]}" <${from}>'`,
        to: to,
        subject,
        text: text || "",
        html: html || ""
    })
}

async function sendVerificationEmail(email,verificationToken) {
    await sendEmail({
        from: "support@buchal.me",
        to: email,
        subject: "Verificate your email!",
        html: `<h1>Please verificate your email <a href="${domain}/verifyEmail?verificationToken=${verificationToken}&email=${email}" target="_blank" rel="noopener noreferrer">here</a></h1>`
    })
}

async function sendResetPasswordEmail(email,verificationToken) {
    await sendEmail({
        from: "support@buchal.me",
        to: email,
        subject: "Request to reset password!",
        html: `<h1>You requested a help about reset of your password, click <a href="${domain}/resetPassword?verificationToken=${verificationToken}&email=${email}" target="_blank" rel="noopener noreferrer">here</a> to change your password</h1>`
    })
}

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendResetPasswordEmail
}