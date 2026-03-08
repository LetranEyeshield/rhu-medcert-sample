// new code with text index for better search performance
import mongoose, { Schema, model, models } from "mongoose";

const FittoworkSchema = new Schema(
  {
    patientId: { type: String, required: true },
    fullname: { type: String, required: true },
    age: { type: String, required: true },
    address: { type: String, required: true },
    dateSigned: { type: String, required: true },
    remarks: { type: String, required: true },
    dateDone: { type: String, required: true },
  },
  { timestamps: true },
);

const Fittowork = models.Fittowork || model("Fittowork", FittoworkSchema);
export default Fittowork;
