import { Document } from "mongodb";
import { ClientDocument } from "./clientDocument.js";
import { MerchantDocument } from "./merchantDocument.js";
import { GoodDocument } from "./goodDocument.js";
import { TransactionType } from "../enums/transactionType.js";
import { Schema } from "mongoose";

/**
 * Interface for a transaction document in the database.
 * @interface TransactionDocument
 * @extends Document
 * @property {number} id - The unique identifier for the transaction.
 * @property {TransactionType} type - The type of the transaction (e.g., purchase, refund).
 * @property {Schema.Types.ObjectId | ClientDocument | null} [client] - The client associated with the transaction.
 * @property {Schema.Types.ObjectId | MerchantDocument | null} [merchant] - The merchant associated with the transaction.
 * @property {Array<{ good: Schema.Types.ObjectId | GoodDocument; quantity: number; }>} goods - The goods involved in the transaction, including their quantities.
 * @property {Date} date - The date of the transaction.
 */
export interface TransactionDocument extends Document {
  id: number;
  type: TransactionType;
  client?: Schema.Types.ObjectId | ClientDocument | null;
  merchant?: Schema.Types.ObjectId | MerchantDocument | null;
  goods: {
    good: Schema.Types.ObjectId | GoodDocument;
    quantity: number;
  }[];
  date: Date;
  totalValue: number;
}
