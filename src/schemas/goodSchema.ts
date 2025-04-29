import { Schema } from "mongoose";
import { Materials } from "../enums/materials.js";
import { GoodDocument } from "../interfaces/goodDocument.js";

/**
 * Schema representing a good in the database.
 * @constant
 * @type {Schema}
 * @property {number} id - The unique identifier for the good.
 * @property {string} name - The name of the good.
 * @property {string} description - A description of the good.
 * @property {Materials} material - The material of the good.
 * @property {number} weight - The weight of the good.
 * @property {number} value - The value of the good.
 */
export const GoodSchema = new Schema<GoodDocument>({
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: (value: number) => {
      if (value < 0 || !Number.isInteger(value)) {
        throw new Error("Good ID must be a positive integer");
      }
    },
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error("Good name must start with a capital letter");
      } else if (value === "") {
        throw new Error("Good name cannot be empty");
      }
    },
  },
  description: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (value === "") {
        throw new Error("Good description cannot be empty");
      }
    },
  },
  material: {
    type: String,
    required: true,
    trim: true,
    enum: Object.values(Materials),
    validate: (value: string) => {
      if (!Object.values(Materials).includes(value as Materials)) {
        throw new Error("Invalid material");
      }
    },
  },
  weight: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error("Good weight must be a positive number");
      }
    },
  },
  value: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error("Good value must be a positive number");
      }
    },
  },
});
