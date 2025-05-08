import { TransactionDocument } from "../interfaces/transactionDocument.js";
// import validator from "validator";
import { Schema, Types } from "mongoose";
import { TransactionType } from "../enums/transactionType.js";
// import { GoodSchema } from "./goodSchema.js";
// import { ClientSchema } from "./clientSchema.js";
// import { MerchantSchema } from "./merchantSchema.js";
// import { ClientDocument } from "../interfaces/clientDocument.js";
// import { MerchantDocument } from "../interfaces/merchantDocument.js";
// import { GoodDocument } from "../interfaces/goodDocument.js";
import { Merchant } from "../models/merchantModel.js";
import { Client } from "../models/clientModel.js";
// import { goodsRouter } from "../routers/goodsRouter.js";
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
    ref: "Client", // Reference to the Client schema
    required: false,
    default: null,
    validate: {
      validator: async (ClientId: Types.ObjectId | undefined | null) => {
        if (ClientId) { // Check if ClientId is provided
          const client = await Client.findById(ClientId);
          return !!client; // Return true if the client exists
        } 
        return true; // Return true if the client exists
      },
      // lanzar error si no existe el cliente
    },
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
          return !!merchant; // Return true if the merchant exists
        } 
        return true; // Return true if the merchant exists
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
  // validar que el array sea mayor a 0
  // validate: {
  //   validate: function (this: TransactionDocument) {
  //     return this.goods.length > 0; // Ensure the goods array has at least one item
  //   }
  // },

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