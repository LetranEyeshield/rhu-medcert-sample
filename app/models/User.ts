import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    faceDesc: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||mongoose.model("User", UserSchema);
