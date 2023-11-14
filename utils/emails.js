const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ashlee27@ethereal.email',
        pass: 'xusVSFMXzP3MyahdMU'
    }
});

async function sendEmail({from,to,subject,text,html}) {
    await transporter.sendMail({
        from: `'"${from.split("@")[0]}" <${from}>'`,
        to: to,
        subject,
        text,
        html
    })
}

async function sendVerificationEmail(email,verificationToken) {
    await sendEmail({
        from: "verification@buchal.me",
        to: email,
        subject: "Verificate your email!",
        html: `<h1>Please verificate your email <a href="http://localhost:3001/verifyEmail?verificationToken=${verificationToken}&email=${email}" target="_blank" rel="noopener noreferrer">here</a></h1>`
    })
}

module.exports = {
    sendEmail,
    sendVerificationEmail
}