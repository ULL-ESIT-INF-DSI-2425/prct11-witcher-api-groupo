import { TransactionDocument } from "../interfaces/transactionDocument.js";
import { Schema, Types } from "mongoose";
import { TransactionType } from "../enums/transactionType.js";
import { Merchant } from "../models/merchantModel.js";
import { Client } from "../models/clientModel.js";
import { Good } from "../models/goodModel.js";

export const TransactionSchema = new Schema<TransactionDocument>({
  id: {
    type: Number,
    required: false,
    unique: false,
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
    ref: "Client", 
    required: false,
    default: null,
    validate: {
      validator: async (ClientId: Types.ObjectId | undefined | null) => {
        if (ClientId) { 
          const client = await Client.findById(ClientId);
          return !!client; 
        } 
        return true; 
      },
      
    },
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: "Merchant", 
    required: false,
    default: null,
    validate: {
      validator: async (merchantId: Types.ObjectId | undefined | null) => {
        if (merchantId) { 
          const merchant = await Merchant.findById(merchantId);
          return !!merchant; 
        } 
        return true; 
      },
    },
  },
  goods: [
    {
      good: {
        type: Schema.Types.ObjectId,
        ref: "Good",
        required: true,
        validate: {
          validator: async (GoodId: Types.ObjectId) => {
            const good = await Good.findById(GoodId);
            return !!good; 
          },
        },
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  totalValue: {
    type: Number,
    required: false,
    min: 0,
  },
});