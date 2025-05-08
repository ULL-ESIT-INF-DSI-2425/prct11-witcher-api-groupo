import { model } from "mongoose";
import { TransactionDocument } from "../interfaces/transactionDocument.js";
import { TransactionSchema } from "../schemas/transactionSchema.js";

/**
 * Model representing a transaction in the database.
 * @constant
 * @type {model<TransactionDocument>}
 */
export const Transaction = model<TransactionDocument>(
  "Transaction",
  TransactionSchema,
);
