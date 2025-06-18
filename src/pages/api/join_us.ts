import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    fullName, phone, email, brandName, website,
    facebook, instagram, type, about, description,
  } = req.body;

  // Configure your transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shokoladaranmarketplace@gmail.com",
      pass: "YOUR_APP_PASSWORD", // Use an App Password, not your Gmail password!
    },
  });

  const mailOptions = {
    from: "shokoladaranmarketplace@gmail.com",
    to: "shokoladaranmarketplace@gmail.com",
    subject: "New Join Us Request",
    text: `
        Full Name: ${fullName}
        Phone: ${phone}
        Email: ${email}
        Brand Name: ${brandName}
        Website: ${website}
        Facebook: ${facebook}
        Instagram: ${instagram}
        Type: ${type}
        About: ${about}
        Description: ${description}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" });
  }
}