import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    refreshToken: { type: String },
    avatar: { type: String },
    googleId: { type: String, unique: true },
});

export default mongoose.model("User", userSchema);

