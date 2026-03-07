// lib/generatePatientId.ts

import Counter from "@/app/models/Counter";

export async function generatePatientId() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "patientId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const year = new Date().getFullYear();

  const number = String(counter.seq).padStart(6, "0");

  return `PT-${year}-${number}`;
}