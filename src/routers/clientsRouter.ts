import express from "express";
import { Client } from "../models/clientModel.js";

export const clientRouter = express.Router();

/**
 * Post a new client to the database
 */
clientRouter.post("/hunters", async (req, res) => {
  const client = new Client(req.body);
  try {
    await client.save();
    res.status(201).send(client);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Finds a client from the database matching the query
 */
clientRouter.get("/hunters", async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const clients = await Client.find(filter);

    if (clients.length !== 0) {
      res.status(202).send(clients);
    } else {
      res.status(404).send("No clients found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Finds a client from the database with the given id of mongoDB
 */
clientRouter.get("/hunters/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      res.status(404).send();
      return;
    }
    res.status(202).send(client);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Updates a client from the database with the information of the query
 */
clientRouter.patch("/hunters", async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: "A name must be provided",
    });
  } else if(!req.body || Object.keys(req.body).length === 0){
    res.status(400).send({
      error: "A body must be provided",
    });
  } else {
    const allowedUpdates = ["id", "name", "race", "location"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(400).send({
        error: "Update is not permitted",
      });
    } else {
        await Client.findOneAndUpdate(
          {
            name: req.query.name.toString(),
          },
          req.body,
          {
            new: true,
            runValidators: true,
          },
        ).then((client) => {
          if (!client) {
            res.status(404).send("No client found");
          } else {
            res.status(201).send(client);
          }
        }).catch(() => {
          res.status(500).send();
        });
    }
  }
});

/**
 * Updates a client from the database with the information of the query
 */
clientRouter.patch("/hunters/:id", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send("A body must be provided");
    return;
  } else {
    const allowedUpdates = ["name", "race", "location"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(400).send("Update is not permitted");
      return;
    } else {
      Client.findByIdAndUpdate(Object(req.params.id), req.body, {
        new: true,
        runValidators: true,
      }).then((client) => {
          if (!client) {
            res.status(404).send("No client found");
          } else {
            res.status(201).send(client);
          }
        }).catch(() => {
          res.status(500).send();
        });
    }
  }
});

/**
 * Deletes a client from the database with the given id of mongoDB
 */
clientRouter.delete("/hunters", async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: "A name must be provided",
    });
  } else {
    try {
      const client = await Client.findOne({
        name: req.query.name.toString(),
      });

      if (!client) {
        res.status(404).send();
      } else {
        await Client.findByIdAndDelete(client._id);
        res.status(201).send(client);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

/**
 * Deletes a client from the database with the given id of mongoDB
 */
clientRouter.delete("/hunters/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      res.status(404).send();
      return;
    }
    res.status(201).send(client);
  } catch (error) {
    res.status(500).send(error);
  }
});
