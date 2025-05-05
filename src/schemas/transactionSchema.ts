import { TransactionDocument } from "../interfaces/transactionDocument.js";
import validator from "validator";
import { Schema, Types } from "mongoose";
import { TransactionType } from "../enums/transactionType.js";
import { GoodSchema } from "./goodSchema.js";
// import { ClientSchema } from "./clientSchema.js";
// import { MerchantSchema } from "./merchantSchema.js";
// import { ClientDocument } from "../interfaces/clientDocument.js";
// import { MerchantDocument } from "../interfaces/merchantDocument.js";
import { GoodDocument } from "../interfaces/goodDocument.js";
import { Merchant } from "../models/merchantModel.js";
import { Client } from "../models/clientModel.js";
import { goodsRouter } from "../routers/goodsRouter.js";
import { Good } from "../models/goodModel.js";

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
        if (ClientId) { // Check if ClientId is provided
          const client = await Client.findById(ClientId);
          if (!client) {
            throw new Error("Client does not exist");
          } 
        } else {
          throw new Error("Client ID is required");
        }
        return true; // Return true if the client exists
      }
      // lanzar error si no existe el cliente

      
    }
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: "Merchant", // Reference to the Merchant schema
    required: false,
    default: null,
    validate: {
      validator: async (merchantId: Types.ObjectId | undefined | null) => {
        if (merchantId) { // Check if merchantId is provided
          const merchant = await Merchant.findById(merchantId);
          if (!merchant) {
            throw new Error("Merchant does not exist");
          } 
        } else {
          throw new Error("Merchant ID is required");
        }
        return true; // Return true if the merchant exists
      }
    }
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
            if (!good) {
              throw new Error("Good does not exist");
            }
            return !!good; // Return true if the good exists
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
    required: true,
    validate: (value: Date) => {
      if (!validator.isDate(value.toString())) {
        throw new Error("Invalid date format");
      }
    },
  },
  totalValue: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error("Total value must be a positive number");
      }
    },
  },

})