import { TransactionDocument } from "../interfaces/transactionDocument.js";
import validator from "validator";
import { Schema, Types } from "mongoose";
import { TransactionType } from "../enums/transactionType.js";
import { GoodsSchema } from "./goodSchema.js";
import { ClientSchema } from "./clientSchema.js";
import { MerchantSchema } from "./merchantSchema.js";
import { ClientDocument } from "../interfaces/clientDocument.js";
import { MerchantDocument } from "../interfaces/merchantDocument.js";
import { GoodDocument } from "../interfaces/goodDocument.js";
import { Merchant } from "../models/merchantModel.js";

export const TransactionSchema = new Schema<TransactionDocument>({
  id: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
    validate: (value: number) => {
      if (value < 0 || !Number.isInteger(value)) {
        throw new Error("Transaction ID must be a positive integer");
      }
    },
  },
  type: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: Object.values(TransactionType),
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client", // Reference to the Client schema
    required: false,
    default: null,
    validate: {
      validator: async (ClientId: Types.ObjectId | undefined | null) => {
        if (ClientId) {
          const client = await ClientSchema.findById(ClientId);
          return !!client;
        }
        return true; // Allow null or undefined values
      }
      // lanzar error si no existe el cliente

      
    }
  },
})