import express from "express";
import { Merchant } from "../models/merchantModel.js";

export const merchantsRouter = express.Router();

/**
 * Post a new merchant to the database
 */

merchantsRouter.post("/merchants", async (req, res) => {
  const merchant = new Merchant(req.body);
  try {
    await merchant.save();
    res.status(201).send(merchant);
  } catch (error) {
    res.status(501).send(error);
  }
});
/**
 * Finds a merchant from the database matching the query
 */
merchantsRouter.get("/merchants", async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}: {}; // filter by name if provided from query
  Merchant.find(filter).then((merchants) => {
    if (merchants.length !== 0) {
      res.send(merchants);
    } else {
      res.status(404).send("No merchants found");
    }
  }).catch(() => {
    res.status(500).send();
  });
});
/**
 * Finds a merchant from the database with the given id of mongoDB
 */
merchantsRouter.get("/merchants/:id", async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      res.status(404).send();
      return;
    }
    res.send(merchant);
  } catch (error) {
    res.status(500).send(error);
  }
});
/**
 * Updates a merchant from the database with the information of the query
 */
merchantsRouter.patch("/merchants", async (req, res) => {
  if (!req.query.name) { // in case of no name provided
    res.status(400).send("Please provide an id");
    return;
  } else if (!req.body || Object.keys(req.body).length === 0) { // in case of no body provided
    res.status(400).send("Please provide an body to update");
    return;
  } else {
    const allowedUpdates = ["location", "merchantType"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      res.status(400).send("Invalid updates");
      return;
    } else {
      Merchant.findOneAndUpdate({name: req.query.name?.toString()}, req.body, {
        new: true,
        runValidators: true,
        // Checks if the modified fields are valid
      }).then((merchant) => {
        if (!merchant) { // in case of no merchant to modify found
          res.status(404).send("No merchant found");
        } else {
          res.send(merchant);
        }
      }).catch(() => {
        res.status(500).send();
      });
    }
  }
})

/**
 * Updates the merchant with the given id of mongoDB from parameter
 */

merchantsRouter.patch("/merchants/:id", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) { // in case of no body provided
    res.status(400).send("Please provide an body to update");
    return;
  } else {
    const allowedUpdates = ["location", "merchantType"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      res.status(400).send("Invalid updates");
      return;
    } else {
      Merchant.findByIdAndUpdate(Object(req.params.id), req.body, {
        new: true,
        runValidators: true,
        // Checks if the modified fields are valid
      }).then((merchant) => {
        if (!merchant) { // in case of no merchant to modify found
          res.status(404).send("No merchant found");
        } else {
          res.send(merchant);
        }
      }).catch(() => {
        res.status(500).send();
      });
    }
  }
})