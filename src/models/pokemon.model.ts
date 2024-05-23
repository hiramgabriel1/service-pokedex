// import { mongoose } from "../connection";
import mongoose from "mongoose";
import { Schema, Document, model } from "mongoose";

interface Pokemon extends Document {
  name: string;
  type: string;
  imageUrl: string;
}

const pokemonSchema = new Schema<Pokemon>({
  name: String,
  type: String,
  imageUrl: String
});
const PokemonModel = mongoose.model<Pokemon>("pokemon", pokemonSchema);

export { PokemonModel };