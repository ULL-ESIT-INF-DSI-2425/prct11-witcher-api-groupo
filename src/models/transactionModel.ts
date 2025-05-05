import { model } from "mongoose";
import { TransactionDocument } from "../interfaces/transactionDocument.js";
import { TransactionSchema } from "../schemas/transactionSchema.js";

export const Transaction = model<TransactionDocument>("Transaction", TransactionSchema);