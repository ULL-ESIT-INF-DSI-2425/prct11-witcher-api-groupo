import { model } from "mongoose";
import { GoodDocument } from "../interfaces/goodDocument.js";
import { GoodSchema } from "../schemas/goodSchema.js";

/**
 * Model representing a good in the database.
 * @constant
 * @type {model<GoodDocument>}
 */
export const Good = model<GoodDocument>("Good", GoodSchema);
