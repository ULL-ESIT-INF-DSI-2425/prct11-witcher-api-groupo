import { model } from "mongoose";
import { MerchantDocument } from "../interfaces/merchantDocument.js";
import { MerchantSchema } from "../schemas/merchantSchema.js";

/**
 * Model representing a merchant in the database.
 * @constant
 * @type {model<MerchantDocument>}
 */
export const Merchant = model<MerchantDocument>("Merchant", MerchantSchema);
