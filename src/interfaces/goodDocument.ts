import { Document } from "mongoose";
import { Materials } from "../enums/materials.js";

/**
 * Interface representing a good document in the database.
 * @interface GoodDocument
 * @extends Document
 * @property {number} id - The unique identifier for the good.
 * @property {string} name - The name of the good.
 * @property {string} description - A description of the good.
 * @property {Materials} material - The material of the good.
 * @property {number} weight - The weight of the good.
 * @property {number} value - The value of the good.
 */
export interface GoodDocument extends Document {
  id: number;
  name: string;
  description: string;
  material: Materials;
  weight: number;
  value: number;
}
