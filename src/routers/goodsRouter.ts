import express from "express";
import { Good } from "../models/goodModel.js";

export const goodsRouter = express.Router();

/**
 * Post a new good to the database
 */
goodsRouter.post("/goods", async (req, res) => {
  try {
    const { name, stock } = req.body;

    const existingGood = await Good.findOne({ name });

    if (existingGood) {
      existingGood.stock += stock || 0;
      await existingGood.save();
      res.status(200).send(existingGood);
    } else {
      const good = new Good(req.body);
      await good.save();
      res.status(201).send(good);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Finds a good from the database matching the query
 */
goodsRouter.get("/goods", async (req, res) => {
  try {
    const query = req.query;
    const goods = await Good.find(query);
    if (goods.length === 0) {
      res.status(404).send();
      return;
    }
    res.status(200).send(goods);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Finds a good from the database with the given id of mongoDB
 */
goodsRouter.get("/goods/:id", async (req, res) => {
  try {
    const good = await Good.findById(req.params.id);
    if (!good) {
      res.status(404).send();
      return;
    }
    res.send(good);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Updates a good from the database with the information of the query
 */
goodsRouter.patch("/goods", async (req, res) => {
  try {
    const query = req.query;
    const goods = await Good.find(query);

    if (goods.length === 0) {
      res.status(404).send();
      return;
    }

    const allowedUpdates = [
      "id",
      "name",
      "description",
      "material",
      "weight",
      "value",
      "stock",
    ];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(406).send({
        error: "Update is not permitted",
      });
      return;
    }

    const updatedGoods = [];
    for (const good of goods) {
      Object.assign(good, req.body);
      await good.save();
      updatedGoods.push(good);
    }

    res.send(updatedGoods);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Updates a good from the database with the given id of mongoDB
 */
goodsRouter.patch("/goods/:id", async (req, res) => {
  try {
    const good = await Good.findById(req.params.id);
    if (!good) {
      res.status(404).send();
      return;
    }

    const allowedUpdates = [
      "id",
      "name",
      "description",
      "material",
      "weight",
      "value",
      "stock",
    ];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(406).send({
        error: "Update is not permitted",
      });
      return;
    }

    Object.assign(good, req.body);
    await good.save();
    res.send(good);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Deletes a good from the database with the query
 */
goodsRouter.delete("/goods", async (req, res) => {
  try {
    const query = req.query;
    const goods = await Good.find(query);

    if (goods.length === 0) {
      res.status(404).send();
      return;
    }

    const deletedGoods = [];
    for (const good of goods) {
      await good.deleteOne();
      deletedGoods.push(good);
    }

    res.send(deletedGoods);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Deletes a good from the database with the given id of mongoDB
 */
goodsRouter.delete("/goods/:id", async (req, res) => {
  try {
    const good = await Good.findById(req.params.id);
    if (!good) {
      res.status(404).send();
      return;
    }
    await good.deleteOne();
    res.send(good);
  } catch (error) {
    res.status(400).send(error);
  }
});
