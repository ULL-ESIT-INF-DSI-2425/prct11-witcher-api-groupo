import express from "express";
import { Client } from "../models/clientModel.js";

export const clientRouter = express.Router();

/**
 * Post a new client to the database
 * 
 * @route POST /hunters
 * @param req - Objeto de solicitud que contiene los datos del cliente en `req.body`.
 * @param res - Objeto de respuesta utilizado para enviar el resultado al cliente.
 * @returns {void} Devuelve una respuesta HTTP con el cliente creado o un error.
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
 * 
 * @route GET /hunters
 * @param req - Objeto de solicitud que contiene los parámetros de consulta.
 * @param res - Objeto de respuesta utilizado para enviar el resultado al cliente.
 * @returns {void} Devuelve una respuesta HTTP con los clientes encontrados o un error.
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
 * 
 * @route GET /hunters/:id
 * @param req - Objeto de solicitud que contiene el ID del cliente en los parámetros de la ruta.
 * @param res - Objeto de respuesta utilizado para enviar el resultado al cliente.
 * @returns {void} Devuelve una respuesta HTTP con el cliente encontrado o un error.
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
 * 
 * @route PATCH /hunters
 * @param req - Objeto de solicitud que contiene el nombre del cliente en los parámetros de consulta y los datos a actualizar en el cuerpo.
 * @param res - Objeto de respuesta utilizado para enviar el resultado al cliente.
 * @returns {void} Devuelve una respuesta HTTP con el cliente actualizado o un error.
 */
clientRouter.patch("/hunters", async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: "A name must be provided",
    });
  } else if (!req.body || Object.keys(req.body).length === 0) {
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
      )
        .then((client) => {
          if (!client) {
            res.status(404).send("No client found");
          } else {
            res.status(201).send(client);
          }
        })
        .catch(() => {
          res.status(500).send();
        });
    }
  }
});

/**
 * Updates a client from the database with the information of the query
 * 
 * @route PATCH /hunters/:id
 * @param req - Objeto de solicitud que contiene el ID del cliente en los parámetros de la ruta y los datos a actualizar en el cuerpo.
 * @param res - Objeto de respuesta utilizado para enviar el resultado al cliente.
 * @returns {void} Devuelve una respuesta HTTP con el cliente actualizado o un error.
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
      })
        .then((client) => {
          if (!client) {
            res.status(404).send("No client found");
          } else {
            res.status(201).send(client);
          }
        })
        .catch(() => {
          res.status(500).send();
        });
    }
  }
});

/**
 * Deletes a client from the database with the given id of mongoDB
 * 
 * @route DELETE /hunters
 * @param req - Objeto de solicitud que contiene el nombre del cliente en los parámetros de consulta.
 * @param res - Objeto de respuesta utilizado para enviar el resultado al cliente.
 * @returns {void} Devuelve una respuesta HTTP con el cliente eliminado o un error.
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
 * 
 * @route DELETE /hunters/:id
 * @param req - Objeto de solicitud que contiene el ID del cliente en los parámetros de la ruta.
 * @param res - Objeto de respuesta utilizado para enviar el resultado al cliente.
 * @returns {void} Devuelve una respuesta HTTP con el cliente eliminado o un error.
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
