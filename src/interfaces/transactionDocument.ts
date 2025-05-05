import { Document } from "mongodb";
import { ClientDocument } from "./clientDocument.js";
import { MerchantDocument } from "./merchantDocument.js";
import { GoodDocument } from "./goodDocument.js";


import { TransactionType } from "../enums/transactionType.js";
import { Schema } from "mongoose";


export interface TransactionDocument extends Document {
  id: number;
  type: TransactionType;
  client?: Schema.Types.ObjectId | ClientDocument | null;
  merchant?: Schema.Types.ObjectId | MerchantDocument | null;
  goods: {
    good: Schema.Types.ObjectId | GoodDocument;
    quantity: number;
  } [];
  date: Date;
  totalValue: number;

}