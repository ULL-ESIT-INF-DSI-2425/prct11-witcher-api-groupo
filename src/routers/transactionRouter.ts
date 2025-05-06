import express from "express";
import { Transaction } from "../models/transactionModel.js";
// import { Client } from "../models/clientModel.js";
import { Merchant } from "../models/merchantModel.js";
import { Good } from "../models/goodModel.js";
import { TransactionType } from "../enums/transactionType.js";
// import { Types } from "mongoose";
// import { TransactionDocument } from "../interfaces/transactionDocument.js";

export const transactionRouter = express.Router();

/**
 * Post a new transaction (sold) to the database
 */


transactionRouter.post("/transactions/buy", async (req, res) => {
  try {
    const { merchantName, items} = req.body;
    const merchant = await Merchant.findOne({ name: merchantName }); // Find the merchant by name
    if (!merchant) {
      res.status(404).send({ error: "Merchant not found" });
      return;
    }
    if (!items || items.length === 0) {
      res.status(400).send({ error: "No items provided" });
      return;
    }
    const goodsInTransaction = []; // Array to store the goods in the transaction
    let totalValue = 0; // Initialize total value to 0
    for (const item of items) { // Iterate over each item in the items array
      const { 
        name: goodName,
        quantity,
        value: goodValue,
        material, 
        weight,
        description,
        id: goodId,
        stock,
      } = item; // Destructure the item object
      let good = await Good.findOne({ name: goodName }); // Find the good by name
      if (!good) {
        const newGood = new Good({
          id: goodId,
          name: goodName,
          value: goodValue,
          material,
          weight,
          description,
          stock,
        });
        try {
          const savedGood = await newGood.save(); // Save the new good to the database
          goodsInTransaction.push({ good: savedGood._id, quantity }); // Add the new good to the transaction
          totalValue += goodValue * quantity; // Update the total value (at the end will be the total money of the transaction)
  
        } catch (err) {
          console.error(err);
          res.status(500).send({ error: "Error saving good" });
        }
      } else {
        goodsInTransaction.push({ good: good._id, quantity }); // Add the existing good to the transaction
        totalValue += good.value * quantity; // Update the total value (at the end will be the total money of the transaction)
        // aumentar el stock del good
        good.stock += quantity; // Increase the stock of the good
      }
    }
    const transaction = new Transaction({
      type: TransactionType.BUY,
      merchant: merchant._id,
      goods: goodsInTransaction,
      date: new Date(),
      totalValue,
    });
    await transaction.save(); // Save the transaction to the database
    res.status(201).send(transaction); // Send the transaction as a response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});



