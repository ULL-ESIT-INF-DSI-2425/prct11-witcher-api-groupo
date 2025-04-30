import express from "express";
import { Good } from "../models/goodModel.js";

export const goodsRouter = express.Router();

/**
 * Post a new good to the database
 */
goodsRouter.post("/goods", async (req, res) => {
  const good = new Good(req.body);
  try {
    await good.save();
    res.status(201).send(good);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Finds a good from the database matching the query
 */
goodsRouter.get("/goods", async (req, res) => {
  try {
    const query = req.query;
    const goods = await Good.find(query);
    res.status(200).send(goods);
  } catch (error) {
    res.status(500).send(error);
  }
});


// NO SE POR QUE NO ME DEJA HACER EL GET CON EL ID
// ME SALE UN ERROR DE COMPILACION DE SOBRECARGA DE METODO
// /**
//  * Finds a good from the database with the given id of mongoDB
//  */
// goodsRouter.get('/goods/:id', async (req, res) => {
//   try {
//     const good = await Good.findById(req.params.id);
//     if (!good) {
//       return res.status(404).send();
//     }
//     res.send(good);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });
