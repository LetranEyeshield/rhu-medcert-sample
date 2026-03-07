// new code with text index for better search performance
import mongoose, { Schema, model, models } from "mongoose";

const PatientSchema = new Schema(
  {
    patientId: { type: String, required: true },
    fullname: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    dateSigned: { type: String, required: true },
    diagnosis: { type: String, required: true },
    remarks: { type: String, required: true },
  },
  { timestamps: true },
);

// ⭐ SEARCH INDEX
PatientSchema.index({ fullname: "text" });

const Patient = models.Patient || model("Patient", PatientSchema);
export default Patient;
