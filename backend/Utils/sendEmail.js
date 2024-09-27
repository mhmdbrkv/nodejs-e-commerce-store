import nodemailer from "nodemailer";

export default async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, //false-587. true-465
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //------------------------------------------------//
  const emailOptions = {
    from: "e-Commerce-Store <barakamohamed946@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //------------------------------------------------//
  await transporter.sendMail(emailOptions);
};
