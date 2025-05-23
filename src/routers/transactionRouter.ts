import express from "express";
import { Transaction } from "../models/transactionModel.js";
import { Client } from "../models/clientModel.js";
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
    const { id: transactionId, merchantName, items } = req.body;
    // destructure the request body
    const merchant = await Merchant.findOne({ name: merchantName }); // Find the merchant by name
    if (!merchant) {
      res.status(404).send({ error: "Merchant not found" });
      return;
    }
    if (!items || items.length === 0) {
      res.status(404).send({ error: "No items provided" });
      return;
    }
    const goodsInTransaction = []; // Array to store the goods in the transaction
    let totalValue = 0; // Initialize total value to 0
    for (const item of items) {
      // Iterate over each item in the items array
      const { name: goodName, quantity } = item; // Destructure the item to get the name and quantity
      let good = await Good.findOne({ name: goodName }); // Find the good by name
      if (!good) {
        const newGood = new Good({
          // ...item, // Create a new good with the item properties
          id: item.id,
          name: goodName,
          description: item.description,
          material: item.material,
          weight: item.weight,
          value: item.value,
          stock: quantity,
        });
        try {
          const savedGood = await newGood.save(); // Save the new good to the database
          goodsInTransaction.push({ good: savedGood._id, quantity }); // Add the new good to the transaction
          totalValue += savedGood.value * quantity; // Update the total value (at the end will be the total money of the transaction)
        } catch (err) {
          console.error(err);
          res.status(500).send({ error: "Error saving good" });
        }
      } else if (good) {
        // console.log("Good already exists");
        goodsInTransaction.push({ good: good._id, quantity }); // Add the existing good to the transaction
        totalValue += good.value * quantity; // Update the total value (at the end will be the total money of the transaction)
        // aumentar el stock del good
        good.stock = good.stock + quantity; // Update the stock of the good
        // actualizar el good en la base de datos
        await good.save();
      }
    }
    const transaction = new Transaction({
      id: transactionId,
      type: TransactionType.BUY,
      merchant: merchant._id,
      goods: goodsInTransaction,
      date: new Date(),
      totalValue,
    });
    await transaction.save(); // Save the transaction to the database
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("merchant", "id name") // Populate specific merchant fields
      .populate("goods.good"); // Populate specific good fields
    res.status(201).send(populatedTransaction); // Send the populated transaction as a response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error adding buy transaction" });
  }
});

/**
 * Post a new transaction (sold) to the database
 */

transactionRouter.post("/transactions/sell", async (req, res) => {
  try {
    const { id: transactionId, clientName, items } = req.body; // Destructure the request body
    const client = await Client.findOne({ name: clientName }); // Find the client by name
    if (!client) {
      res.status(404).send({ error: "Client not found" });
      return;
    }
    if (!items || items.length === 0) {
      res.status(400).send({ error: "No items provided" });
      return;
    }
    const goodsInTransaction = []; // Array to store the goods in the transaction
    let totalValue = 0; // Initialize total value to 0
    for (const item of items) {
      // Iterate over each item in the array of items implicated
      const { name: goodName, quantity } = item; // destructure the item to check if exist in DB
      let good = await Good.findOne({ name: goodName }); // Find the good by name
      if (!good) {
        // in case the good does not exist
        res.status(404).send({ error: "Good not found" });
        return;
      }
      if (good.stock < quantity || good.stock === 0) {
        // Check if the stock is enough
        res.status(400).send({ error: "Not enough stock" });
        return;
      }
      goodsInTransaction.push({ good: good._id, quantity }); // Add the existing good to the transaction
      totalValue += good.value * quantity; // Update the total value (at the end will be the total money of the transaction)
      // disminuir el stock del good
      good.stock = good.stock - quantity; // Update the stock of the good
      // actualizar el good en la base de datos
      await good.save(); // Save the good to the database
    }
    const transaction = new Transaction({
      id: transactionId,
      type: TransactionType.SELL,
      client: client._id,
      goods: goodsInTransaction,
      date: new Date(),
      totalValue,
    });
    await transaction.save(); // Save the transaction to the database
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("client", "id name") // Populate specific client fields
      .populate("goods.good"); // Populate specific good fields
    res.status(201).send(populatedTransaction); // Send the transaction as a response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error adding sell transaction" });
  }
});

/**
 * Get transactions by merchant or client name
 */

transactionRouter.get("/transactions", async (req, res) => {
  // Get the name from the query
  const filter = req.query.name ? { name: req.query.name.toString() } : {}; // filter by name if provided from query
  // find merchant or client by name
  Merchant.find(filter)
    .then(async (merchants) => {
      if (merchants.length !== 0) {
        const transactions = await Transaction.find({
          merchant: merchants[0]._id,
        })
          .populate("client", "id name") // Populate specific client fields
          .populate("merchant", "id name") // Populate specific merchant fields
          .populate("goods.good"); // Populate specific good fields
        res.status(200).send(transactions); // Send the transactions as a response
      } else {
        Client.find(filter)
          .then(async (clients) => {
            if (clients.length !== 0) {
              const transactions = await Transaction.find({
                client: clients[0]._id,
              })
                .populate("client", "id name") // Populate specific client fields
                .populate("merchant", "id name") // Populate specific merchant fields
                .populate("goods.good"); // Populate specific good fields
              res.status(200).send(transactions); // Send the transactions as a response
            } else {
              res.status(404).send("No transactions found");
            }
          })
          .catch(() => {
            res.status(500).send();
          });
      }
    })
    .catch(() => {
      res.status(500).send();
    });
});

/**
 * Get a transaction by id
 */
transactionRouter.get("/transactions/:id", async (req, res) => {
  try {
    const id = req.params.id; // Get the id from the request params
    if (!id) {
      res.status(400).send("Please provide an id");
      return;
    }
    const transaction = await Transaction.find({
      $or: [
        // $or operator to find by client or merchant id in mongoDB
        { client: id }, // Find by client id
        { merchant: id }, // Find by merchant id
      ],
    })
      .populate("client", "id name") // Populate specific client fields
      .populate("merchant", "id name") // Populate specific merchant fields
      .populate("goods.good"); // Populate specific good fields
    if (!transaction) {
      res.status(404).send("Transaction not found");
      return;
    }
    res.status(200).send(transaction); // Send the transaction as a response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error getting transaction" });
  }
});

/**
 * Get transactions by date
 */

transactionRouter.get("/transactions/date/simple", async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Get the start and end date from the request query
    if (!startDate || !endDate) {
      res.status(400).send("Please provide start and end date");
      return;
    }
    const start = new Date(startDate.toString());
    const end = new Date(endDate.toString());
    const transactions = await Transaction.find({
      date: {
        $gte: start, // Greater than or equal to start date
        $lte: end, // Less than or equal to end date
      },
    })
      .populate("client", "id name") // Populate specific client fields
      .populate("merchant", "id name") // Populate specific merchant fields
      .populate("goods.good"); // Populate specific good fields
    res.status(200).send(transactions); // Send the transactions as a response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error getting transactions by date" });
  }
});

/**
 * Delete a transaction by id
 */

transactionRouter.delete("/transactions/:id", async (req, res) => {
  try {
    const id = req.params.id; // Get the id from the request params
    if (!id) {
      res.status(400).send("Please provide an id");
      return;
    }
    // buscar la transaccion por id y aumentar el stock de los goods implicados y borrar la transaccion
    const transaction = await Transaction.findByIdAndDelete(id); // Find and delete the transaction by id
    if (!transaction) {
      res.status(404).send("Transaction not found");
      return;
    }
    const goods = transaction.goods; // Get the goods from the transaction
    for (const item of goods) {
      // Iterate over each item in the goods array
      const good = await Good.findById(item.good); // Find the good by id
      if (good) {
        good.stock = good.stock + item.quantity; // Update the stock of the good
        await good.save(); // Save the good to the database
      }
    }
    res.status(200).send(transaction); // Send the deleted transaction as a response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error deleting transaction" });
  }
});

/**
 * Patch a transaction by id
 */

transactionRouter.patch("/transactions/:id", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    // in case of no body provided
    res.status(400).send("Please provide a body");
    return;
  } else {
    const allowedUpdates = [
      "client",
      "merchant",
      "goods",
      "date",
      "totalValue",
    ];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );
    if (!isValidUpdate) {
      res.status(400).send("Invalid updates");
      return;
    } else {
      Transaction.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        // Checks if the modified fields are valid
      })
        .then(async (transaction) => {
          if (!transaction) {
            // in case of no transaction to modify found
            res.status(404).send("No transaction found");
          } else {
            // populate the goods and the merchant
            const populatedTransaction = await Transaction.findById(
              transaction._id,
            )
              .populate("client", "id name") // Populate specific client fields
              .populate("merchant", "id name") // Populate specific merchant fields
              .populate("goods.good"); // Populate specific good fields
            // send the populated transaction
            res.status(200).send(populatedTransaction); // Send the transaction as a response
          }
        })
        .catch(() => {
          res.status(500).send();
        });
    }
  }
});
