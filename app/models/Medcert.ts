// new code with text index for better search performance
import mongoose, { Schema, model, models } from "mongoose";

const MedcertSchema = new Schema(
  {
    fullname: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    dateSigned: { type: String, required: true },
    diagnosis: { type: String, required: true },
    remarks: { type: String, required: true },
  },
  { timestamps: true },
);


const Medcert = models.Medcert || model("Medcert", MedcertSchema);
export default Medcert;
