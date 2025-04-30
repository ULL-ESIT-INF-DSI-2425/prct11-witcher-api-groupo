import { MerchantDocument } from "../interfaces/merchantDocument.js";
import { Locations } from "../enums/locations.js";
import { MerchantType } from "../enums/merchantType.js";
import { Schema } from "mongoose";
import validator from "validator";

/**
 * Schema representing a merchant in the database.
 * @constant
 * @type {Schema}
 * @property {number} id - The unique identifier for the merchant.
 * @property {string} name - The name of the merchant.
 * @property {string} location - The location of the merchant.
 * @property {string} merchantType - The type of the merchant.
 */
export const MerchantSchema = new Schema<MerchantDocument>({
  id: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
    validate: (value: number) => {
      if (value < 0 || !Number.isInteger(value)) {
        throw new Error("Merchant ID must be a positive integer");
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
        throw new Error("Name must start with a capital letter");
      } else if (!validator.default.isAlpha(value)) {
        throw new Error("Name must contain only letters");
      }
    },
  },
  location: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: Object.values(Locations),
  },
  merchantType: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: Object.values(MerchantType),
  },
});
