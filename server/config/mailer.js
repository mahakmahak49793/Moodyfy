const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// verify connection on server start
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Mailer connection failed:", error.message);
    } else {
        console.log("✅ Mailer is ready to send emails");
    }
});

module.exports = transporter;