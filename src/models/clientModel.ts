import { model } from "mongoose";
import { ClientDocument } from "../interfaces/clientDocument.js";
import { ClientSchema } from "../schemas/clientSchema.js";

/**
 * Model representing a client in the database.
 * @constant
 * @type {model<GoodDocument>}
 */
export const Client = model<ClientDocument>("Client", ClientSchema);
