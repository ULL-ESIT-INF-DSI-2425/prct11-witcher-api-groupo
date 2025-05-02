import express from "express";

export const defaultRouter = express.Router();

/**
 * Handles all requests to the default router
 * This is a catch-all route that returns a 501 Not Implemented status
 * for any request that does not match the defined routes.
 */
defaultRouter.all("/{*splat}", (_, res) => {
  res.status(501).send();
});
