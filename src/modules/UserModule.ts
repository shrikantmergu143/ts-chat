import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  _id: any;
  username: string;
  user_id: string;
  password: string;
  profile_url: string;
  first_name: string;
  last_name: string;
  social_links: string[];
  date_of_birth: string;
  description: string;
  address: string;
  phone: string;
  personal_link: string[];
  city: string;
  state: string;
  country: string;
  pin_code: string;
  created_at: Date;
  updated_at: Date;
  resume: string;
  user_type: string;
  is_admin: boolean;
  status: string;
  active: boolean;
  is_deleted: boolean;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true },
  username: { type: String },
  user_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(), // Auto-generate if not provided
  },
  password: { type: String },
  profile_url: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  social_links: { type: [String] },
  date_of_birth: { type: String },
  description: { type: String },
  address: { type: String },
  phone: { type: String },
  personal_link: { type: [String] },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pin_code: { type: String },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
  resume: { type: String, default: "" },
  user_type: { type: String, required: true, default: "user" },
  is_admin: { type: Boolean, required: true, default: false },
  status: { type: String, required: true, default: "active" },
  active: { type: Boolean, required: true, default: true },
  is_deleted: { type: Boolean, required: true, default: false },
});

// Create the model using the interface
const UserModule = mongoose.model<IUser>("user", userSchema);

export default UserModule;
