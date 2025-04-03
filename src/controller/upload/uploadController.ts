import { Request, Response } from "express";
import cloudinary from "../../config";
import Upload from "../../modules/Upload";

export const uploadImage = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        // Convert buffer to base64
        const base64 = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64, {
            folder: "uploads",
            transformation: [{ quality: "auto:eco" }],
        });

        // Save file details to MongoDB
        const newUpload = new Upload({
            url: result.secure_url,
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        await newUpload.save();

        res.json({ message: "Upload successful", data: newUpload });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed" });
    }
};