const nodemailer = require('nodemailer')
const ejs = require("ejs");
const path = require("path");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    service: process.env.SERVICE_MAIL,
    port: Number(process.env.PORT_MAIL),
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL
    },
})

const sendMail = async (secretCode, subject, email) => {
    try {
        const emailTemplatePath = path.join(__dirname, "..", "views", "emails", "requestResetPassword.ejs");

        const html = await ejs.renderFile(emailTemplatePath, { secretCode })

        await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject,
            html,
        })
    } catch (error) {
        console.log('Something wrong at sendMail function: ', error);
    }
}

const sendReservationMail = async (accept = true, subject, email, orderData = {}) => {
    try {
        const reservationTemplatePath = path.join(__dirname, "..", "views", "emails", "reservationMail.ejs");

        orderData.date = orderData.date.split('T')[0];

        const html = await ejs.renderFile(reservationTemplatePath, { accept, orderData })

        await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject,
            html,
        })
    } catch (error) {
        console.log('Something wrong at sendMail function: ', error);
    }
}

module.exports = { sendMail, sendReservationMail }
