import fs from "fs";
import path from "path";
import { IncomingForm, Fields, Files } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  function getFieldString(field: any) {
  if (Array.isArray(field)) return field[0] || "";
  return field || "";
}

  if (req.method !== "POST") return res.status(405).end();

  const uploadsDir = path.join(process.cwd(), "public/assets/uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const form = new IncomingForm({
    uploadDir: uploadsDir,
    keepExtensions: true,
    // maxFileSize: 200 * 1024,
  });

  const parseForm = () =>
    new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

  try {
    const { fields, files } = await parseForm();
let file = files.file;
if (!file) return res.status(400).json({ error: "No file" });
if (Array.isArray(file)) file = file[0]; // <-- Fix: use the first file if it's an array

const brand = getFieldString(fields.brand).toLowerCase().replace(/\s+/g, "_");
const collectionType = getFieldString(fields.collectionType).toLowerCase().replace(/\s+/g, "_");
const originalName = file.originalFilename || file.newFilename || "upload.png";
const safeOriginal = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
const filename = `${brand}_${collectionType}_${safeOriginal}`;
const destPath = path.join(uploadsDir, filename);
fs.renameSync(file.filepath, destPath);

return res.status(200).json({ url: `/assets/uploads/${filename}` });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(400).json({ error: "Upload failed" });
  }
}