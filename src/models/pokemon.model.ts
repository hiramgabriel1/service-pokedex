import mongoose from "mongoose";
import { Schema, Document, model } from "mongoose";

interface Entrenador extends Document {
  name: string;
  lastName: string;
  phoneNumber: number;
  gymAwards: string;
}

const entrenadorSchema = new Schema<Entrenador>({
  name: String,
  lastName: String,
  phoneNumber: Number,
  gymAwards: String,
});

const EntrenadorModel = mongoose.model<Entrenador>("entrenador", entrenadorSchema);

export { EntrenadorModel };

// modificar por datos de entrenador