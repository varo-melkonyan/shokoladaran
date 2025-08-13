import nodemailer from "nodemailer";

export default async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "melkonyan.varo@gmail.com",
      pass: "azil uocl etdr baog",
    },
  });

  try {
    await transporter.sendMail({
        from: `"Shokoladaran" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
    } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
    }
}

// user: process.env.EMAIL_USER!,
//       pass: process.env.EMAIL_PASS!,
// import nodemailer from "nodemailer";

// export default async function sendEmail(to: string, subject: string, html: string) {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.hostinger.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "contact@shokoladaran.am",
//       pass: "wb98K6Me;",
//     },
//   });

//   await transporter.sendMail({
//     from: `"Shokoladaran" <contact@shokoladaran.am>`,
//     to,
//     subject,
//     html,
//   });
// }