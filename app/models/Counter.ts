// models/Counter.ts

import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: Number,
});

export default mongoose.models.Counter ||
  mongoose.model("Counter", CounterSchema);