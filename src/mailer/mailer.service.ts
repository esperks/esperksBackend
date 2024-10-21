import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configure the mailoptions object
// const mailOptions = {
//   from: process.env.EMAIL_USER,
//   to: "yourfriend@email.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };

// Send the email
// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log("Error:", error);
//   } else {
//     console.log("Email sent: " + info.response);
//   }
// });

const sendMail = async (data: {
  to: string;
  subject: string;
  text: string;
}) => {
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER,
    to: data.to,
    subject: data.subject,
    text: data.text,
  };
  return await transporter.sendMail(mailOptions);
};

export const mailerService = {
  sendMail,
};
