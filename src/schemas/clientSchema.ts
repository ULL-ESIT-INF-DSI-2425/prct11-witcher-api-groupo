import { Schema } from "mongoose";
import { Locations } from "../enums/locations.js";
import { Races } from "../enums/races.js";
import { ClientDocument } from "../interfaces/clientDocument.js";

/**
 * Schema representing a client in the database.
 * @constant
 * @type {Schema<ClientDocument>}
 * @property {number} id - The unique identifier for the client.
 * @property {string} name - The name of the client.
 * @property {Races} race - The race of the client.
 * @property {Locations} location - The location of the client.
 */
export const ClientSchema = new Schema<ClientDocument>({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: (value: number) => {
      if (value < 0 || !Number.isInteger(value)) {
        throw new Error("Client ID must be a positive integer");
      }
    },
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error("Client name must start with a capital letter");
      } else if (value === "") {
        throw new Error("Client name cannot be empty");
      }
    },
  },
  race: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: Object.values(Races),
  },
  location: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: Object.values(Locations),
  },
});
