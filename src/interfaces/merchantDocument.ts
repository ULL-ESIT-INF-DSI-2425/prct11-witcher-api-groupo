import { Locations } from "../enums/locations.js";
import { MerchantType } from "../enums/merchantType.js";
import { Document } from "mongoose";

/**
 * Interface representing a merchant document in the database.
 * @interface MerchantDocument
 * @extends Document
 * @property {number} id - The unique identifier for the merchant.
 * @property {string} name - The name of the merchant.
 * @property {Locations} location - The location of the merchant.
 * @property {MerchantType} merchantType - The type of the merchant.
 */
export interface MerchantDocument extends Document {
  id: number;
  name: string;
  location: Locations;
  merchantType: MerchantType;
}
