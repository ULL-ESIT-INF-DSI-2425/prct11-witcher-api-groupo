import { Document } from "mongoose";
import { Races } from "../enums/races.js";
import { Locations } from "../enums/locations.js";

/**
 * Interface representing a client document in the database.
 * @interface ClientDocument
 * @extends Document
 * @property {number} id - The unique identifier for the client.
 * @property {string} name - The name of the client.
 * @property {Races} race - The race of the client.
 * @property {Locations} location - The location of the client.
 */
export interface ClientDocument extends Document {
  id: number;
  name: string;
  race: Races;
  location: Locations;
}
