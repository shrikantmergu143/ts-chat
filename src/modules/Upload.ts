import mongoose, { Schema, Document } from "mongoose";

export interface IUpload extends Document {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: Date;
  created_at: Date;
  updated_at: Date;
}

const UploadSchema = new Schema<IUpload>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    created_at: { type: Date, default: Date.now, },
    updated_at: { type: Date, default: Date.now, },
  },
);

export default mongoose.model<IUpload>("Upload", UploadSchema);
